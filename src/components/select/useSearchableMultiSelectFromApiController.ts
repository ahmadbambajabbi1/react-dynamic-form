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
  const abortControllerRef = useRef<AbortController | null>(null);

  let formContext;
  try {
    formContext = useFormContext();
  } catch (e) {
    formContext = null;
  }

  let dependentValue = undefined;
  if (formContext && optionsApiOptions?.dependingContrllerName) {
    try {
      dependentValue = formContext.watch(
        optionsApiOptions.dependingContrllerName
      );
    } catch (e) {
      console.warn("Could not watch dependent field:", e);
    }
  }

  const baseApiMultiSelect = useMultiSelectFromApiController({
    apiUrl,
    params,
    transformResponse,
    optionsApiOptions,
    name,
    options: props.options || [],
    ...multiSelectProps,
  });

  const searchOptions = useCallback(
    async (term: string) => {
      if (term.length < minSearchLength || term === previousSearchRef.current) {
        if (term.length < minSearchLength) {
          setFilteredOptions(baseApiMultiSelect.options);
          setLoadingResults(false);
        }
        return;
      }

      if (
        optionsApiOptions?.dependingContrllerName &&
        !dependentValue &&
        !optionsApiOptions.includeAll
      ) {
        setFilteredOptions([]);
        return;
      }

      previousSearchRef.current = term;
      setLoadingResults(true);

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        let requestParams = {
          ...params,
          [searchParam]: term,
        };

        if (optionsApiOptions?.dependingContrllerName && dependentValue) {
          const paramName = optionsApiOptions.dependingContrllerName.replace(
            /Id$/,
            ""
          );
          const paramToCapitalize = paramName
            ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
            : "";
          requestParams = {
            ...requestParams,
            [`filterBy${paramToCapitalize}Id`]: dependentValue,
            ...(optionsApiOptions.params || {}),
          };
        }

        const response = await Axios.get(apiUrl, {
          params: requestParams,
          signal: abortControllerRef.current.signal,
        });

        let searchResults;
        if (typeof transformResponse === "function") {
          searchResults = transformResponse(response.data);
        } else if (Array.isArray(response.data)) {
          searchResults = response.data;
        } else {
          searchResults = [];
        }

        setFilteredOptions(searchResults);

        if (formContext && name) {
          try {
            const currentValues = formContext.getValues(name);

            if (Array.isArray(currentValues) && currentValues.length > 0) {
              const validValues = currentValues.filter((value) =>
                searchResults.some((option: any) => option.value === value)
              );

              if (validValues.length !== currentValues.length) {
                formContext.setValue(name, validValues, {
                  shouldValidate: true,
                });
              }
            }
          } catch (e) {
            console.warn("Error validating current values:", e);
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error searching options:", err);
          setFilteredOptions(
            baseApiMultiSelect.options.filter((option) =>
              option.label.toLowerCase().includes(term.toLowerCase())
            )
          );
        }
      } finally {
        if (abortControllerRef.current?.signal.aborted === false) {
          setLoadingResults(false);
        }
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

  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      if (term.length < minSearchLength) {
        setFilteredOptions(baseApiMultiSelect.options);
        setLoadingResults(false);
        return;
      }

      setLoadingResults(true);

      searchTimeoutRef.current = setTimeout(() => {
        searchOptions(term);
      }, debounceMs);
    },
    [searchOptions, minSearchLength, debounceMs, baseApiMultiSelect.options]
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length < minSearchLength) {
      setFilteredOptions(baseApiMultiSelect.options);
    }
  }, [baseApiMultiSelect.options, searchTerm, minSearchLength]);

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

  useEffect(() => {
    if (!baseApiMultiSelect.isOpen) {
      setSearchTerm("");
      setFilteredOptions(baseApiMultiSelect.options);
    }
  }, [baseApiMultiSelect.isOpen, baseApiMultiSelect.options]);

  return {
    ...baseApiMultiSelect,
    searchTerm,
    setSearchTerm: handleSearchChange,
    filteredOptions,
    loadingResults,
    inputProps,
  };
};
