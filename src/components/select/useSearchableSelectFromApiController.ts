// src/components/select/useSearchableSelectFromApiController.ts
import { useState, useEffect, useCallback, useRef } from "react";
import {
  SearchableSelectFromApiProps,
  SearchableSelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useSelectFromApiController } from "./useSelectFromApiController";
import { useFormContext } from "react-hook-form";
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
    optionsApiOptions,
    name,
    ...selectProps
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
  const baseApiSelect = useSelectFromApiController({
    apiUrl,
    params,
    transformResponse,
    optionsApiOptions,
    name,
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

        // If we have a formContext and a selected value
        if (formContext && name) {
          const currentValue = formContext.getValues(name);

          // Check if the current value is still valid in the new options
          const isValueValid = searchResults.some(
            (option: any) => option.value === currentValue
          );

          // If not valid and we have a value, reset it
          if (
            !isValueValid &&
            currentValue !== undefined &&
            currentValue !== null
          ) {
            formContext.setValue(name, null, { shouldValidate: true });
          }
        }
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

  // Re-set filtered options when base options change (e.g., due to dependency changes)
  useEffect(() => {
    if (searchTerm.length < minSearchLength) {
      setFilteredOptions(baseApiSelect.options);
    }
  }, [baseApiSelect.options, searchTerm, minSearchLength]);

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
