// src/components/DefaultInputController.tsx
import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Controller } from "../types";
import { cn } from "../utils";

type DefaultInputControllerProps = {
  field: ControllerRenderProps<z.TypeOf<any>, any>;
  controller: Controller;
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
};

/**
 * DefaultInputController - Handles standard input types (text, email, password, number)
 */
const DefaultInputController: React.FC<DefaultInputControllerProps> = ({
  controller,
  field,
  form,
}) => {
  // Handle number input conversion
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (controller.type === "number") {
      // Convert to number if the field is a number type
      const numValue = value === "" ? "" : Number(value);
      form.setValue(controller?.name || "", numValue);
    } else {
      // For other types, just set the string value
      field.onChange(e);
    }
  };

  return (
    <div className="relative">
      <input
        id={field.name}
        {...field}
        type={
          controller.type === "number" ? "number" : controller.type || "text"
        }
        placeholder={controller.placeholder}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          controller.type === "checkbox" && "w-4 h-4 rounded",
          field.value && "text-gray-900",
          !field.value && "text-gray-500",
          controller.className
        )}
        onChange={handleChange}
        disabled={controller.disabled === true}
        max={controller.maximun}
      />

      {/* Add icon for specific input types */}
      {controller.type === "password" && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          tabIndex={-1}
          onClick={() => {
            // Toggle password visibility (would need state management)
            const input = document.getElementById(
              field.name
            ) as HTMLInputElement;
            if (input) {
              input.type = input.type === "password" ? "text" : "password";
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      )}

      {controller.type === "email" && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default DefaultInputController;
