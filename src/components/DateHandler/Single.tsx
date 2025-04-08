// src/components/DateHandler/SingleDatePicker.tsx
import React, { useState, useMemo } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { FormControllerProps } from "../../types";
import {
  format,
  isValid,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  addMonths,
} from "date-fns";

type SingleDatePickerProps = {
  field: ControllerRenderProps<z.TypeOf<any>, any>;
  controller?: FormControllerProps;
  onClose?: () => void;
};

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  controller,
  field,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    isValid(field.value) ? field.value : new Date()
  );

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Determine the starting day of the week for padding
    const startingDayIndex = monthStart.getDay();
    const paddedDays = Array(startingDayIndex).fill(null).concat(days);

    return paddedDays;
  }, [currentMonth]);

  // Handle date selection
  const handleDateSelect = (date: Date | null) => {
    if (date) {
      field.onChange(date);
      onClose?.();
    }
  };

  // Navigate between months
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(
      direction === "prev"
        ? subMonths(currentMonth, 1)
        : addMonths(currentMonth, 1)
    );
  };

  return (
    <div className="select-none">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeftIcon />
        </button>
        <div className="font-semibold text-lg">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          type="button"
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          // Check if the day is selectable
          const isSelectable = day !== null;
          const isSelected =
            isSelectable &&
            field.value &&
            isValid(field.value) &&
            isSameDay(day, field.value);
          const isToday = isSelectable && isSameDay(day, new Date());

          // Check for disabled dates if a custom disabled function is provided
          const isDisabled =
            isSelectable &&
            controller?.disabled &&
            typeof controller.disabled === "function" &&
            controller.disabled(day);

          return (
            <button
              key={`${index}-${day?.toISOString() || "empty"}`}
              type="button"
              disabled={!isSelectable || isDisabled}
              onClick={() => isSelectable && handleDateSelect(day)}
              className={`
                h-10 w-10 rounded-full text-sm transition-colors
                ${!isSelectable ? "invisible" : ""}
                ${
                  isSelected
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-100"
                }
                ${
                  isToday && !isSelected
                    ? "border border-blue-500 text-blue-500"
                    : ""
                }
                ${
                  isDisabled
                    ? "text-gray-300 cursor-not-allowed hover:bg-transparent"
                    : ""
                }
              `}
            >
              {day?.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Chevron Icons
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default SingleDatePicker;
