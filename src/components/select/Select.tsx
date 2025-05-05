import React, { useRef, useEffect, useState } from "react";
import { useSelectController } from "./useSelectController";
import { SelectProps } from "./types";
import { determineDropdownPosition } from "../../utils/dropdown";

// Import icons
import { XIcon } from "../../icons/XIcon";
import { ChevronDown } from "../../icons/ChevronDown";
import { CheckIcon } from "../../icons/CheckIcon";

export const Select: React.FC<SelectProps> = (props) => {
  const {
    label,
    placeholder = "Select an option",
    disabled = false,
    required = false,
    error,
    showError = true,
    clearable = true,
    className = "",
    size = "md",
  } = props;

  const {
    selectedOption,
    isOpen,
    toggleMenu,
    selectOption,
    clearSelection,
    menuProps,
    inputProps,
    options,
  } = useSelectController(props);

  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  // Update dropdown position when it's opened, using the utility function
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      setPosition(
        determineDropdownPosition(triggerRef.current, {
          dropdownHeight: 250,
          margin: 8,
          preferredPosition: "bottom",
        })
      );
    }
  }, [isOpen]);

  // Size variants
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  return (
    <div className={`select-container w-full ${className}`}>
      {/* Only render the label if it's provided */}
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          ref={triggerRef}
          className={`
            flex items-center border rounded-md px-3 relative cursor-pointer
            ${sizeClasses[size]}
            ${error ? "border-red-500" : "border-gray-300"}
            ${isOpen ? "ring-2 ring-black border-black" : ""}
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:border-gray-400"
            }
          `}
          onClick={() => !disabled && toggleMenu()}
        >
          <div className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedOption ? (
              <span>{selectedOption.label}</span>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>

          <div className="flex-shrink-0 ml-1 text-gray-400">
            {selectedOption && clearable && !disabled && (
              <button
                type="button"
                className="p-1 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Hidden input for form control */}
          <input type="text" className="sr-only" {...inputProps} />
        </div>

        {/* Only show error if showError prop is true */}
        {showError && error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}

        {isOpen && !disabled && (
          <div
            ref={menuProps.ref}
            className={`
              absolute z-10 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto
              ${position === "top" ? "bottom-full mb-1" : "top-full mt-1"}
            `}
          >
            {options.length === 0 ? (
              <div className="p-2 text-gray-500 text-center">
                No options available
              </div>
            ) : (
              <div className="py-1">
                {options.map((option) => (
                  <div
                    key={option.value as string}
                    className={`
                      flex items-center px-3 py-2 cursor-pointer
                      ${
                        selectedOption?.value === option.value
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50"
                      }
                    `}
                    onClick={() => selectOption(option)}
                  >
                    <span>{option.label}</span>
                    {selectedOption?.value === option.value && (
                      <CheckIcon className="h-4 w-4 ml-auto text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
