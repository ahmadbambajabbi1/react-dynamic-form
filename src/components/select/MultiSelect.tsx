import React, { useRef, useEffect, useState } from "react";
import { useMultiSelectController } from "./useMultiSelectController";
import { SelectOption, MultiSelectProps } from "./types";
import { determineDropdownPosition } from "../../utils/dropdown";

import { XIcon } from "../../icons/XIcon";
import { ChevronDown } from "../../icons/ChevronDown";
import { CheckIcon } from "../../icons/CheckIcon";

export const MultiSelect: React.FC<MultiSelectProps> = (props) => {
  const {
    label,
    placeholder = "Select options",
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
    options,
  } = useMultiSelectController(props);

  const triggerRef = useRef<HTMLDivElement>(null);
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

  const SelectedItemsContainer = () => {
    if (selectedOptions.length === 0) {
      return (
        <div className="flex-grow text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
          {placeholder}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1 flex-grow overflow-hidden">
        {selectedOptions.map((option) => (
          <div
            key={option.value as string}
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
    <div className={`multi-select-container w-full ${className}`}>
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
          <SelectedItemsContainer />

          <div className="flex-shrink-0 ml-1 text-gray-400">
            {selectedOptions.length > 0 && clearable && !disabled && (
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
          </div>

          <input type="text" className="sr-only" {...inputProps} />
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

export default MultiSelect;
