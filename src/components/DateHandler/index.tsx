// src/components/DateHandler/DateHandler.tsx
import React, { useState, useRef, useEffect } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { Controller } from "../../types";
import { cn } from "../../utils";
import {
  format,
  addDays,
  isValid,
  startOfToday,
  startOfTomorrow,
  startOfWeek,
  endOfWeek,
  subMonths,
  addMonths,
} from "date-fns";
import SingleDatePicker from "./Single";
import RangeDatePicker from "./Range";
import { determineDropdownPosition } from "../../utils/dropdown";

// Define type for date range value
export interface DateRange {
  from?: Date | null;
  to?: Date | null;
}

type DateHandlerProps = {
  field: ControllerRenderProps<z.TypeOf<any>, any>;
  controller: Controller;
};

const DateHandler: React.FC<DateHandlerProps> = ({ controller, field }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate position when dropdown opens
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      setPosition(
        determineDropdownPosition(triggerRef.current, {
          dropdownHeight: 380, // Approx height of calendar
          margin: 8,
          preferredPosition: "bottom",
        })
      );
    }
  }, [isOpen]);

  // Render date display based on mode
  const renderDateDisplay = () => {
    if (controller.mode === "range") {
      const rangeValue = field.value as DateRange;
      if (rangeValue?.from && rangeValue?.to) {
        return `${format(rangeValue.from, "MMM dd")} - ${format(
          rangeValue.to,
          "MMM dd, yyyy"
        )}`;
      }
      if (rangeValue?.from) {
        return format(rangeValue.from, "MMM dd, yyyy");
      }
      return controller.placeholder || "Select date range";
    }

    // Single date mode
    if (field.value instanceof Date && isValid(field.value)) {
      return format(field.value, "MMMM dd, yyyy");
    }
    return controller.placeholder || "Select date";
  };

  // Quick date selection actions
  const quickActions = {
    single: [
      {
        label: "Today",
        action: () => {
          field.onChange(startOfToday());
          setIsOpen(false);
        },
      },
      {
        label: "Tomorrow",
        action: () => {
          field.onChange(startOfTomorrow());
          setIsOpen(false);
        },
      },
      {
        label: "Next Week",
        action: () => {
          field.onChange(endOfWeek(new Date()));
          setIsOpen(false);
        },
      },
    ],
    range: [
      {
        label: "This Week",
        action: () => {
          field.onChange({
            from: startOfWeek(new Date()),
            to: endOfWeek(new Date()),
          });
          setIsOpen(false);
        },
      },
      {
        label: "Next Week",
        action: () => {
          const nextWeekStart = addDays(startOfWeek(new Date()), 7);
          field.onChange({
            from: nextWeekStart,
            to: addDays(nextWeekStart, 6),
          });
          setIsOpen(false);
        },
      },
      {
        label: "This Month",
        action: () => {
          const today = new Date();
          field.onChange({
            from: startOfWeek(today),
            to: endOfWeek(today),
          });
          setIsOpen(false);
        },
      },
    ],
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Date Display Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full text-left px-3 py-2 border rounded-md shadow-sm flex items-center justify-between",
          !field.value && "text-gray-500",
          controller.className
        )}
      >
        <span className="truncate">{renderDateDisplay()}</span>
        <CalendarIcon />
      </button>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-[320px] bg-white border rounded-lg shadow-xl p-4",
            position === "top" ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          {/* Quick Actions */}
          <div className="flex space-x-2 mb-4 overflow-x-auto">
            {(controller.mode === "range"
              ? quickActions.range
              : quickActions.single
            ).map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.action}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md whitespace-nowrap"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <div className="border-t pt-4">
            {controller.mode === "range" ? (
              <RangeDatePicker
                controller={controller}
                field={field}
                onClose={() => setIsOpen(false)}
              />
            ) : (
              <SingleDatePicker
                controller={controller}
                field={field}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4 border-t pt-3">
            <button
              type="button"
              onClick={() => {
                field.onChange(null);
                setIsOpen(false);
              }}
              className="text-sm text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-md"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-1.5 rounded-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Calendar icon component
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <rect width="20" height="20" x="2" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default DateHandler;
