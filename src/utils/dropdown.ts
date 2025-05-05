// src/utils/dropdown.ts

/**
 * Utility to determine the best dropdown position based on available space
 */
export const determineDropdownPosition = (
  triggerElement: HTMLElement | null,
  options?: {
    dropdownHeight?: number;
    margin?: number;
    preferredPosition?: "top" | "bottom";
  }
): "top" | "bottom" => {
  if (!triggerElement) return "bottom";

  const {
    dropdownHeight = 250, // Default approximate height
    margin = 8, // Margin to add between trigger and dropdown
    preferredPosition = "bottom", // Default preferred position
  } = options || {};

  const rect = triggerElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Calculate available space
  const spaceBelow = viewportHeight - rect.bottom - margin;
  const spaceAbove = rect.top - margin;

  // Check if preferred position has enough space
  if (preferredPosition === "bottom" && spaceBelow >= dropdownHeight) {
    return "bottom";
  }

  if (preferredPosition === "top" && spaceAbove >= dropdownHeight) {
    return "top";
  }

  // If preferred position doesn't have enough space, choose the one with more space
  return spaceBelow >= spaceAbove ? "bottom" : "top";
};

/**
 * Hook to handle dropdown positioning logic
 */
export const useDropdownPosition = () => {
  const calculatePosition = (
    element: HTMLElement | null,
    options?: {
      dropdownHeight?: number;
      margin?: number;
      preferredPosition?: "top" | "bottom";
    }
  ): "top" | "bottom" => {
    return determineDropdownPosition(element, options);
  };

  return {
    calculatePosition,
  };
};
