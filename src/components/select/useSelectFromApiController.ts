import {
  SelectFromApiControllerProps,
  SelectFromApiControllerReturn,
  SelectOption,
} from "./types";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useSelectController } from "./useSelectController";
import { useFormContext } from "react-hook-form";
import Axios from "../../utils/axiosConfig";

export const useSelectFromApiController = (
  props: SelectFromApiControllerProps
): SelectFromApiControllerReturn => {
  const {
    apiUrl,
    params = {},
    transformResponse = (data) => data,
    defaultValue,
    optionsApiOptions,
    name,
    ...selectProps
  } = props;

  const [options, setOptions] = useState<SelectOption[]>(props.options || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasFetchedRef = useRef(false);
  const prevDependentValueRef = useRef<any>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const fetchInProgressRef = useRef(false);

  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const apiUrlRef = useRef(apiUrl);
  useEffect(() => {
    apiUrlRef.current = apiUrl || (optionsApiOptions?.api as string);
  }, [apiUrl]);

  let formContext = null;
  try {
    formContext = useFormContext();
  } catch (e) {
    // Silently handle error
  }

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

  const memoizedDependentValue = useMemo(
    () => dependentValue,
    [dependentValue]
  );
  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);

  const baseSelect = useSelectController({
    ...selectProps,
    name,
    defaultValue,
    options,
  });

  const fetchOptions = useCallback(
    async (forceFetch: boolean = false) => {
      if (!isMountedRef.current || (!forceFetch && fetchInProgressRef.current))
        return;

      const shouldSkipFetch =
        !forceFetch &&
        hasFetchedRef.current &&
        memoizedDependentValue === prevDependentValueRef.current;

      if (shouldSkipFetch) return;

      if (
        optionsApiOptions?.dependingContrllerName &&
        !memoizedDependentValue &&
        !optionsApiOptions.includeAll
      ) {
        setOptions([]);
        prevDependentValueRef.current = memoizedDependentValue;
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      fetchInProgressRef.current = true;

      try {
        let requestParams: Record<string, any> = {};

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

        let transformedOptions;
        if (typeof transformResponse === "function") {
          transformedOptions = transformResponse(response.data.data);
        } else if (Array.isArray(response.data.data)) {
          transformedOptions = response.data.data;
        } else {
          transformedOptions = [];
        }

        if (isMountedRef.current) {
          setOptions(transformedOptions);
          hasFetchedRef.current = true;
          prevDependentValueRef.current = memoizedDependentValue;
        }

        if (formContext && name) {
          try {
            const currentValue = formContext.getValues(name);
            const isValueValid = transformedOptions.some(
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
          setError(
            err instanceof Error ? err : new Error("Failed to fetch options")
          );

          if (props.options && props.options.length > 0) {
            setOptions(props.options);
          }
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
        fetchInProgressRef.current = false;
      }
    },
    [
      memoizedDependentValue,
      name,
      optionsApiOptions,
      transformResponse,
      props.options,
    ]
  );

  const refresh = useCallback(() => {
    hasFetchedRef.current = false;
    prevDependentValueRef.current = undefined;
    return fetchOptions(true);
  }, [fetchOptions]);

  useEffect(() => {
    isMountedRef.current = true;

    const timeoutId = setTimeout(() => {
      fetchOptions();
    }, 50);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (
      optionsApiOptions?.dependingContrllerName &&
      memoizedDependentValue !== prevDependentValueRef.current &&
      !fetchInProgressRef.current
    ) {
      const timeoutId = setTimeout(() => {
        fetchOptions(true);
      }, 50);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [
    memoizedDependentValue,
    optionsApiOptions?.dependingContrllerName,
    fetchOptions,
  ]);

  return {
    ...baseSelect,
    options,
    loading,
    error,
    refresh,
  };
};
