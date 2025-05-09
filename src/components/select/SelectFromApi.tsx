import React, { useRef, useEffect, useState } from "react";
import { useSelectFromApiController } from "./useSelectFromApiController";
import { XIcon } from "../../icons/XIcon";
import { ChevronDown } from "../../icons/ChevronDown";
import { Spinner } from "../../icons/Spinner";
import { determineDropdownPosition } from "../../utils/dropdown";

export const SelectFromApi = (props: any) => {
  const {
    label,
    placeholder = "Select an option",
    disabled = false,
    required = false,
    error,
    clearable = true,
    className = "",
    size = "md",
    showError = true,
  } = props;

  const {
    selectedOption,
    isOpen,
    toggleMenu,
    selectOption,
    clearSelection,
    menuProps,
    inputProps,
    options = [], // Default to empty array
    loading,
    error: apiError,
    refresh,
  } = useSelectFromApiController(props);

  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Update dropdown position when it's opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      const pos = determineDropdownPosition(triggerRef.current, {
        dropdownHeight: 250,
        margin: 4, // Reduced margin for closer positioning
        preferredPosition: "bottom",
      });

      setPosition(pos);

      // Calculate precise positioning with consistent spacing
      setDropdownStyle({
        position: "absolute",
        width: "100%",
        zIndex: 50,
        ...(pos === "bottom"
          ? { top: "100%", marginTop: "1px" }
          : { bottom: "100%", marginBottom: "1px" }),
      });
    }
  }, [isOpen]);

  // Size classes
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  return (
    <div className={`select-from-api-container w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          ref={triggerRef}
          className={`
            flex items-center border rounded-md px-3 relative cursor-pointer
            ${(sizeClasses as any)[size] as any}
            ${error || apiError ? "border-red-500" : "border-gray-300"}
            ${isOpen ? "ring-2 ring-black border-black" : ""}
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:border-gray-400"
            }
          `}
          onClick={(e) => {
            if (!disabled) {
              e.stopPropagation(); // Prevent event bubbling
              toggleMenu();
            }
          }}
        >
          <input
            {...inputProps}
            className="block w-full h-full outline-none bg-transparent cursor-pointer"
            placeholder={placeholder}
            readOnly
            disabled={disabled}
            onClick={(e) => e.stopPropagation()} // Prevent input click from closing dropdown
          />

          <div className="flex items-center ml-2">
            {loading ? (
              <Spinner />
            ) : (
              <>
                {selectedOption && clearable && (
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                  >
                    <XIcon />
                  </button>
                )}
                <span
                  className={`text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown />
                </span>
              </>
            )}
          </div>
        </div>

        {/* Only show error if showError prop is true */}
        {showError && (error || apiError) && (
          <p className="mt-1 text-sm text-red-500">
            {error || apiError?.message}
          </p>
        )}

        {isOpen && !disabled && (
          <div
            ref={menuProps.ref}
            style={dropdownStyle}
            className={`
              bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto
              ${position === "top" ? "rounded-b-md" : "rounded-t-md"}
            `}
            onClick={(e) => e.stopPropagation()} // Prevent menu clicks from closing dropdown
          >
            {loading ? (
              <div className="p-3 text-sm text-gray-500 text-center flex items-center justify-center">
                <Spinner />
                <span className="ml-2">Loading options...</span>
              </div>
            ) : apiError && !showError ? (
              <div className="p-3">
                <p className="text-sm text-red-500 mb-2">
                  Failed to load options
                </p>
                <button
                  className="text-sm text-black hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    refresh();
                  }}
                >
                  Try again
                </button>
              </div>
            ) : options.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                No options available
              </div>
            ) : (
              <ul className="py-1">
                {options.map((option) => (
                  <li
                    key={option.value}
                    className={`
                      px-3 py-2 cursor-pointer text-sm hover:bg-gray-100
                      ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                      ${
                        selectedOption?.value === option.value
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!option.disabled) {
                        selectOption(option);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <span className="mr-2">{option.icon}</span>
                      )}
                      {option.label}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
