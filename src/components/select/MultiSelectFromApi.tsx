import { useRef, useEffect } from "react";
import { useMultiSelectFromApiController } from "./useMultiSelectFromApiController";
import { XIcon } from "../../icons/XIcon";
import { ChevronDown } from "../../icons/ChevronDown";
import { Spinner } from "../../icons/Spinner";
import { CheckIcon } from "../../icons/CheckIcon";
import { useDropdownPosition, findDialogContainer } from "../../utils/dropdown";

export const MultiSelectFromApi = (props: any) => {
  const {
    label,
    placeholder = "Select options",
    disabled = false,
    required = false,
    error,
    clearable = true,
    className = "",
    size = "md",
    showError = true,
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
    loading,
    error: apiError,
    refresh,
  } = useMultiSelectFromApiController(props);

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement | null>(null);

  const { position, initPositioning } = useDropdownPosition();

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      if (!dialogRef.current) {
        dialogRef.current = findDialogContainer(triggerRef.current);
      }

      const cleanup = initPositioning(
        triggerRef.current,
        menuRef.current,
        dialogRef.current,
        {
          dropdownHeight: 250,
          margin: 8,
          preferredPosition: "bottom",
        }
      );

      return cleanup;
    }
  }, [isOpen, initPositioning]);

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

  return (
    <div className={`multi-select-from-api-container w-full ${className}`}>
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
          onClick={() => !disabled && toggleMenu()}
        >
          {selectedOptions?.length > 0 ? (
            <div className="flex flex-wrap gap-1 py-1 max-w-full overflow-hidden">
              {selectedOptions?.length <= 3 ? (
                selectedOptions.map((option) => (
                  <div
                    key={option.value}
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
                  {selectedOptions?.length} items selected
                </div>
              )}
            </div>
          ) : (
            <input
              {...inputProps}
              className="block w-full h-full outline-none bg-transparent cursor-pointer"
              placeholder={placeholder}
              readOnly
              disabled={disabled}
            />
          )}

          <div className="flex items-center ml-2">
            {loading ? (
              <Spinner />
            ) : (
              <>
                {selectedOptions?.length > 0 && clearable && (
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
              </>
            )}
          </div>
        </div>

        {showError && (error || apiError) && (
          <p className="mt-1 text-sm text-red-500">
            {error || apiError?.message}
          </p>
        )}

        {isOpen && !disabled && (
          <div
            ref={menuRef}
            style={position.style}
            className="bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto z-50"
          >
            {loading ? (
              <div className="p-3 text-sm text-gray-500 text-center flex items-center justify-center">
                <Spinner />
                <span className="ml-2">Loading options...</span>
              </div>
            ) : apiError ? (
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
            ) : options?.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                No options available
              </div>
            ) : (
              <ul className="py-1">
                {options?.map((option) => (
                  <li
                    key={option.value}
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
