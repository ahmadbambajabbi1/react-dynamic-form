// src/components/MultiSelectController.tsx
import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Controller } from "../types";
import { cn } from "../utils";
import { MultiSelect, MultiSelectFromApi } from "./select";

// Import icons
import { XIcon } from "../icons/XIcon";
import { ChevronDown } from "../icons/ChevronDown";
import { CheckIcon } from "../icons/CheckIcon";
import { Spinner } from "../icons/Spinner";

type MultiSelectControllerProps = {
  controller: Controller;
  field: ControllerRenderProps<any, any>;
  form: UseFormReturn<any, any>;
};

const MultiSelectController: React.FC<MultiSelectControllerProps> = ({
  controller,
  field,
  form,
}) => {
  // Extract relevant props from controller
  const {
    name = "",
    label,
    placeholder,
    options = [],
    required = false,
    disabled = false,
    apiUrl,
    transformResponse,
    maxSelections,
    className,
  } = controller;

  const error = form.formState.errors[name]?.message as string;

  // Safely extract value from field
  const value = field.value;

  // Handle change event for select fields
  const handleChange = (newValue: any) => {
    form.setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
  };

  // Use API version if apiUrl is provided
  if (apiUrl) {
    return (
      <MultiSelectFromApi
        label={label}
        placeholder={placeholder}
        apiUrl={apiUrl}
        transformResponse={transformResponse}
        maxSelections={maxSelections}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        error={error}
        className={className}
      />
    );
  }

  // Regular multi-select with local options
  return (
    <MultiSelect
      label={label}
      placeholder={placeholder}
      options={Array.isArray(options) ? options : []}
      maxSelections={maxSelections}
      value={value}
      onChange={handleChange}
      required={required}
      disabled={disabled}
      error={error}
      className={className}
    />
  );
};

export default MultiSelectController;
