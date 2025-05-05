import React, { useRef, useEffect, useState } from "react";
import { useSearchableMultiSelectFromApiController } from "./useSearchableMultiSelectFromApiController";
import { determineDropdownPosition } from "../../utils/dropdown";

// Import icons
import { XIcon } from "../../icons/XIcon";
import { ChevronDown } from "../../icons/ChevronDown";
import { CheckIcon } from "../../icons/CheckIcon";
import { Spinner } from "../../icons/Spinner";
import { SearchIcon } from "../../icons/SearchIcon";

export const SearchableMultiSelectFromApi = (props: any) => {
  const {
    label,
    placeholder = "Select options",
    searchPlaceholder = "Search...",
    disabled = false,
    required = false,
    error,
    showError = true,
    clearable = true,
    className = "",
    size = "md",
  } = props;

  const {
    selectedOptions,
    isOpen,
    toggleMenu,
    selectOption,
    removeOption,
    clearAll,
    isSelected,
    menuProps,
    inputProps,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    loading,
    loadingResults,
    error: apiError,
  } = useSearchableMultiSelectFromApiController(props);

  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [position, setPosition] = useState("bottom");

  // Update dropdown position when it's opened
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

  // Focus search input when dropdown is opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      (searchInputRef.current as any)?.focus();
    }
  }, [isOpen]);

  // Size variants
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  // Create a container for selected options
  const SelectedItemsContainer = () => {
    if (!isOpen && selectedOptions.length === 0) {
      return (
        <div className="flex-grow text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
          {placeholder}
        </div>
      );
    }

    if (isOpen) {
      return (
        <input
          ref={searchInputRef}
          type="text"
          className="flex-grow bg-transparent outline-none"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    return (
      <div className="flex flex-wrap gap-1 flex-grow overflow-hidden">
        {selectedOptions.map((option) => (
          <div
            key={option.value.toString()}
            className="bg-blue-100 text-blue-800 rounded-md px-2 py-0.5 flex items-center gap-1 text-sm"
          >
            <span className="truncate">{option.label}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }}
                className="text-black hover:text-blue-700"
              >
                <XIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`searchable-multi-select-container w-full ${className}`}>
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
            ${(sizeClasses as any)[size] as any}
            ${error || apiError ? "border-red-500" : "border-gray-300"}
            ${isOpen ? "ring-2 ring-black border-black" : ""}
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:border-gray-400"
            }
          `}
          onClick={() => !disabled && toggleMenu()}
        >
          {isOpen && <SearchIcon className="h-4 w-4 text-gray-400 mr-2" />}
          <SelectedItemsContainer />

          <div className="flex-shrink-0 ml-1 text-gray-400">
            {loading || loadingResults ? (
              <Spinner className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {selectedOptions.length > 0 &&
                  clearable &&
                  !disabled &&
                  !isOpen && (
                    <button
                      type="button"
                      className="p-1 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAll();
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
              </>
            )}
          </div>

          {/* Hidden input for form control */}
          <input type="hidden" className="sr-only" {...inputProps} />
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
            className={`
              absolute z-10 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto
              ${position === "top" ? "bottom-full mb-1" : "top-full mt-1"}
            `}
          >
            {loadingResults ? (
              <div className="p-4 text-center text-gray-500">
                <Spinner className="h-5 w-5 mx-auto mb-2 animate-spin" />
                <p>Searching...</p>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm.length > 0
                  ? "No results found"
                  : "No options available"}
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value.toString()}
                    className={`
                      flex items-center px-3 py-2 cursor-pointer
                      ${
                        isSelected(option)
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50"
                      }
                    `}
                    onClick={() => selectOption(option)}
                  >
                    <div
                      className={`
                        w-4 h-4 rounded border mr-2 flex items-center justify-center
                        ${
                          isSelected(option)
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        }
                      `}
                    >
                      {isSelected(option) && (
                        <CheckIcon className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span>{option.label}</span>
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

export default SearchableMultiSelectFromApi;
