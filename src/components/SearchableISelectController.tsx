// src/components/SearchableISelectController.tsx
import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Controller } from "../types";
import { cn } from "../utils";
import { SearchableSelect, SearchableSelectFromApi } from "./select";

// Import icons
import { XIcon } from "../icons/XIcon";
import { ChevronDown } from "../icons/ChevronDown";
import { CheckIcon } from "../icons/CheckIcon";
import { Spinner } from "../icons/Spinner";

type SearchableSelectControllerProps = {
  controller: Controller;
  field: ControllerRenderProps<any, any>;
  form: UseFormReturn<any, any>;
};

const SearchableSelectController: React.FC<SearchableSelectControllerProps> = ({
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
    className,
  } = controller;

  const error = form.formState.errors[name]?.message as string;

  // Safely extract value from field
  const value = field?.value;

  // Handle change event for select fields
  const handleChange = (newValue: any) => {
    form.setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
  };

  // Use API version if apiUrl is provided
  if (apiUrl) {
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

  // Regular searchable select with local options
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
};

export default SearchableSelectController;
