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
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevDependentValueRef = useRef<any>(undefined);

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

  const baseApiSelect = useSelectFromApiController({
    apiUrl,
    params,
    transformResponse,
    optionsApiOptions,
    name,
    options: props.options || [],
    ...selectProps,
  });

  const searchOptions = useCallback(
    async (term: string) => {
      if (term.length < minSearchLength || term === previousSearchRef.current) {
        if (term.length < minSearchLength) {
          setFilteredOptions(baseApiSelect.options);
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

        let searchResults;
        if (typeof transformResponse === "function") {
          searchResults = transformResponse(response.data);
        } else if (Array.isArray(response.data)) {
          searchResults = response.data;
        } else {
          searchResults = [];
        }

        setFilteredOptions(searchResults);
        prevDependentValueRef.current = dependentValue;

        if (formContext && name) {
          try {
            const currentValue = formContext.getValues(name);
            const isValueValid = searchResults.some(
              (option: any) => option.value === currentValue
            );

            if (
              !isValueValid &&
              currentValue !== undefined &&
              currentValue !== null
            ) {
              formContext.setValue(name, null, { shouldValidate: true });
            }
          } catch (e) {
            console.warn("Error validating current value:", e);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error searching options:", err);
          setFilteredOptions(
            baseApiSelect.options.filter((option) =>
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
      baseApiSelect.options,
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
        setFilteredOptions(baseApiSelect.options);
        setLoadingResults(false);
        return;
      }

      setLoadingResults(true);

      searchTimeoutRef.current = setTimeout(() => {
        searchOptions(term);
      }, debounceMs);
    },
    [searchOptions, minSearchLength, debounceMs, baseApiSelect.options]
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
      setFilteredOptions(baseApiSelect.options);
    }
  }, [baseApiSelect.options, searchTerm, minSearchLength]);

  useEffect(() => {
    if (
      dependentValue !== prevDependentValueRef.current &&
      searchTerm.length >= minSearchLength
    ) {
      searchOptions(searchTerm);
    }
  }, [dependentValue, searchTerm, minSearchLength, searchOptions]);

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

  useEffect(() => {
    if (!baseApiSelect.isOpen) {
      setSearchTerm("");
      setFilteredOptions(baseApiSelect.options);
    }
  }, [baseApiSelect.isOpen, baseApiSelect.options]);

  return {
    ...baseApiSelect,
    searchTerm,
    setSearchTerm: handleSearchChange,
    filteredOptions,
    loadingResults,
    inputProps,
  };
};
