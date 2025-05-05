// src/components/dynamic-form/components/TimeController.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../utils";

type TimeControllerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  min?: string;
  max?: string;
  step?: number;
  showSeconds?: boolean;
  [key: string]: any;
};

const TimeController: React.FC<TimeControllerProps> = ({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  min,
  max,
  step,
  showSeconds = false,
  ...rest
}) => {
  const { register, formState } = useFormContext();
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
        type="time"
        className={cn(
          "w-full px-3 py-2 border rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-black",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-black",
          disabled && "bg-gray-100 cursor-not-allowed opacity-75"
        )}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={showSeconds ? step || 1 : undefined} // step in seconds, 1 allows for seconds input
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

export default TimeController;
