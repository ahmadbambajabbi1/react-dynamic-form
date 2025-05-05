// src/components/SelectController.tsx
import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Controller } from "../types";
import { cn } from "../utils";

// Import all select components
import {
  Select,
  SearchableSelect,
  SelectFromApi,
  SearchableSelectFromApi,
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
    className,
    type,
  } = controller;

  const error = form.formState.errors[name]?.message as string;

  // Safely extract value from field
  const value = field.value;

  // Handle change event for select fields with check to prevent infinite loops
  const handleChange = (newValue: any) => {
    // Only update if the value actually changed
    if (JSON.stringify(field.value) !== JSON.stringify(newValue)) {
      form.setValue(name, newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // Determine which Select component to use based on the controller type
  switch (type) {
    case "searchable-select-from-api":
      return (
        <SearchableSelectFromApi
          label={label}
          placeholder={placeholder}
          apiUrl={apiUrl || ""}
          transformResponse={transformResponse}
          searchParam={searchParam}
          minSearchLength={minSearchLength}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          error={error}
          className={className}
          // Handle errors gracefully by providing fallback options
          options={options || []}
        />
      );

    case "select-from-api":
      return (
        <SelectFromApi
          label={label}
          placeholder={placeholder}
          apiUrl={apiUrl || ""}
          transformResponse={transformResponse}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          error={error}
          className={className}
          // Handle errors gracefully by providing fallback options
          options={options || []}
        />
      );

    case "searchable-select":
      return (
        <SearchableSelect
          label={label}
          placeholder={placeholder}
          options={Array.isArray(options) ? options : []}
          minSearchLength={minSearchLength}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          error={error}
          className={className}
        />
      );

    case "select":
    default:
      return (
        <Select
          label={label as string}
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
  }
};

export default SelectController;
