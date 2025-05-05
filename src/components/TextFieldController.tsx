// src/components/TextFieldController.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../utils";

type TextFieldControllerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  readOnly?: boolean;
  [key: string]: any;
};

const TextFieldController: React.FC<TextFieldControllerProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  helperText,
  min,
  max,
  step,
  pattern,
  autoComplete,
  readOnly,
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
        <input
          name={name}
          className={cn(
            "w-full px-3 py-2 border rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "border-gray-300 focus:border-blue-500",
            disabled && "bg-gray-100 cursor-not-allowed opacity-75"
          )}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          autoComplete={autoComplete}
          readOnly={readOnly}
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
      <input
        {...register(name)}
        className={cn(
          "w-full px-3 py-2 border rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500",
          disabled && "bg-gray-100 cursor-not-allowed opacity-75"
        )}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        autoComplete={autoComplete}
        readOnly={readOnly}
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

export default TextFieldController;
