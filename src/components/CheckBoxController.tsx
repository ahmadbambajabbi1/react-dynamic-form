// src/components/CheckBoxController.tsx
import React, { useEffect, useState } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormControllerProps } from "../types";
import { cn } from "../utils";

type CheckBoxItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
};

type CheckBoxControllerProps = {
  items?: CheckBoxItemProps[];
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
  baseClassName?: string;
  checkBoxController: FormControllerProps;
  field?: ControllerRenderProps<z.TypeOf<any>, any>;
};

/**
 * CheckBoxController - Handles single and group checkbox inputs
 */
const CheckBoxController: React.FC<CheckBoxControllerProps> = ({
  items,
  form,
  baseClassName,
  checkBoxController,
  field,
}) => {
  // Initialize default values for checkboxes
  useEffect(() => {
    if (checkBoxController.defaultValue) {
      form.setValue(
        checkBoxController?.name as string,
        checkBoxController.defaultValue
      );
    }
  }, [form, checkBoxController]);

  // Handle single checkbox or checkbox group
  return checkBoxController.type === "checkbox" ? (
    <SingleCheckBoxHandler
      checkBoxController={checkBoxController}
      form={form}
      field={field}
    />
  ) : (
    <div className={cn("space-y-2", baseClassName)}>
      {items &&
        items.map((item) => (
          <div key={item.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${checkBoxController.name}-${item.value}`}
              name={checkBoxController.name}
              value={item.value}
              disabled={item.disabled}
              checked={(field?.value || []).includes(item.value)}
              onChange={(e) => {
                const currentValues = field?.value || [];
                const updatedValues = e.target.checked
                  ? [...currentValues, item.value]
                  : currentValues.filter(
                      (value: string) => value !== item.value
                    );

                form.setValue(
                  checkBoxController.name as string,
                  updatedValues,
                  {
                    shouldValidate: true,
                  }
                );
              }}
              className={cn(
                "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                item.disabled ? "opacity-50 cursor-not-allowed" : "",
                checkBoxController.className
              )}
            />
            <label
              htmlFor={`${checkBoxController.name}-${item.value}`}
              className={cn(
                "text-sm font-medium text-gray-700",
                item.disabled ? "text-gray-400" : ""
              )}
            >
              {item.label}
            </label>
          </div>
        ))}
    </div>
  );
};

/**
 * SingleCheckBoxHandler - Handles a single checkbox with advanced behavior
 */
const SingleCheckBoxHandler: React.FC<CheckBoxControllerProps> = ({
  checkBoxController,
  form,
  field,
}) => {
  // Track indeterminate state
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  // Handle checkbox change with custom logic
  const handleChange = () => {
    // If the checkbox is currently unchecked or in an indeterminate state
    if (!field?.value || isIndeterminate) {
      // Set to checked
      form.setValue(checkBoxController.name as string, true, {
        shouldValidate: true,
      });
      setIsIndeterminate(false);
    } else {
      // If checkbox is checked, set to an indeterminate state
      form.setValue(checkBoxController.name as string, false, {
        shouldValidate: true,
      });
      setIsIndeterminate(false);
    }
  };

  // Ref for checkbox to set indeterminate state
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  // Update indeterminate state visually
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="flex items-center space-x-2">
      <input
        ref={checkboxRef}
        type="checkbox"
        id={checkBoxController.name}
        checked={field?.value || false}
        onChange={handleChange}
        disabled={
          typeof checkBoxController.disabled === "boolean"
            ? checkBoxController.disabled
            : false
        }
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
          checkBoxController.disabled ? "opacity-50 cursor-not-allowed" : "",
          checkBoxController.className
        )}
      />
      <label
        htmlFor={checkBoxController.name}
        className={cn(
          "text-sm font-medium text-gray-700",
          checkBoxController.disabled ? "text-gray-400" : ""
        )}
      >
        {checkBoxController.label}
      </label>
    </div>
  );
};

export default CheckBoxController;
