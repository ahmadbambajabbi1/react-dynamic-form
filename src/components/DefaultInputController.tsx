// src/components/DefaultInputController.tsx
import React from "react";
import { Controller } from "../types";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { cn } from "../utils";

type DefaultInputControllerProps = {
  controller: Controller;
  field: ControllerRenderProps<any, any>;
  form: UseFormReturn<any, any>;
};

const DefaultInputController: React.FC<DefaultInputControllerProps> = ({
  controller,
  field,
  form,
}) => {
  // Generate a unique ID for the input if not provided
  const id = controller.id || `input-${controller.name}`;

  // Extract field value and ensure it's a primitive type (not an object)
  const value = field.value;
  const displayValue =
    value === null || value === undefined || typeof value === "object"
      ? ""
      : String(value);

  // Handle change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    form.setValue(controller.name || "", newValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="relative">
      <input
        id={id}
        type={controller.type || "text"}
        className={cn(
          "w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black",
          controller.inputClassName,
          form.formState.errors[controller.name || ""] && "border-red-500"
        )}
        placeholder={controller.placeholder}
        disabled={controller.disabled}
        value={displayValue}
        onChange={handleChange}
        {...controller.inputProps}
      />

      {controller.icon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {controller.icon}
        </div>
      )}
    </div>
  );
};

export default DefaultInputController;
