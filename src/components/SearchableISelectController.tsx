import React, { useState, useRef, useEffect } from "react";
import {
  ControllerRenderProps,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { FormControllerProps } from "../types";
import { z } from "zod";
import { cn } from "../utils";
import Axios from "../utils/axiosConfig";

type SearchableSelectControllerProps = {
  field: ControllerRenderProps<z.TypeOf<any>, any>;
  controller: FormControllerProps;
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
};

const SearchableSelectController: React.FC<SearchableSelectControllerProps> = ({
  controller,
  field,
  form,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    controller.options !== "from-api" ? controller.options || [] : []
  );
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Watch for dependent field changes (if needed)
  const dependentValues = useWatch({
    control: form.control,
    name: controller.willNeedControllersNames || [],
  });

  // Convert dependent values to an object
  const dependantParams = controller?.willNeedControllersNames?.reduce(
    (acc, name, index) => {
      acc[name] = dependentValues?.[index] ?? null;
      return acc;
    },
    {} as Record<string, any>
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find selected option from value
  useEffect(() => {
    if (field.value) {
      const option = options.find((opt) => opt.value === field.value);
      setSelectedOption(option || { label: field.value, value: field.value });
    } else {
      setSelectedOption(null);
    }
  }, [field.value, options]);

  // Fetch options from API (if applicable)
  useEffect(() => {
    if (
      controller.options === "from-api" &&
      controller.optionsApiOptions?.api
    ) {
      fetchOptions();
    }
  }, [dependentValues, controller.optionsApiOptions]);

  // Fetch options
  const fetchOptions = async (search = "") => {
    if (
      controller.options === "from-api" &&
      controller.optionsApiOptions?.api
    ) {
      setIsLoading(true);
      try {
        const params = {
          ...(controller.optionsApiOptions?.options?.params || {}),
          ...(dependantParams || {}),
          q: search,
        };

        const res = await Axios.get(controller.optionsApiOptions.api, {
          ...controller.optionsApiOptions.options,
          params,
        });

        const resultData = res?.data?.data || [];
        setOptions(resultData);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle selecting an option
  const handleSelect = (option: { label: string; value: string }) => {
    setSelectedOption(option);
    field.onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (controller.options === "from-api") {
      // Debounce API calls
      const timeout = setTimeout(() => {
        fetchOptions(value);
      }, 300);

      return () => clearTimeout(timeout);
    }
  };

  // Filter local options based on search term
  const filteredOptions =
    controller.options !== "from-api"
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Selection display/search input */}
      <div
        className={cn(
          "flex items-center w-full border rounded-md px-3 py-2 cursor-text",
          isOpen ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-300",
          controller.className
        )}
        onClick={() => setIsOpen(true)}
      >
        {isOpen || !selectedOption ? (
          <input
            type="text"
            className="w-full outline-none bg-transparent"
            placeholder={controller.placeholder || "Search..."}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsOpen(true)}
          />
        ) : (
          <div className="flex items-center justify-between w-full">
            <span>{selectedOption.label}</span>
            <button
              type="button"
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOption(null);
                field.onChange("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 hover:text-gray-600"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {isLoading && (
          <div className="ml-2">
            <svg
              className="animate-spin h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "px-3 py-2 cursor-pointer hover:bg-gray-100",
                  selectedOption?.value === option.value && "bg-blue-50"
                )}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">
              {controller.emptyIndicator || "No options found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelectController;
