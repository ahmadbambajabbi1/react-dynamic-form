import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
    props?.options || []
  );
  const [loadingResults, setLoadingResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousSearchRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevDependentValueRef = useRef<any>(undefined);
  const isMountedRef = useRef(true);
  const fetchInProgressRef = useRef(false);
  const hasFetchErrorRef = useRef(false);

  let formContext = null;
  try {
    formContext = useFormContext();
  } catch (e) {}

  const dependentValue = useMemo(() => {
    if (!formContext || !optionsApiOptions?.dependingContrllerName) {
      return undefined;
    }
    try {
      return formContext.watch(optionsApiOptions.dependingContrllerName);
    } catch (e) {
      return undefined;
    }
  }, [formContext, optionsApiOptions?.dependingContrllerName]);

  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);
  const memoizedDependentValue = useMemo(
    () => dependentValue,
    [dependentValue]
  );

  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const apiUrlRef = useRef(apiUrl);
  useEffect(() => {
    apiUrlRef.current = apiUrl || (optionsApiOptions?.api as string);
  }, [apiUrl]);

  const baseApiSelect = useSelectFromApiController({
    apiUrl,
    params: memoizedParams,
    transformResponse,
    optionsApiOptions,
    name,
    options: props.options || [],
    ...selectProps,
  });

  const searchOptions = useCallback(
    async (term: string) => {
      if (!isMountedRef.current || fetchInProgressRef.current) return;

      if (term.length < minSearchLength || term === previousSearchRef.current) {
        if (term.length < minSearchLength) {
          setFilteredOptions(baseApiSelect.options);
          setLoadingResults(false);
        }
        return;
      }

      if (
        optionsApiOptions?.dependingContrllerName &&
        !memoizedDependentValue &&
        !optionsApiOptions.includeAll
      ) {
        setFilteredOptions([]);
        return;
      }

      previousSearchRef.current = term;
      setLoadingResults(true);
      fetchInProgressRef.current = true;

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
            memoizedDependentValue
          ) {
            requestParams[paramName] = memoizedDependentValue;
          } else if (paramName) {
            requestParams[paramName] = memoizedDependentValue || "";
          }
        }

        if (
          !optionsApiOptions?.params?.paramName &&
          optionsApiOptions?.dependingContrllerName &&
          memoizedDependentValue
        ) {
          const paramName = optionsApiOptions.dependingContrllerName.replace(
            /Id$/,
            ""
          );
          const paramToCapitalize = paramName
            ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
            : "";
          requestParams[`filterBy${paramToCapitalize}Id`] =
            memoizedDependentValue;
        }

        Object.assign(requestParams, paramsRef.current);

        const response = await Axios.get(apiUrlRef.current, {
          params: requestParams,
          signal: abortControllerRef.current.signal,
        });

        if (!isMountedRef.current) return;

        let searchResults;
        if (typeof transformResponse === "function") {
          searchResults = transformResponse(response.data?.data || []);
        } else if (Array.isArray(response.data?.data)) {
          searchResults = response.data.data;
        } else {
          searchResults = [];
        }

        if (isMountedRef.current) {
          setFilteredOptions(searchResults);
          prevDependentValueRef.current = memoizedDependentValue;
          hasFetchErrorRef.current = false;
        }

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
            // Silently handle error
          }
        }
      } catch (err: any) {
        if (!isMountedRef.current) return;

        if (err.name !== "AbortError") {
          hasFetchErrorRef.current = true;

          // Use local filtering instead of forcing refresh
          if (baseApiSelect.options.length > 0) {
            setFilteredOptions(
              baseApiSelect.options.filter((option) =>
                option.label.toLowerCase().includes(term.toLowerCase())
              )
            );
          }
        }
      } finally {
        if (isMountedRef.current) {
          setLoadingResults(false);
        }
        fetchInProgressRef.current = false;
      }
    },
    [
      minSearchLength,
      searchParam,
      baseApiSelect.options,
      memoizedDependentValue,
      optionsApiOptions,
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
    [minSearchLength, debounceMs, baseApiSelect.options]
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
      setFilteredOptions(baseApiSelect.options);
    }
  }, [baseApiSelect.options, searchTerm, minSearchLength]);

  useEffect(() => {
    if (
      memoizedDependentValue !== prevDependentValueRef.current &&
      searchTerm.length >= minSearchLength &&
      !fetchInProgressRef.current
    ) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      prevDependentValueRef.current = memoizedDependentValue;

      searchTimeoutRef.current = setTimeout(() => {
        searchOptions(searchTerm);
      }, 100);
    }
  }, [memoizedDependentValue, searchTerm, minSearchLength]);

  const inputProps = useMemo(
    () => ({
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
    }),
    [
      baseApiSelect.inputProps,
      baseApiSelect.selectedOption,
      searchTerm,
      props.searchPlaceholder,
      props.placeholder,
    ]
  );

  useEffect(() => {
    if (!baseApiSelect.isOpen) {
      setSearchTerm("");
      setFilteredOptions(baseApiSelect.options);
    }
  }, [baseApiSelect.options]);

  return {
    ...baseApiSelect,
    searchTerm,
    setSearchTerm: handleSearchChange,
    filteredOptions,
    loadingResults,
    inputProps,
  };
};
