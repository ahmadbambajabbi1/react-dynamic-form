import axios from "axios";
import {
  MultiSelectFromApiProps,
  MultiSelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useCallback, useEffect, useState } from "react";
import { useMultiSelectController } from "./useMultiSelectController";

export const useMultiSelectFromApiController = (
  props: MultiSelectFromApiProps
): MultiSelectFromApiControllerReturn => {
  const {
    apiUrl,
    params = {},
    transformResponse = (data) => data,
    ...multiSelectProps
  } = props;

  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a base controller with empty options (will be filled after API call)
  const baseMultiSelect = useMultiSelectController({
    ...multiSelectProps,
    options,
  });

  const fetchOptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(apiUrl, { params });
      const transformedOptions = transformResponse(response.data);
      setOptions(transformedOptions);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch options")
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl, params, transformResponse]);

  // Fetch options on initial render
  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return {
    ...baseMultiSelect,
    options,
    loading,
    error,
    refresh: fetchOptions,
  };
};
