// src/components/SelectController.tsx
import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Controller } from "../types";
import { cn } from "../utils";
import {
  Select,
  SearchableSelect,
  SelectFromApi,
  SearchableSelectFromApi,
  MultiSelect,
  SearchableMultiSelect,
  MultiSelectFromApi,
  SearchableMultiSelectFromApi,
} from "./select";

// Import icons to fix "cannot find XIcon" etc. errors
import { XIcon } from "../icons/XIcon";
import { ChevronDown } from "../icons/ChevronDown";
import { CheckIcon } from "../icons/CheckIcon";
import { Spinner } from "../icons/Spinner";

type SelectControllerProps = {
  controller: Controller;
  field: ControllerRenderProps<any, any>;
  form: UseFormReturn<any, any>;
};

export const SelectController: React.FC<SelectControllerProps> = ({
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
    searchParam,
    minSearchLength,
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

  // Use different components based on apiUrl
  if (apiUrl) {
    if (controller.type === "searchable-select-from-api") {
      return (
        <SearchableSelectFromApi
          label={label}
          placeholder={placeholder}
          apiUrl={apiUrl}
          transformResponse={transformResponse}
          searchParam={searchParam}
          minSearchLength={minSearchLength}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          error={error}
          className={className}
        />
      );
    }

    return (
      <SelectFromApi
        label={label}
        placeholder={placeholder}
        apiUrl={apiUrl}
        transformResponse={transformResponse}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        error={error}
        className={className}
      />
    );
  }

  // Regular select with local options
  return (
    <Select
      label={label}
      placeholder={placeholder}
      options={Array.isArray(options) ? options : []}
      value={value}
      onChange={handleChange}
      required={required}
      disabled={disabled}
      error={error}
      className={className}
    />
  );
};

export default SelectController;
