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
    showError = false,
    optionsApiOptions,
  } = controller;
  const error = form.formState.errors[name]?.message as string;
  const value = field.value;
  const handleChange = (newValue: any) => {
    if (JSON.stringify(field.value) !== JSON.stringify(newValue)) {
      form.setValue(name, newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

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
          showError={showError}
          className={className}
          optionsApiOptions={optionsApiOptions}
          options={options || []}
          controller={controller}
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
          showError={showError}
          className={className}
          optionsApiOptions={optionsApiOptions}
          options={options || []}
          controller={controller}
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
          showError={showError}
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
          showError={showError}
          className={className}
        />
      );
  }
};

export default SelectController;
