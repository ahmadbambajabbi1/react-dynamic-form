// src/components/select/useSearchableSelectFromApiController.ts
import { useState, useEffect, useCallback, useRef } from "react";
import {
  SearchableSelectFromApiProps,
  SearchableSelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useSelectFromApiController } from "./useSelectFromApiController";
import Axios from "../../utils/axiosConfig";

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
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(
    props.options || []
  );
  const [loadingResults, setLoadingResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSearchRef = useRef<string>("");

  // Use the base API controller but disable its auto-fetching
  const baseApiSelect = useSelectFromApiController({
    apiUrl,
    params,
    transformResponse,
    options: props.options || [],
    ...selectProps,
  });

  // Search function with API call
  const searchOptions = useCallback(
    async (term: string) => {
      // Don't search if term is too short or identical to previous search
      if (term.length < minSearchLength || term === previousSearchRef.current) {
        if (term.length < minSearchLength) {
          setFilteredOptions(baseApiSelect.options);
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
        setFilteredOptions(baseApiSelect.options);
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
    [searchOptions, minSearchLength, debounceMs, baseApiSelect.options]
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
    ...baseApiSelect.inputProps,
    value: baseApiSelect.isOpen
      ? searchTerm
      : baseApiSelect.selectedOption?.label || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(e.target.value);
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
      setFilteredOptions(baseApiSelect.options);
    }
  }, [baseApiSelect.isOpen, baseApiSelect.options]);

  return {
    ...baseApiSelect,
    searchTerm,
    setSearchTerm: handleSearchChange, // Use the debounced handler
    filteredOptions,
    loadingResults,
    inputProps,
  };
};
