import { useState, useEffect } from "react";
import {
  SearchableMultiSelectProps,
  SearchableMultiSelectControllerReturn,
} from "./types";
import { useMultiSelectController } from "./useMultiSelectController";

export const useSearchableMultiSelectController = (
  props: SearchableMultiSelectProps
): SearchableMultiSelectControllerReturn => {
  const { options, searchPlaceholder, minSearchLength = 0 } = props;

  const baseMultiSelect = useMultiSelectController(props);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOptions = options.filter((option) => {
    if (searchTerm.length < minSearchLength) return true;
    return option.label.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const inputProps = {
    ...baseMultiSelect.inputProps,
    value: baseMultiSelect.isOpen
      ? searchTerm
      : baseMultiSelect.inputProps.value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      if (!baseMultiSelect.isOpen) {
        baseMultiSelect.openMenu();
      }
    },
    placeholder: baseMultiSelect.isOpen
      ? searchPlaceholder || "Search..."
      : props.placeholder || "Select options",
  };

  // Clear search when closing the menu
  useEffect(() => {
    if (!baseMultiSelect.isOpen) {
      setSearchTerm("");
    }
  }, [baseMultiSelect.isOpen]);

  return {
    ...baseMultiSelect,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    inputProps,
  };
};
