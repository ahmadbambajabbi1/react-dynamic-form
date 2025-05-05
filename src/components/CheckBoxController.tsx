// src/components/CheckBoxController.tsx
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../utils";

type CheckBoxItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
};

type CheckBoxControllerProps = {
  name: string;
  label?: string;
  items?: CheckBoxItemProps[];
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  defaultValue?: boolean | string[];
  baseClassName?: string;
  checkBoxController?: any;
  [key: string]: any;
};

/**
 * CheckBoxController - Handles single and group checkbox inputs
 */
const CheckBoxController: React.FC<CheckBoxControllerProps> = ({
  name,
  label,
  items,
  required = false,
  disabled = false,
  helperText,
  defaultValue,
  baseClassName,
  checkBoxController,
  ...rest
}) => {
  // Fix: Check if we're in a form context
  const formContextResult = useFormContext();
  const [isChecked, setIsChecked] = useState<boolean>(Boolean(defaultValue));
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : []
  );

  // Determine if it's a single checkbox or group
  const isSingle = !items || items.length === 0;

  // If no form context, render with default props
  if (!formContextResult) {
    console.warn(
      `FormContext not found for field ${name}. Rendering with default props.`
    );

    // For single checkbox
    if (isSingle) {
      return (
        <div className="form-control w-full">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={disabled}
              className={cn(
                "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              {...rest}
            />
            {label && (
              <label
                htmlFor={name}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
          </div>
          {helperText && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      );
    }

    // For checkbox group
    return (
      <div className="form-control w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={cn("space-y-2", baseClassName)}>
          {items?.map((item) => (
            <div
              key={item.value}
              className={cn(
                "flex items-center",
                disabled && "opacity-75",
                item.disabled && "opacity-50"
              )}
            >
              <input
                type="checkbox"
                id={`${name}-${item.value}`}
                name={name}
                value={item.value}
                checked={selectedValues.includes(item.value)}
                onChange={(e) => {
                  const newSelected = e.target.checked
                    ? [...selectedValues, item.value]
                    : selectedValues.filter((v) => v !== item.value);
                  setSelectedValues(newSelected);
                }}
                disabled={disabled || item.disabled}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                {...rest}
              />
              <label
                htmlFor={`${name}-${item.value}`}
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>

        {helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }

  // With form context
  const { register, setValue, watch, formState } = formContextResult;
  const { errors } = formState;
  const error = errors[name]?.message as string;
  const value = watch(name);

  useEffect(() => {
    // For single checkbox, set initial value if available
    if (isSingle && defaultValue !== undefined) {
      setValue(name, Boolean(defaultValue), { shouldValidate: true });
    }

    // For checkbox group, set initial values if available
    if (!isSingle && Array.isArray(defaultValue) && defaultValue.length > 0) {
      setValue(name, defaultValue, { shouldValidate: true });
    }
  }, [isSingle, defaultValue, name, setValue]);

  // For single checkbox
  if (isSingle) {
    return (
      <div className="form-control w-full">
        <div className="flex items-center space-x-2">
          <input
            {...register(name)}
            type="checkbox"
            id={name}
            disabled={disabled}
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
              disabled && "opacity-50 cursor-not-allowed",
              error && "border-red-500"
            )}
            {...rest}
          />
          {label && (
            <label
              htmlFor={name}
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }

  // For checkbox group
  return (
    <div className="form-control w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={cn("space-y-2", baseClassName)}>
        {items?.map((item) => {
          const itemId = `${name}-${item.value}`;
          const isItemSelected =
            Array.isArray(value) && value.includes(item.value);

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center",
                disabled && "opacity-75",
                item.disabled && "opacity-50"
              )}
            >
              <input
                id={itemId}
                type="checkbox"
                value={item.value}
                checked={isItemSelected}
                onChange={(e) => {
                  const currentValues = Array.isArray(value) ? value : [];
                  const newValues = e.target.checked
                    ? [...currentValues, item.value]
                    : currentValues.filter((v) => v !== item.value);

                  setValue(name, newValues, { shouldValidate: true });
                }}
                disabled={disabled || item.disabled}
                className={cn(
                  "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                  error && "border-red-500"
                )}
                {...rest}
              />
              <label
                htmlFor={itemId}
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          );
        })}
      </div>

      {error ? (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default CheckBoxController;
