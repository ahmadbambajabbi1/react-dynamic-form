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
    dropdownHeight = 250,
    margin = 8,
    preferredPosition = "bottom",
  } = options || {};

  // Get bounds of the trigger element
  const triggerRect = triggerElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Find modal or dialog container
  const modalContainer = findModalContainer(triggerElement);

  if (modalContainer) {
    const modalRect = modalContainer.getBoundingClientRect();

    // Calculate available space within the modal
    const spaceBelow = modalRect.bottom - triggerRect.bottom - margin;
    const spaceAbove = triggerRect.top - modalRect.top - margin;

    // If there's not enough space below but more space above
    if (spaceBelow < dropdownHeight && spaceBelow < spaceAbove) {
      return "top";
    }

    // If there's not enough space above but more space below
    if (spaceAbove < dropdownHeight && spaceAbove < spaceBelow) {
      return "bottom";
    }

    // If both spaces are sufficient, use preferred position
    return preferredPosition;
  }

  // Fallback to viewport-based positioning
  const spaceBelow = viewportHeight - triggerRect.bottom - margin;
  const spaceAbove = triggerRect.top - margin;

  if (preferredPosition === "bottom" && spaceBelow >= dropdownHeight) {
    return "bottom";
  }

  if (preferredPosition === "top" && spaceAbove >= dropdownHeight) {
    return "top";
  }

  return spaceBelow >= spaceAbove ? "bottom" : "top";
};

// Find the closest modal or dialog container
const findModalContainer = (element: HTMLElement): HTMLElement | null => {
  let current = element.parentElement;

  while (current) {
    const style = window.getComputedStyle(current);
    const role = current.getAttribute("role");

    // Look for common modal indicators
    if (
      role === "dialog" ||
      role === "modal" ||
      current.classList.contains("modal") ||
      current.classList.contains("dialog") ||
      style.position === "fixed" ||
      (style.zIndex !== "auto" && parseInt(style.zIndex) > 0)
    ) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
};

// Also look for scrollable elements that might affect positioning
const findScrollableParent = (
  element: HTMLElement | null
): HTMLElement | null => {
  if (!element || element === document.body) return document.body;

  const { overflow, overflowY, overflowX } = window.getComputedStyle(element);

  if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return findScrollableParent(element.parentElement);
};

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
