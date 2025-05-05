// src/components/dynamic-form/components/RadioController.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../utils";

interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

type RadioControllerProps = {
  name: string;
  label?: string;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  layout?: "horizontal" | "vertical";
  [key: string]: any;
};

const RadioController: React.FC<RadioControllerProps> = ({
  name,
  label,
  options,
  required = false,
  disabled = false,
  helperText,
  layout = "vertical",
  ...rest
}) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;
  const error = errors[name]?.message as string;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          "space-y-2",
          layout === "horizontal" && "flex flex-wrap gap-4 space-y-0"
        )}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-center",
              disabled && "opacity-75",
              option.disabled && "opacity-50"
            )}
          >
            <input
              {...register(name)}
              type="radio"
              id={`${name}-${option.value}`}
              value={option.value}
              disabled={disabled || option.disabled}
              className={cn(
                "w-4 h-4 text-blue-600 border-gray-300 focus:ring-black",
                error && "border-red-500"
              )}
              {...rest}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {error ? (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default RadioController;
