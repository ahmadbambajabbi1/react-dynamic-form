// src/components/select/useSearchableMultiSelectFromApiController.ts
import { useState, useEffect, useCallback, useRef } from "react";
import {
  SearchableMultiSelectFromApiProps,
  SearchableMultiSelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useMultiSelectFromApiController } from "./useMultiSelectFromApiController";
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
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(
    props.options || []
  );
  const [loadingResults, setLoadingResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSearchRef = useRef<string>("");

  // Use the base API controller
  const baseApiMultiSelect = useMultiSelectFromApiController({
    apiUrl,
    params,
    transformResponse,
    options: props.options || [],
    ...multiSelectProps,
  });

  // Search function with API call
  const searchOptions = useCallback(
    async (term: string) => {
      // Don't search if term is too short or identical to previous search
      if (term.length < minSearchLength || term === previousSearchRef.current) {
        if (term.length < minSearchLength) {
          setFilteredOptions(baseApiMultiSelect.options);
        }
        return;
      }

      // Store current search term to prevent duplicate searches
      previousSearchRef.current = term;
      setLoadingResults(true);

      try {
        // Use our custom Axios instance
        const response = await Axios.get(apiUrl, {
          params: {
            ...params,
            [searchParam]: term,
          },
        });

        // Process the response data
        let searchResults;
        if (typeof transformResponse === "function") {
          searchResults = transformResponse(response.data);
        } else if (Array.isArray(response.data)) {
          searchResults = response.data;
        } else {
          searchResults = [];
        }

        setFilteredOptions(searchResults);
      } catch (err) {
        console.error("Error searching options:", err);
        // Fall back to client-side filtering if API search fails
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

  // Properly debounced search effect
  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Don't create a new timeout for empty or too-short searches
      if (term.length < minSearchLength) {
        setFilteredOptions(baseApiMultiSelect.options);
        setLoadingResults(false);
        return;
      }

      // Set loading state immediately for better UX
      setLoadingResults(true);

      // Create new debounced search
      searchTimeoutRef.current = setTimeout(() => {
        searchOptions(term);
      }, debounceMs);
    },
    [searchOptions, minSearchLength, debounceMs, baseApiMultiSelect.options]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Override input props for search functionality
  const inputProps = {
    ...baseApiMultiSelect.inputProps,
    value: baseApiMultiSelect.isOpen
      ? searchTerm
      : baseApiMultiSelect.inputProps.value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(e.target.value);
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
      setFilteredOptions(baseApiMultiSelect.options);
    }
  }, [baseApiMultiSelect.isOpen, baseApiMultiSelect.options]);

  return {
    ...baseApiMultiSelect,
    searchTerm,
    setSearchTerm: handleSearchChange, // Use the debounced handler
    filteredOptions,
    loadingResults,
    inputProps,
  };
};
