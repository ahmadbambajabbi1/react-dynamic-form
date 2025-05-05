// src/components/select/useMultiSelectController.ts
import { useState, useRef, useEffect, useCallback } from "react";
import {
  MultiSelectProps,
  SelectOption,
  MultiSelectControllerReturn,
} from "./types";

export const useMultiSelectController = (
  props: MultiSelectProps
): MultiSelectControllerReturn => {
  const {
    options,
    value,
    onChange,
    defaultValue = null,
    maxSelections,
    selectionSummary,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    value !== undefined
      ? (value as string[])
      : defaultValue
      ? [defaultValue]
      : []
  );
  const [menuPosition, setMenuPosition] = useState<"top" | "bottom">("bottom");

  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find the currently selected options
  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value as string)
  );

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
  }, [isOpen, openMenu, closeMenu]);

  const selectOption = useCallback(
    (option: SelectOption) => {
      const optionValue = option.value as string;

      setSelectedValues((prevValues) => {
        // If already selected, remove it (toggle behavior)
        if (prevValues.includes(optionValue)) {
          return prevValues.filter((v) => v !== optionValue);
        }

        // Check if maximum selections reached
        if (maxSelections !== undefined && prevValues.length >= maxSelections) {
          return prevValues;
        }

        // Add the new selection
        return [...prevValues, optionValue];
      });
    },
    [maxSelections]
  );

  const removeOption = useCallback((option: SelectOption) => {
    const optionValue = option.value as string;
    setSelectedValues((prevValues) =>
      prevValues.filter((v) => v !== optionValue)
    );
  }, []);

  const clearAll = useCallback(() => {
    setSelectedValues([]);
    if (onChange) {
      onChange([]);
    }
  }, [onChange]);

  const isSelected = useCallback(
    (option: SelectOption) => {
      return selectedValues.includes(option.value as string);
    },
    [selectedValues]
  );

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

  // Update selected values when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value as string[]);
    }
  }, [value]);

  // Notify parent component of changes - FIXED to prevent infinite loop
  useEffect(() => {
    if (onChange && JSON.stringify(value) !== JSON.stringify(selectedValues)) {
      onChange(selectedValues);
    }
  }, [selectedValues, onChange, value]);

  // Generate display text for the input
  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return "";
    }

    if (selectionSummary) {
      return selectionSummary(selectedOptions);
    }

    if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    }

    return `${selectedOptions.length} items selected`;
  };

  return {
    selectedOptions,
    options,
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    selectOption,
    removeOption,
    clearAll,
    isSelected,
    menuProps: {
      ref: menuRef,
      position: menuPosition,
    },
    inputProps: {
      value: getDisplayText(),
      onChange: () => {}, // Input is read-only for basic multi-select
      onFocus: openMenu,
      onBlur: () => {}, // We handle closing with click outside
      ref: inputRef,
    },
  };
};
