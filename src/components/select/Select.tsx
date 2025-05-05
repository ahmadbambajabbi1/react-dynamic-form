import React from "react";
import { SelectControllerProps, SelectOption } from "./types";
import { useSelectController } from "./useSelectController";
import { XIcon } from "../../icons/XIcon";
import { ChevronDown } from "../../icons/ChevronDown";
import { Spinner } from "../../icons/Spinner";

export const Select: React.FC<SelectControllerProps> = (props) => {
  const {
    label,
    placeholder = "Select an option",
    disabled = false,
    required = false,
    error,
    clearable = true,
    loading = false,
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

  // Size classes
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  // Render the component
  return (
    <div className={`select-container w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={`
            flex items-center border rounded-md px-3 relative cursor-pointer
            ${sizeClasses[size]}
            ${error ? "border-red-500" : "border-gray-300"}
            ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:border-gray-400"
            }
          `}
          onClick={() => !disabled && toggleMenu()}
        >
          <input
            {...inputProps}
            className="block w-full h-full outline-none bg-transparent cursor-pointer"
            placeholder={placeholder}
            readOnly
            disabled={disabled}
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

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {isOpen && !disabled && (
          <div
            ref={menuProps.ref}
            className={`
              absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto
              ${
                menuProps.position === "top"
                  ? "bottom-full mb-1"
                  : "top-full mt-1"
              }
            `}
          >
            {options.length === 0 ? (
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
                    onClick={() => !option.disabled && selectOption(option)}
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
