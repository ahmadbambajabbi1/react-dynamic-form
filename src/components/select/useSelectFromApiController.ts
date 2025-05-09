import {
  SelectFromApiControllerProps,
  SelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useCallback, useEffect, useState, useRef } from "react";
import { useSelectController } from "./useSelectController";
import { useFormContext } from "react-hook-form";
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
    ...selectProps
  } = props;

  const [options, setOptions] = useState<SelectOption[]>(props.options || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedRef = useRef(false);
  const prevDependentValueRef = useRef<any>(undefined);

  let formContext;
  try {
    formContext = useFormContext();
  } catch (e) {
    formContext = null;
  }

  let dependentValue = undefined;
  if (formContext && optionsApiOptions?.dependingContrllerName) {
    try {
      dependentValue = formContext.watch(
        optionsApiOptions.dependingContrllerName
      );
    } catch (e) {
      console.warn("Could not watch dependent field:", e);
    }
  }

  const baseSelect = useSelectController({
    ...selectProps,
    name,
    defaultValue,
    options,
  });

  const fetchOptions = useCallback(
    async (forceFetch: boolean = false) => {
      const shouldSkipFetch =
        !forceFetch &&
        hasFetchedRef.current &&
        dependentValue === prevDependentValueRef.current;

      if (shouldSkipFetch) return;

      if (
        optionsApiOptions?.dependingContrllerName &&
        !dependentValue &&
        !optionsApiOptions.includeAll
      ) {
        setOptions([]);
        prevDependentValueRef.current = dependentValue;
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let requestParams: Record<string, any> = {};

        if (optionsApiOptions?.params) {
          const { paramName, ...otherParams } = optionsApiOptions.params;
          Object.assign(requestParams, otherParams);

          if (
            paramName &&
            optionsApiOptions?.dependingContrllerName &&
            dependentValue
          ) {
            requestParams[paramName] = dependentValue;
          } else if (paramName) {
            requestParams[paramName] = dependentValue || "";
          }
        }

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

        Object.assign(requestParams, params);

        const response = await Axios.get(apiUrl, { params: requestParams });

        let transformedOptions;
        if (typeof transformResponse === "function") {
          transformedOptions = transformResponse(response.data.data);
        } else if (Array.isArray(response.data.data)) {
          transformedOptions = response.data.data;
        } else {
          transformedOptions = [];
        }

        setOptions(transformedOptions);
        hasFetchedRef.current = true;
        prevDependentValueRef.current = dependentValue;

        if (formContext && name) {
          try {
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
          } catch (e) {
            console.warn("Error validating current value:", e);
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
    prevDependentValueRef.current = undefined;
    return fetchOptions(true);
  }, [fetchOptions]);

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (
      optionsApiOptions?.dependingContrllerName &&
      dependentValue !== prevDependentValueRef.current
    ) {
      fetchOptions(true);
    }
  }, [dependentValue, fetchOptions, optionsApiOptions?.dependingContrllerName]);

  return {
    ...baseSelect,
    options,
    loading,
    error,
    refresh,
  };
};
