import { useState, useEffect } from "react";
import {
  SearchableSelectProps,
  SearchableSelectControllerReturn,
} from "./types";
import { useSelectController } from "./useSelectController";

export const useSearchableSelectController = (
  props: SearchableSelectProps
): SearchableSelectControllerReturn => {
  const { options, searchPlaceholder, minSearchLength = 0 } = props;

  const baseSelect = useSelectController(props);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter options based on search term
  const filteredOptions = options.filter((option) => {
    if (searchTerm.length < minSearchLength) return true;
    return option.label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Override input props to make it editable for search
  const inputProps = {
    ...baseSelect.inputProps,
    value: baseSelect.isOpen
      ? searchTerm
      : baseSelect.selectedOption?.label || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      if (!baseSelect.isOpen) {
        baseSelect.openMenu();
      }
    },
    placeholder: baseSelect.isOpen
      ? searchPlaceholder || "Search..."
      : props.placeholder || "Select option",
  };

  // Clear search when closing the menu
  useEffect(() => {
    if (!baseSelect.isOpen) {
      setSearchTerm("");
    }
  }, [baseSelect.isOpen]);

  return {
    ...baseSelect,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    inputProps,
  };
};
