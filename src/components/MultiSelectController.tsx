import React, { useEffect, useState } from "react";
import {
  ControllerRenderProps,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { FormControllerProps } from "../types";
import Axios from "../utils/axiosConfig";

type PropsType = {
  field: ControllerRenderProps<z.TypeOf<any>, any>;
  controller: FormControllerProps;
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
};

interface OptionType {
  label: string;
  value: string;
}

const MultiSelectController = ({ controller, field, form }: PropsType) => {
  const [optionsData, setOptionsData] = useState<OptionType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const dependantValue = useWatch({
    control: form.control,
    name: controller.optionsApiOptions?.dependingContrllerName || "",
    defaultValue: null,
  });

  // Parse stored comma-separated values into actual selected options
  useEffect(() => {
    if (field.value && typeof field.value === "string" && field.value !== "") {
      // Get stored values
      const values = field.value.split(",");

      // Handle special "all" value case
      if (values.includes("all") && controller.optionsApiOptions?.includeAll) {
        // If "all" is selected, just show that option
        setSelectedOptions([{ value: "all", label: "All" }]);
        return;
      }

      // Fetch option details if needed
      if (values.length > 0 && selectedOptions.length === 0) {
        fetchOptionsById(values);
      }
    }
  }, [field.value]);

  // When dependency value changes, reset options and fetch initial data
  useEffect(() => {
    if (controller.optionsApiOptions?.dependingContrllerName) {
      if (dependantValue) {
        // Clear selected options if dependency changes
        form.setValue(controller?.name || "name", "");
        setSelectedOptions([]);
        setOptionsData([]);
        setInitialFetchDone(false);

        // Fetch initial options
        fetchDefaultOptions();
      }
    } else {
      // No dependency required, fetch directly
      if (!initialFetchDone) {
        fetchDefaultOptions();
      }
    }
  }, [dependantValue]);

  // Initial fetch when component mounts
  useEffect(() => {
    if (!initialFetchDone) {
      // If there's a dependency field, check its value before fetching
      if (controller.optionsApiOptions?.dependingContrllerName) {
        if (dependantValue) {
          fetchDefaultOptions();
        }
      } else {
        // No dependency needed, fetch directly
        fetchDefaultOptions();
      }
    }
  }, []);

  // Fetch options when search query changes (with debounce)
  useEffect(() => {
    // For multi-selects with dependency, verify the dependency exists
    if (controller.optionsApiOptions?.dependingContrllerName) {
      if (dependantValue) {
        const debounceTimeout = setTimeout(() => {
          fetchOptions(searchQuery);
        }, 300);
        return () => clearTimeout(debounceTimeout);
      } else {
        setOptionsData([]);
      }
    } else {
      // For multi-selects without dependency, fetch directly
      const debounceTimeout = setTimeout(() => {
        fetchOptions(searchQuery);
      }, 300);
      return () => clearTimeout(debounceTimeout);
    }
  }, [searchQuery, dependantValue]);

  // Fetch default options without a search query
  async function fetchDefaultOptions() {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {
        ...controller?.optionsApiOptions?.options?.params,
      };

      // Add dependency parameter if needed
      if (
        controller.optionsApiOptions?.dependingContrllerName &&
        dependantValue
      ) {
        const paramName =
          controller.optionsApiOptions?.dependingContrllerName?.replace(
            "Id",
            ""
          );
        const paramToCapitalize = paramName
          ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
          : "";

        params[`filterBy${paramToCapitalize}Id`] = dependantValue;
      }

      const res = await Axios.get(controller?.optionsApiOptions?.api as any, {
        ...controller?.optionsApiOptions?.options,
        params,
      });

      // Add "All" option if specified
      let resultData = res?.data?.data || [];
      if (controller.optionsApiOptions?.includeAll) {
        resultData = [{ value: "all", label: "All" }, ...resultData];
      }

      // Filter out already selected options
      const filteredResults = resultData.filter(
        (option: OptionType) =>
          !selectedOptions.some((selected) => selected.value === option.value)
      );

      setOptionsData(filteredResults);
      setInitialFetchDone(true);
    } catch (error) {
      console.error("Error fetching default options:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch options based on search query
  async function fetchOptions(query: string) {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {
        q: query, // Add search query parameter
        ...controller?.optionsApiOptions?.options?.params,
      };

      // Add dependency parameter if needed
      if (
        controller.optionsApiOptions?.dependingContrllerName &&
        dependantValue
      ) {
        const paramName =
          controller.optionsApiOptions?.dependingContrllerName?.replace(
            "Id",
            ""
          );
        const paramToCapitalize = paramName
          ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
          : "";

        params[`filterBy${paramToCapitalize}Id`] = dependantValue;
      }

      const res = await Axios.get(controller?.optionsApiOptions?.api as any, {
        ...controller?.optionsApiOptions?.options,
        params,
      });

      // Add "All" option if specified and we're searching for something that might match "all"
      let resultData = res?.data?.data || [];
      if (
        controller.optionsApiOptions?.includeAll &&
        (!query || query.toLowerCase().includes("all"))
      ) {
        resultData = [{ value: "all", label: "All" }, ...resultData];
      }

      // Filter out already selected options
      const filteredResults = resultData.filter(
        (option: OptionType) =>
          !selectedOptions.some((selected) => selected.value === option.value)
      );

      setOptionsData(filteredResults);
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch specific options by IDs (for initial values)
  async function fetchOptionsById(values: string[]) {
    if (!values.length) return;

    // Handle the "all" option case
    if (values.includes("all") && controller.optionsApiOptions?.includeAll) {
      setSelectedOptions([{ value: "all", label: "All" }]);
      return;
    }

    try {
      const params: Record<string, any> = {
        ids: values.join(","), // Ask API for specific IDs
        ...controller?.optionsApiOptions?.options?.params,
      };

      // Add dependency parameter if needed
      if (
        controller.optionsApiOptions?.dependingContrllerName &&
        dependantValue
      ) {
        const paramName =
          controller.optionsApiOptions?.dependingContrllerName?.replace(
            "Id",
            ""
          );
        const paramToCapitalize = paramName
          ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
          : "";

        params[`filterBy${paramToCapitalize}Id`] = dependantValue;
      }

      const res = await Axios.get(controller?.optionsApiOptions?.api as any, {
        ...controller?.optionsApiOptions?.options,
        params,
      });

      if (res?.data?.data) {
        setSelectedOptions(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching options by IDs:", error);
    }
  }

  // Handle selecting an option
  const handleSelect = (option: OptionType) => {
    // Special handling for "All" option
    if (option.value === "all" && controller.optionsApiOptions?.includeAll) {
      setSelectedOptions([option]);

      // Update form value
      form.setValue(controller?.name || "name", "all");

      // Clear search and dropdown
      setSearchQuery("");
      setOptionsData([]);
      return;
    }

    // Check if the option is already selected to prevent duplicates
    if (selectedOptions.some((selected) => selected.value === option.value)) {
      return; // Option already selected, do nothing
    }

    // If "All" is currently selected, replace it
    const newSelectedOptions = selectedOptions.some(
      (opt) => opt.value === "all"
    )
      ? [option]
      : [...selectedOptions, option];

    setSelectedOptions(newSelectedOptions);

    // Update form value
    form.setValue(
      controller?.name || "name",
      newSelectedOptions.map((opt) => opt.value).join(",")
    );

    // Clear search
    setSearchQuery("");
    setOptionsData([]);
  };

  // Handle removing an option
  const handleRemove = (optionToRemove: OptionType) => {
    const newSelectedOptions = selectedOptions.filter(
      (option) => option.value !== optionToRemove.value
    );
    setSelectedOptions(newSelectedOptions);

    // Update form value
    form.setValue(
      controller?.name || "name",
      newSelectedOptions.map((opt) => opt.value).join(",")
    );
  };

  // Handle click on the input field
  const handleInputClick = () => {
    // For dependent multi-selects, check dependency value
    if (controller.optionsApiOptions?.dependingContrllerName) {
      if (dependantValue && optionsData.length === 0 && !isLoading) {
        fetchDefaultOptions();
      }
    } else {
      // For non-dependent multi-selects, fetch directly
      if (optionsData.length === 0 && !isLoading) {
        fetchDefaultOptions();
      }
    }
  };

  return (
    <div className="w-full relative">
      {/* Search input */}
      <div
        className="flex items-center w-full border rounded-md border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 px-3 py-2"
        onClick={handleInputClick}
      >
        <input
          type="text"
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          placeholder={controller.placeholder || "Search..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && optionsData.length > 0) {
              e.preventDefault();
              handleSelect(optionsData[0]);
            }
          }}
          onFocus={() => {
            // For dependent multi-selects, check dependency value
            if (controller.optionsApiOptions?.dependingContrllerName) {
              if (dependantValue && optionsData.length === 0 && !isLoading) {
                fetchDefaultOptions();
              }
            } else {
              // For non-dependent multi-selects, fetch directly
              if (optionsData.length === 0 && !isLoading) {
                fetchDefaultOptions();
              }
            }
          }}
        />
        {isLoading && (
          <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        )}
      </div>

      {/* Dropdown options */}
      {optionsData.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md border shadow-md max-h-56 overflow-auto">
          {optionsData.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Selected options */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
            >
              {option.label}
              <button
                type="button"
                className="ml-1 text-blue-500 hover:text-blue-700"
                onClick={() => handleRemove(option)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectController;
