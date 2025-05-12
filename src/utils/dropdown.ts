// src/utils/dropdown.ts - Fixed version with infinite loop prevention
import { useEffect, useRef, useState, useCallback } from "react";

// Enhanced position calculation with dialog support
export const determineDropdownPosition = (
  triggerElement: HTMLElement | null,
  options?: {
    dropdownHeight?: number;
    margin?: number;
    preferredPosition?: "top" | "bottom";
    container?: HTMLElement | null; // Optional container (like a dialog) to consider
  }
): { position: "top" | "bottom"; style: React.CSSProperties } => {
  if (!triggerElement) return { position: "bottom", style: {} };

  const {
    dropdownHeight = 250,
    margin = 8,
    preferredPosition = "bottom",
    container = null,
  } = options || {};

  // Get dimensions
  const triggerRect = triggerElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Check if inside a dialog or other positioned container
  let offsetLeft = 0;
  let offsetTop = 0;

  // If we have a container, calculate offsets relative to it
  if (container) {
    const containerRect = container.getBoundingClientRect();
    // Account for container's position and any transforms
    offsetLeft = containerRect.left;
    offsetTop = containerRect.top;
  }

  // Calculate available space
  const spaceBelow = viewportHeight - triggerRect.bottom - margin;
  const spaceAbove = triggerRect.top - margin;

  // Determine position based on available space
  let position: "top" | "bottom";
  if (preferredPosition === "bottom" && spaceBelow >= dropdownHeight) {
    position = "bottom";
  } else if (preferredPosition === "top" && spaceAbove >= dropdownHeight) {
    position = "top";
  } else {
    position = spaceBelow >= spaceAbove ? "bottom" : "top";
  }

  // Calculate dropdown width and ensure it stays with input horizontally
  const dropdownWidth = triggerRect.width;

  // Calculate dimensions for dropdown
  const style: React.CSSProperties = {
    position: "fixed",
    width: dropdownWidth,
    maxHeight: Math.min(
      dropdownHeight,
      position === "bottom" ? spaceBelow : spaceAbove
    ),
    overflowY: "auto",
    zIndex: 9999,
  };
  style.left = triggerRect.left;

  if (position === "bottom") {
    style.top = triggerRect.bottom + margin;
  } else {
    style.bottom = viewportHeight - triggerRect.top + margin;
  }

  return { position, style };
};

export const useDropdownPosition = () => {
  const [position, setPosition] = useState<{
    position: "top" | "bottom";
    style: React.CSSProperties;
  }>({ position: "bottom", style: {} });

  const triggerRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const optionsRef = useRef<any>(null);

  // Use this ref to prevent unnecessary state updates
  const positionRef = useRef(position);

  // Function to recalculate position with state update prevention
  const recalculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const newPosition = determineDropdownPosition(triggerRef.current, {
      ...optionsRef.current,
      container: containerRef.current,
    });

    // Compare with current position to prevent unnecessary updates
    const currentStyle = positionRef.current.style;
    const newStyle = newPosition.style;

    // Only update if there are meaningful changes
    const hasChanged =
      positionRef.current.position !== newPosition.position ||
      currentStyle.top !== newStyle.top ||
      currentStyle.bottom !== newStyle.bottom ||
      currentStyle.left !== newStyle.left ||
      currentStyle.width !== newStyle.width ||
      currentStyle.maxHeight !== newStyle.maxHeight;

    if (hasChanged) {
      positionRef.current = newPosition;
      setPosition(newPosition);
    }
  }, []);

  // Initialize position tracking with proper cleanup
  const initPositioning = useCallback(
    (
      trigger: HTMLElement | null,
      dropdown: HTMLElement | null,
      container: HTMLElement | null = null,
      options?: {
        dropdownHeight?: number;
        margin?: number;
        preferredPosition?: "top" | "bottom";
      }
    ) => {
      triggerRef.current = trigger;
      dropdownRef.current = dropdown;
      containerRef.current = container;
      optionsRef.current = options || {};

      // Initial calculation
      recalculatePosition();

      // Find all possible scroll containers
      const scrollContainers: HTMLElement[] = [];

      // Add document as default
      scrollContainers.push(document.documentElement);

      // Add dialog or other direct container if available
      if (container) {
        scrollContainers.push(container);

        // Find scrollable parents of the container
        let parent = container.parentElement;
        while (parent) {
          const style = window.getComputedStyle(parent);
          if (
            /(auto|scroll|overlay)/.test(
              style.overflow + style.overflowY + style.overflowX
            )
          ) {
            scrollContainers.push(parent);
          }
          parent = parent.parentElement;
        }
      } else if (trigger) {
        // If no container but we have a trigger, find its scrollable parents
        let scrollableParent = findScrollableParent(trigger);
        if (scrollableParent && !scrollContainers.includes(scrollableParent)) {
          scrollContainers.push(scrollableParent);
        }
      }

      // Add event handlers with throttling to prevent excessive updates
      let ticking = false;
      const handleScrollOrResize = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            recalculatePosition();
            ticking = false;
          });
          ticking = true;
        }
      };

      // Add event listeners
      scrollContainers.forEach((container) => {
        container.addEventListener("scroll", handleScrollOrResize, {
          passive: true,
        });
      });

      // Handle window resize
      window.addEventListener("resize", handleScrollOrResize, {
        passive: true,
      });

      // Return cleanup function
      return () => {
        scrollContainers.forEach((container) => {
          container.removeEventListener("scroll", handleScrollOrResize);
        });
        window.removeEventListener("resize", handleScrollOrResize);
      };
    },
    [recalculatePosition]
  );

  return {
    position,
    initPositioning,
    recalculatePosition: useCallback(() => {
      requestAnimationFrame(recalculatePosition);
    }, [recalculatePosition]),
  };
};

export const findDialogContainer = (
  element: HTMLElement | null
): HTMLElement | null => {
  if (!element) return null;

  // Check for dialog role or common dialog class names
  const isDialog = (el: HTMLElement): boolean => {
    return (
      el.getAttribute("role") === "dialog" ||
      el.getAttribute("aria-modal") === "true" ||
      el.classList.contains("dialog") ||
      el.classList.contains("modal") ||
      el.classList.contains("DialogContent") ||
      el.classList.contains("ModalContent")
    );
  };

  // Start checking from the element's parent
  let current = element.parentElement;
  while (current) {
    if (isDialog(current)) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
};

export const findScrollableParent = (
  element: HTMLElement | null
): HTMLElement | null => {
  if (!element || element === document.body) return document.body;

  const { overflow, overflowY, overflowX } = window.getComputedStyle(element);

  if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return findScrollableParent(element.parentElement);
};
