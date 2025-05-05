import { useState, useEffect, useCallback } from "react";
import {
  SearchableSelectFromApiProps,
  SearchableSelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useSelectFromApiController } from "./useSelectFromApiController";
import axios from "axios";

export const useSearchableSelectFromApiController = (
  props: SearchableSelectFromApiProps
): SearchableSelectFromApiControllerReturn => {
  const {
    apiUrl,
    params = {},
    transformResponse = (data) => data,
    searchParam = "q",
    debounceMs = 300,
    minSearchLength = 2,
    ...selectProps
  } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // Use the base API controller
  const baseApiSelect = useSelectFromApiController({
    apiUrl,
    params,
    transformResponse,
    ...selectProps,
  });

  // Search function with API call
  const searchOptions = useCallback(
    async (term: string) => {
      if (term.length < minSearchLength) {
        setFilteredOptions(baseApiSelect.options);
        return;
      }

      setLoadingResults(true);

      try {
        const response = await axios.get(apiUrl, {
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
          baseApiSelect.options.filter((option) =>
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
      baseApiSelect.options,
      minSearchLength,
    ]
  );

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.length < minSearchLength) {
      setFilteredOptions(baseApiSelect.options);
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
    baseApiSelect.options,
  ]);

  // Override input props for search functionality
  const inputProps = {
    ...baseApiSelect.inputProps,
    value: baseApiSelect.isOpen
      ? searchTerm
      : baseApiSelect.selectedOption?.label || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      if (!baseApiSelect.isOpen) {
        baseApiSelect.openMenu();
      }
    },
    placeholder: baseApiSelect.isOpen
      ? props.searchPlaceholder || "Search..."
      : props.placeholder || "Select option",
  };

  // Clear search when closing menu
  useEffect(() => {
    if (!baseApiSelect.isOpen) {
      setSearchTerm("");
    }
  }, [baseApiSelect.isOpen]);

  return {
    ...baseApiSelect,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    loadingResults,
    inputProps,
  };
};
