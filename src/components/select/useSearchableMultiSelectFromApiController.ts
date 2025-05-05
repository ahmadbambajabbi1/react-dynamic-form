// src/components/select/useSearchableMultiSelectFromApiController.ts
import { useState, useEffect, useCallback, useRef } from "react";
import {
  SearchableMultiSelectFromApiProps,
  SearchableMultiSelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useMultiSelectFromApiController } from "./useMultiSelectFromApiController";
import { useFormContext } from "react-hook-form";
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
    optionsApiOptions,
    name,
    ...multiSelectProps
  } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(
    props.options || []
  );
  const [loadingResults, setLoadingResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSearchRef = useRef<string>("");

  // Form context to watch dependent controllers
  const formContext = useFormContext();

  // Watch for dependent controller value changes
  const dependentValue =
    optionsApiOptions?.dependingContrllerName && formContext
      ? formContext.watch(optionsApiOptions.dependingContrllerName)
      : undefined;

  // Use the base API controller
  const baseApiMultiSelect = useMultiSelectFromApiController({
    apiUrl,
    params,
    transformResponse,
    optionsApiOptions,
    name,
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

      // Don't search if dependent field has no value, unless includeAll is true
      if (
        optionsApiOptions?.dependingContrllerName &&
        !dependentValue &&
        !optionsApiOptions.includeAll
      ) {
        setFilteredOptions([]);
        return;
      }

      // Store current search term to prevent duplicate searches
      previousSearchRef.current = term;
      setLoadingResults(true);

      try {
        // Prepare parameters for API call
        let requestParams = {
          ...params,
          [searchParam]: term,
        };

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

        // If we have a formContext and selected values
        if (formContext && name) {
          const currentValues = formContext.getValues(name);

          if (Array.isArray(currentValues) && currentValues.length > 0) {
            // Filter out values that are no longer valid
            const validValues = currentValues.filter((value) =>
              searchResults.some((option: any) => option.value === value)
            );

            // If any values were removed, update the form
            if (validValues.length !== currentValues.length) {
              formContext.setValue(name, validValues, { shouldValidate: true });
            }
          }
        }
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
      optionsApiOptions,
      dependentValue,
      formContext,
      name,
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

  // Re-set filtered options when base options change (e.g., due to dependency changes)
  useEffect(() => {
    if (searchTerm.length < minSearchLength) {
      setFilteredOptions(baseApiMultiSelect.options);
    }
  }, [baseApiMultiSelect.options, searchTerm, minSearchLength]);

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
