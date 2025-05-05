import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Controller } from "../types";
import { cn } from "../utils";

// Import all multi-select components
import {
  MultiSelect,
  SearchableMultiSelect,
  MultiSelectFromApi,
  SearchableMultiSelectFromApi,
} from "./select";

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
    searchParam,
    minSearchLength,
    maxSelections,
    className,
    type,
    showError = false, // Default to false since parent will handle errors
    // Added support for dependent controllers
    optionsApiOptions,
  } = controller;

  const error = form.formState.errors[name]?.message as string;

  // Safely extract value from field
  const value = field.value || [];

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

  // Determine which MultiSelect component to use based on the controller type
  switch (type) {
    case "searchable-multi-select-from-api":
      return (
        <SearchableMultiSelectFromApi
          label={label}
          placeholder={placeholder}
          apiUrl={apiUrl || ""}
          transformResponse={transformResponse}
          searchParam={searchParam}
          minSearchLength={minSearchLength}
          maxSelections={maxSelections}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          error={error}
          showError={showError}
          className={className}
          // Pass the optionsApiOptions for dependent controllers
          optionsApiOptions={optionsApiOptions}
          // Handle errors gracefully by providing fallback options
          options={options || []}
          controller={controller}
        />
      );

    case "multi-select-from-api":
      return (
        <MultiSelectFromApi
          label={label}
          placeholder={placeholder}
          apiUrl={apiUrl || ""}
          transformResponse={transformResponse}
          maxSelections={maxSelections}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          error={error}
          showError={showError}
          className={className}
          // Pass the optionsApiOptions for dependent controllers
          optionsApiOptions={optionsApiOptions}
          // Handle errors gracefully by providing fallback options
          options={options || []}
          controller={controller}
        />
      );

    case "searchable-multi-select":
      return (
        <SearchableMultiSelect
          label={label}
          placeholder={placeholder}
          options={Array.isArray(options) ? options : []}
          maxSelections={maxSelections}
          minSearchLength={minSearchLength}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          error={error}
          showError={showError}
          className={className}
        />
      );

    case "multi-select":
    default:
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
          showError={showError}
          className={className}
        />
      );
  }
};

export default MultiSelectController;
