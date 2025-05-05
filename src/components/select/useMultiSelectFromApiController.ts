// src/components/select/useMultiSelectFromApiController.ts
import {
  MultiSelectFromApiProps,
  MultiSelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useCallback, useEffect, useState, useRef } from "react";
import { useMultiSelectController } from "./useMultiSelectController";
import Axios from "../../utils/axiosConfig";

export const useMultiSelectFromApiController = (
  props: MultiSelectFromApiProps
): MultiSelectFromApiControllerReturn => {
  const {
    apiUrl,
    params = {},
    transformResponse = (data) => data,
    ...multiSelectProps
  } = props;

  const [options, setOptions] = useState<SelectOption[]>(props.options || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedRef = useRef(false); // Track if we've already fetched

  // Create a base controller with empty options (will be filled after API call)
  const baseMultiSelect = useMultiSelectController({
    ...multiSelectProps,
    options,
  });

  const fetchOptions = useCallback(async () => {
    // Only fetch if we haven't already fetched or if explicitly refreshing
    if (hasFetchedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      // Use our custom Axios instance
      const response = await Axios.get(apiUrl, { params });

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
      hasFetchedRef.current = true; // Mark as fetched
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
  }, [apiUrl, params, transformResponse, props.options]);

  // Refresh function - this will force a new fetch
  const refresh: any = useCallback(() => {
    hasFetchedRef.current = false;
    fetchOptions();
  }, [fetchOptions]);

  // Fetch options only once on initial render
  useEffect(() => {
    fetchOptions();
    // We don't include fetchOptions in the dependency array to avoid refetching
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...baseMultiSelect,
    options,
    loading,
    error,
    refresh,
  };
};
