import { useState, useRef, useEffect, useCallback } from "react";
import {
  SelectControllerProps,
  SelectOption,
  SelectControllerReturn,
} from "./types";

export const useSelectController = (
  props: SelectControllerProps
): SelectControllerReturn => {
  // Add default empty array for options
  const { options = [], value, onChange, defaultValue = null } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    value !== undefined ? (value as string) : defaultValue
  );
  const [menuPosition, setMenuPosition] = useState<"top" | "bottom">("bottom");

  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find the currently selected option - now safe since options has a default value
  const selectedOption =
    options.find((opt) => opt.value === selectedValue) || null;

  const openMenu = useCallback(() => {
    if (menuRef.current && inputRef.current) {
      // Calculate whether menu should open upward or downward
      const inputRect = inputRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceAbove = inputRect.top;
      const spaceBelow = windowHeight - inputRect.bottom;

      // If space below is less than 200px and there's more space above, open upward
      setMenuPosition(
        spaceBelow < 200 && spaceBelow < spaceAbove ? "top" : "bottom"
      );
    }
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen]);

  const selectOption = useCallback(
    (option: SelectOption) => {
      setSelectedValue(option.value as string);
      if (onChange) {
        onChange(option.value as string);
      }
      closeMenu();
    },
    [onChange, closeMenu]
  );

  const clearSelection = useCallback(() => {
    setSelectedValue(null);
    if (onChange) {
      onChange(null);
    }
  }, [onChange]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        inputRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  // Update selected value when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value as string);
    }
  }, [value]);

  return {
    selectedOption,
    options,
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    selectOption,
    clearSelection,
    menuProps: {
      ref: menuRef,
      position: menuPosition,
    },
    inputProps: {
      value: selectedOption?.label || "",
      onChange: () => {}, // Input is read-only for basic select
      onFocus: openMenu,
      onBlur: () => {}, // We handle closing with click outside
      ref: inputRef,
    },
  };
};
