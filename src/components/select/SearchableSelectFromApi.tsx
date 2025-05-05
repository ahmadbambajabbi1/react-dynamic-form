import React from "react";
import { SearchableSelectFromApiProps } from "./types";
import { useSearchableSelectFromApiController } from "./useSearchableSelectFromApiController";
import { XIcon } from "../../icons/XIcon";
import { ChevronDown } from "../../icons/ChevronDown";
import { Spinner } from "../../icons/Spinner";

export const SearchableSelectFromApi: React.FC<SearchableSelectFromApiProps> = (
  props
) => {
  const {
    label,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    disabled = false,
    required = false,
    error,
    clearable = true,
    className = "",
    size = "md",
    noResultsMessage = "No results found",
  } = props;

  const {
    selectedOption,
    isOpen,
    toggleMenu,
    selectOption,
    clearSelection,
    menuProps,
    inputProps,
    filteredOptions,
    searchTerm,
    loading,
    loadingResults,
    error: apiError,
    refresh,
  } = useSearchableSelectFromApiController(props);

  // Size classes
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  // Render the component
  return (
    <div className={`searchable-select-from-api-container w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={`
            flex items-center border rounded-md px-3 relative
            ${sizeClasses[size]}
            ${error || apiError ? "border-red-500" : "border-gray-300"}
            ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:border-gray-400"
            }
          `}
          onClick={() => !disabled && !isOpen && toggleMenu()}
        >
          <input
            {...inputProps}
            className="block w-full h-full outline-none bg-transparent"
            placeholder={isOpen ? searchPlaceholder : placeholder}
            readOnly={!isOpen}
            disabled={disabled}
          />

          <div className="flex items-center ml-2">
            {loading || loadingResults ? (
              <Spinner />
            ) : (
              <>
                {selectedOption && clearable && !isOpen && (
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

        {(error || apiError) && (
          <p className="mt-1 text-sm text-red-500">
            {error || apiError?.message}
          </p>
        )}

        {isOpen && !disabled && (
          <div
            ref={menuProps.ref}
            className={`
              absolute z-10 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto
              ${
                menuProps.position === "top"
                  ? "bottom-full mb-1"
                  : "top-full mt-1"
              }
            `}
          >
            {loading ? (
              <div className="p-3 text-sm text-gray-500 text-center flex items-center justify-center">
                <Spinner />
                <span className="ml-2">Loading options...</span>
              </div>
            ) : loadingResults ? (
              <div className="p-3 text-sm text-gray-500 text-center flex items-center justify-center">
                <Spinner />
                <span className="ml-2">Searching...</span>
              </div>
            ) : apiError ? (
              <div className="p-3">
                <p className="text-sm text-red-500 mb-2">
                  Failed to load options
                </p>
                <button
                  className="text-sm text-blue-500 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    refresh();
                  }}
                >
                  Try again
                </button>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                {searchTerm ? noResultsMessage : "No options available"}
              </div>
            ) : (
              <ul className="py-1">
                {filteredOptions.map((option) => (
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
