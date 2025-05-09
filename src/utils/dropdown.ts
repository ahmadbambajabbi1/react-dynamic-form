export const determineDropdownPosition = (
  triggerElement: HTMLElement | null,
  options?: {
    dropdownHeight?: number;
    margin?: number;
    preferredPosition?: "top" | "bottom";
  }
): { position: "top" | "bottom"; style: React.CSSProperties } => {
  if (!triggerElement) return { position: "bottom", style: {} };

  const {
    dropdownHeight = 250,
    margin = 8,
    preferredPosition = "bottom",
  } = options || {};

  const triggerRect = triggerElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const spaceBelow = viewportHeight - triggerRect.bottom - margin;
  const spaceAbove = triggerRect.top - margin;

  let position: "top" | "bottom";

  if (preferredPosition === "bottom" && spaceBelow >= dropdownHeight) {
    position = "bottom";
  } else if (preferredPosition === "top" && spaceAbove >= dropdownHeight) {
    position = "top";
  } else {
    position = spaceBelow >= spaceAbove ? "bottom" : "top";
  }

  const style: React.CSSProperties = {
    position: "fixed",
    width: triggerRect.width,
    left: triggerRect.left,
    maxHeight: dropdownHeight,
    overflowY: "auto",
    zIndex: 9999,
  };

  if (position === "bottom") {
    style.top = triggerRect.bottom + margin;
  } else {
    style.bottom = viewportHeight - triggerRect.top + margin;
  }

  return { position, style };
};

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
  ): { position: "top" | "bottom"; style: React.CSSProperties } => {
    return determineDropdownPosition(element, options);
  };

  return {
    calculatePosition,
  };
};
