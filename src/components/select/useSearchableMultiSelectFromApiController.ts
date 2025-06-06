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

  // Move hook calls to the top level
  let formContext = null;
  try {
    formContext = name ? useFormContext() : null;
  } catch (e) {
    // Form context not available
  }

  // Calculate dependent value at the top level
  let dependentValue = undefined;
  if (formContext && optionsApiOptions?.dependingContrllerName) {
    try {
      dependentValue = formContext.watch(
        optionsApiOptions.dependingContrllerName
      );
    } catch (e) {
      dependentValue = undefined;
    }
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(
    props.options || []
  );
  const [loadingResults, setLoadingResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSearchRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevDependentValueRef = useRef<any>(undefined);
  const isMountedRef = useRef(true);

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
      if (!isMountedRef.current) return;

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

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        let requestParams: Record<string, any> = {
          [searchParam]: term,
        };

        if (optionsApiOptions?.params) {
          const { paramName, ...otherParams } = optionsApiOptions.params;
          Object.assign(requestParams, otherParams);

          if (
            paramName &&
            optionsApiOptions?.dependingContrllerName &&
            dependentValue
          ) {
            requestParams[paramName] = dependentValue;
          } else if (paramName) {
            requestParams[paramName] = dependentValue || "";
          }
        }

        if (
          !optionsApiOptions?.params?.paramName &&
          optionsApiOptions?.dependingContrllerName &&
          dependentValue
        ) {
          const paramName = optionsApiOptions.dependingContrllerName.replace(
            /Id$/,
            ""
          );
          const paramToCapitalize = paramName
            ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
            : "";
          requestParams[`filterBy${paramToCapitalize}Id`] = dependentValue;
        }

        Object.assign(requestParams, params);

        const response = await Axios.get(apiUrl, {
          params: requestParams,
          signal: abortControllerRef.current.signal,
        });

        if (!isMountedRef.current) return;

        let searchResults;
        if (typeof transformResponse === "function") {
          searchResults = transformResponse(response.data.data);
        } else if (Array.isArray(response.data.data)) {
          searchResults = response.data.data;
        } else {
          searchResults = [];
        }

        setFilteredOptions(searchResults);
        prevDependentValueRef.current = dependentValue;

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
            // Handle error silently
          }
        }
      } catch (err: any) {
        if (!isMountedRef.current) return;

        if (err.name !== "AbortError") {
          setFilteredOptions(
            baseApiMultiSelect.options.filter((option) =>
              option.label.toLowerCase().includes(term.toLowerCase())
            )
          );
        }
      } finally {
        if (
          isMountedRef.current &&
          abortControllerRef.current?.signal.aborted === false
        ) {
          setLoadingResults(false);
        }
      }
    },
    [
      apiUrl,
      params,
      searchParam,
      baseApiMultiSelect.options,
      minSearchLength,
      dependentValue,
      name,
      formContext,
      optionsApiOptions,
      transformResponse,
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
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
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

  useEffect(() => {
    if (
      dependentValue !== prevDependentValueRef.current &&
      searchTerm.length >= minSearchLength
    ) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        searchOptions(searchTerm);
      }, 100);
    }
  }, [dependentValue, searchTerm, minSearchLength, searchOptions]);

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
