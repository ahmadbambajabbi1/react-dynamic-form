// src/components/select/useMultiSelectFromApiController.ts
import {
  MultiSelectFromApiProps,
  MultiSelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useCallback, useEffect, useState, useRef } from "react";
import { useMultiSelectController } from "./useMultiSelectController";
import { useFormContext } from "react-hook-form";
import Axios from "../../utils/axiosConfig";

export const useMultiSelectFromApiController = (
  props: MultiSelectFromApiProps
): MultiSelectFromApiControllerReturn => {
  const {
    apiUrl,
    params = {},
    transformResponse = (data) => data,
    optionsApiOptions,
    name,
    ...multiSelectProps
  } = props;

  const [options, setOptions] = useState<SelectOption[]>(props.options || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedRef = useRef(false);

  // Form context to watch dependent controllers
  const formContext = useFormContext();

  // Watch for dependent controller value changes
  const dependentValue =
    optionsApiOptions?.dependingContrllerName && formContext
      ? formContext.watch(optionsApiOptions.dependingContrllerName)
      : undefined;

  // Create a base controller with empty options (will be filled after API call)
  const baseMultiSelect = useMultiSelectController({
    ...multiSelectProps,
    name,
    options,
  });

  const fetchOptions = useCallback(
    async (forceFetch: boolean = false) => {
      // Only fetch if we haven't already fetched or are forcing a refresh
      if (!forceFetch && hasFetchedRef.current) return;

      // Don't fetch if dependent field has no value, unless includeAll is true
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
        // Prepare parameters for API call
        let requestParams = { ...params };

        // Handle dependent controller
        if (optionsApiOptions?.dependingContrllerName && dependentValue) {
          // Extract parameter name without 'Id' suffix
          const paramName = optionsApiOptions.dependingContrllerName.replace(
            /Id$/,
            ""
          );

          // Convert to camelCase with first letter uppercase for the filter parameter
          const paramToCapitalize = paramName
            ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
            : "";

          // Add the filter parameter
          requestParams = {
            ...requestParams,
            [`filterBy${paramToCapitalize}Id`]: dependentValue,
            ...(optionsApiOptions.params || {}),
          };
        }

        // Use our custom Axios instance
        const response = await Axios.get(apiUrl, { params: requestParams });

        // Handle the response data
        let transformedOptions;
        if (typeof transformResponse === "function") {
          transformedOptions = transformResponse(response.data);
        } else if (Array.isArray(response.data)) {
          // Default handling if transform not provided
          transformedOptions = response.data;
        } else {
          transformedOptions = [];
        }

        setOptions(transformedOptions);
        hasFetchedRef.current = true;

        // If we have a formContext and selected values
        if (formContext && name) {
          const currentValues = formContext.getValues(name);

          if (Array.isArray(currentValues) && currentValues.length > 0) {
            // Filter out values that are no longer valid
            const validValues = currentValues.filter((value) =>
              transformedOptions.some((option: any) => option.value === value)
            );

            // If any values were removed, update the form
            if (validValues.length !== currentValues.length) {
              formContext.setValue(name, validValues, { shouldValidate: true });
            }
          }
        }
      } catch (err) {
        console.error("Error fetching options:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch options")
        );
        // Important: On error, keep any provided fallback options
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

  // Refresh function - this will force a new fetch
  const refresh = useCallback(() => {
    hasFetchedRef.current = false;
    return fetchOptions(true);
  }, [fetchOptions]);

  // Fetch options on initial render
  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when dependent value changes
  useEffect(() => {
    if (optionsApiOptions?.dependingContrllerName) {
      hasFetchedRef.current = false;
      fetchOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependentValue]);

  return {
    ...baseMultiSelect,
    options,
    loading,
    error,
    refresh,
  };
};
