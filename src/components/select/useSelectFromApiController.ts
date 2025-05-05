// src/components/select/useSelectFromApiController.ts
import {
  SelectFromApiControllerProps,
  SelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useCallback, useEffect, useState, useRef } from "react";
import { useSelectController } from "./useSelectController";
import { useFormContext, useWatch } from "react-hook-form";
import Axios from "../../utils/axiosConfig";

export const useSelectFromApiController = (
  props: SelectFromApiControllerProps
): SelectFromApiControllerReturn => {
  const {
    apiUrl,
    params = {},
    transformResponse = (data) => data,
    defaultValue,
    optionsApiOptions,
    name,
    controller,
    ...selectProps
  } = props;

  const [options, setOptions] = useState<SelectOption[]>(props.options || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedRef = useRef(false);

  // Get form context
  const formContext = useFormContext();

  // Use useWatch to observe the dependent field
  // This will properly handle subscriptions and cleanup
  const dependentValue = optionsApiOptions?.dependingContrllerName
    ? useWatch({
        control: controller,
        name: optionsApiOptions.dependingContrllerName,
        defaultValue: undefined,
      })
    : undefined;

  console.log({ controller });

  // Create base select controller
  const baseSelect = useSelectController({
    ...selectProps,
    name,
    defaultValue,
    options,
  });

  const fetchOptions = useCallback(
    async (forceFetch: boolean = false) => {
      if (!forceFetch && hasFetchedRef.current) return;

      if (
        optionsApiOptions?.dependingContrllerName &&
        !dependentValue &&
        !optionsApiOptions.includeAll
      ) {
        setOptions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Start with base params without paramName property
        let requestParams: Record<string, any> = {};

        // Handle the paramName correctly
        if (optionsApiOptions?.params) {
          const { paramName, ...otherParams } = optionsApiOptions.params;
          Object.assign(requestParams, otherParams);

          // If we have a paramName and dependent value, use it
          if (
            paramName &&
            optionsApiOptions?.dependingContrllerName &&
            dependentValue
          ) {
            requestParams[paramName] = dependentValue;
          }
          // If we have a paramName but no dependent value, use empty string or null
          else if (paramName) {
            requestParams[paramName] = dependentValue || "";
          }
        }

        // If no paramName specified but we have a dependent controller, use default naming convention
        if (
          !optionsApiOptions?.params?.paramName &&
          optionsApiOptions?.dependingContrllerName &&
          dependentValue
        ) {
          const paramName = optionsApiOptions.dependingContrllerName.replace(
            /Id$/,
            ""
          );
          const paramToCapitalize = paramName
            ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
            : "";
          requestParams[`filterBy${paramToCapitalize}Id`] = dependentValue;
        }

        // Add any additional params from props
        Object.assign(requestParams, params);

        const response = await Axios.get(apiUrl, { params: requestParams });

        let transformedOptions;
        if (typeof transformResponse === "function") {
          transformedOptions = transformResponse(response.data);
        } else if (Array.isArray(response.data)) {
          transformedOptions = response.data;
        } else {
          transformedOptions = [];
        }

        setOptions(transformedOptions);
        hasFetchedRef.current = true;

        // Validate current value
        if (formContext && name) {
          const currentValue = formContext.getValues(name);
          const isValueValid = transformedOptions.some(
            (option: any) => option.value === currentValue
          );

          if (
            !isValueValid &&
            currentValue !== undefined &&
            currentValue !== null
          ) {
            formContext.setValue(name, null, { shouldValidate: true });
          }
        }
      } catch (err) {
        console.error("Error fetching options:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch options")
        );

        if (props.options && props.options.length > 0) {
          setOptions(props.options);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      apiUrl,
      params,
      transformResponse,
      props.options,
      dependentValue,
      optionsApiOptions,
      formContext,
      name,
    ]
  );

  const refresh = useCallback(() => {
    hasFetchedRef.current = false;
    return fetchOptions(true);
  }, [fetchOptions]);

  // Initial fetch
  useEffect(() => {
    fetchOptions();
  }, []);

  // Re-fetch when dependent value changes
  useEffect(() => {
    if (optionsApiOptions?.dependingContrllerName) {
      hasFetchedRef.current = false;
      fetchOptions(true);
    }
  }, [dependentValue, optionsApiOptions?.dependingContrllerName, fetchOptions]);

  return {
    ...baseSelect,
    options,
    loading,
    error,
    refresh,
  };
};
