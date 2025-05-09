import React, { useRef, useEffect, useState } from "react";
import { SearchableMultiSelectProps } from "./types";
import { useSearchableMultiSelectController } from "./useSearchableMultiSelectController";
import { determineDropdownPosition } from "../../utils/dropdown";
import { XIcon } from "../../icons/XIcon";
import { ChevronDown } from "../../icons/ChevronDown";
import { CheckIcon } from "../../icons/CheckIcon";

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = (
  props
) => {
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
    noResultsMessage = "No results found",
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
    filteredOptions,
    searchTerm,
    setSearchTerm,
  } = useSearchableMultiSelectController(props);

  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    position: "top" | "bottom";
    style: React.CSSProperties;
  }>({ position: "bottom", style: {} });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      setDropdownPosition(
        determineDropdownPosition(triggerRef.current, {
          dropdownHeight: 250,
          margin: 8,
          preferredPosition: "bottom",
        })
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        menuProps.ref.current &&
        !menuProps.ref.current.contains(event.target as Node)
      ) {
        toggleMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleMenu]);

  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  const { ref: _inputRef, ...otherInputProps } = inputProps;

  return (
    <div className={`searchable-multi-select-container w-full ${className}`}>
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
            flex items-center border rounded-md px-3 relative
            ${sizeClasses[size]}
            ${error ? "border-red-500" : "border-gray-300"}
            ${isOpen ? "ring-2 ring-black border-black" : ""}
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:border-gray-400"
            }
          `}
          onClick={() => !disabled && !isOpen && toggleMenu()}
        >
          {selectedOptions.length > 0 && !isOpen ? (
            <div className="flex flex-wrap gap-1 py-1 max-w-full overflow-hidden">
              {selectedOptions.length <= 3 ? (
                selectedOptions.map((option) => (
                  <div
                    key={option.value.toString()}
                    className="flex items-center bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-sm"
                  >
                    <span className="truncate">{option.label}</span>
                    <button
                      type="button"
                      className="ml-1 text-black hover:text-blue-700 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(option);
                      }}
                    >
                      <XIcon />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-700">
                  {selectedOptions.length} items selected
                </div>
              )}
            </div>
          ) : (
            <input
              ref={searchInputRef}
              {...otherInputProps}
              className="block w-full h-full outline-none bg-transparent"
              placeholder={isOpen ? searchPlaceholder : placeholder}
              readOnly={!isOpen}
              disabled={disabled}
              value={isOpen ? searchTerm : otherInputProps.value}
              onChange={(e) => {
                if (isOpen) {
                  setSearchTerm(e.target.value);
                }
              }}
            />
          )}

          <div className="flex items-center ml-2">
            {selectedOptions.length > 0 && clearable && !isOpen && (
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
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
          </div>
        </div>

        {showError && error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}

        {isOpen && !disabled && (
          <div
            ref={menuProps.ref}
            style={dropdownPosition.style}
            className="bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto z-50"
          >
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                {searchTerm ? noResultsMessage : "No options available"}
              </div>
            ) : (
              <ul className="py-1">
                {filteredOptions.map((option) => (
                  <li
                    key={option.value.toString()}
                    className={`
                      px-3 py-2 cursor-pointer text-sm hover:bg-gray-100
                      ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                      ${
                        isSelected(option)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }
                    `}
                    onClick={() => !option.disabled && selectOption(option)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`
                        w-4 h-4 mr-3 flex-shrink-0 border rounded
                        ${
                          isSelected(option)
                            ? "bg-black border-black text-white"
                            : "border-gray-300"
                        }
                      `}
                      >
                        {isSelected(option) && <CheckIcon />}
                      </div>
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
