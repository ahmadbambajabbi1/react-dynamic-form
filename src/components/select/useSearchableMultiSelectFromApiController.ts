// src/components/select/useSearchableMultiSelectFromApiController.ts
import { useState, useEffect, useCallback } from "react";
import {
  SearchableMultiSelectFromApiProps,
  SearchableMultiSelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useMultiSelectFromApiController } from "./useMultiSelectFromApiController";
// Import our custom Axios instead of axios
import Axios from "../../utils/axiosConfig";

export const useSearchableMultiSelectFromApiController = (
  props: SearchableMultiSelectFromApiProps
): SearchableMultiSelectFromApiControllerReturn => {
  const {
    apiUrl,
    params = {},
    transformResponse = (data) => data,
    searchParam = "q",
    debounceMs = 300,
    minSearchLength = 2,
    ...multiSelectProps
  } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // Use the base API controller
  const baseApiMultiSelect = useMultiSelectFromApiController({
    apiUrl,
    params,
    transformResponse,
    ...multiSelectProps,
  });

  // Search function with API call
  const searchOptions = useCallback(
    async (term: string) => {
      if (term.length < minSearchLength) {
        setFilteredOptions(baseApiMultiSelect.options);
        return;
      }

      setLoadingResults(true);

      try {
        // Use our custom Axios instance
        const response = await Axios.get(apiUrl, {
          params: {
            ...params,
            [searchParam]: term,
          },
        });

        const searchResults = transformResponse(response.data);
        setFilteredOptions(searchResults);
      } catch (err) {
        console.error("Error searching options:", err);
        // Fallback to client-side filtering on error
        setFilteredOptions(
          baseApiMultiSelect.options.filter((option) =>
            option.label.toLowerCase().includes(term.toLowerCase())
          )
        );
      } finally {
        setLoadingResults(false);
      }
    },
    [
      apiUrl,
      params,
      searchParam,
      transformResponse,
      baseApiMultiSelect.options,
      minSearchLength,
    ]
  );

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.length < minSearchLength) {
      setFilteredOptions(baseApiMultiSelect.options);
      return;
    }

    const handler = setTimeout(() => {
      searchOptions(searchTerm);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [
    searchTerm,
    searchOptions,
    debounceMs,
    minSearchLength,
    baseApiMultiSelect.options,
  ]);

  // Override input props for search functionality
  const inputProps = {
    ...baseApiMultiSelect.inputProps,
    value: baseApiMultiSelect.isOpen
      ? searchTerm
      : baseApiMultiSelect.inputProps.value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      if (!baseApiMultiSelect.isOpen) {
        baseApiMultiSelect.openMenu();
      }
    },
    placeholder: baseApiMultiSelect.isOpen
      ? props.searchPlaceholder || "Search..."
      : props.placeholder || "Select options",
  };

  // Clear search when closing menu
  useEffect(() => {
    if (!baseApiMultiSelect.isOpen) {
      setSearchTerm("");
    }
  }, [baseApiMultiSelect.isOpen]);

  return {
    ...baseApiMultiSelect,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    loadingResults,
    inputProps,
  };
};
