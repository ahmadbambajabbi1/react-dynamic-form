import axios from "axios";
import {
  SelectFromApiControllerProps,
  SelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useCallback, useEffect, useState } from "react";
import { useSelectController } from "./useSelectController";

export const useSelectFromApiController = (
  props: SelectFromApiControllerProps
): SelectFromApiControllerReturn => {
  const {
    apiUrl,
    params = {},
    transformResponse = (data) => data,
    ...selectProps
  } = props;

  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a base controller with empty options (will be filled after API call)
  const baseSelect = useSelectController({
    ...selectProps,
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
    ...baseSelect,
    options,
    loading,
    error,
    refresh: fetchOptions,
  };
};
