// src/components/TextareaController.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { Controller } from "../types/index";
import { cn } from "../utils";

type TextareaControllerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  rows?: number;
  controller?: Controller;
  [key: string]: any;
};

/**
 * TextareaController - Handles multiline text input
 */
const TextareaController: React.FC<TextareaControllerProps> = ({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  rows = 4,
  controller,
  ...rest
}) => {
  // Fix: Check if we're in a form context
  const formContextResult = useFormContext();

  // If no form context, render with default props
  if (!formContextResult) {
    console.warn(
      `FormContext not found for field ${name}. Rendering with default props.`
    );
    return (
      <div className="form-control w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          name={name}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]",
            controller?.className
          )}
          {...rest}
        />
        {helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }

  // With form context
  const { register, formState } = formContextResult;
  const { errors } = formState;
  const error = errors[name]?.message as string;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500",
          controller?.className
        )}
        {...rest}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default TextareaController;
