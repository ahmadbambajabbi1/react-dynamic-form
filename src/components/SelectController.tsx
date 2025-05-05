// src/components/dynamic-form/components/SelectController.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
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

// Base props for all select controllers
type BaseSelectControllerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  Component: React.ComponentType<any>;
  [key: string]: any;
};

// Reusable props type for all select controllers
type SelectControllerProps = Omit<BaseSelectControllerProps, "Component">;

// Base controller component
const BaseSelectController: React.FC<BaseSelectControllerProps> = ({
  name,
  label,
  placeholder,
  required,
  disabled,
  helperText,
  Component,
  ...rest
}) => {
  const { formState, watch, setValue } = useFormContext();
  const { errors } = formState;
  const error = errors[name]?.message as string;
  const value = watch(name);

  // Handle onChange for both single and multi select
  const handleChange = (newValue: any) => {
    setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="form-control w-full">
      <Component
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        error={error}
        {...rest}
      />
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

// Individual controllers that pass all props including name to the base controller
export const BasicSelectController: React.FC<SelectControllerProps> = ({
  name,
  ...rest
}) => {
  return <BaseSelectController name={name} {...rest} Component={Select} />;
};

export const SearchableSelectController: React.FC<SelectControllerProps> = ({
  name,
  ...rest
}) => {
  return (
    <BaseSelectController name={name} {...rest} Component={SearchableSelect} />
  );
};

export const SelectFromApiController: React.FC<SelectControllerProps> = ({
  name,
  ...rest
}) => {
  return (
    <BaseSelectController name={name} {...rest} Component={SelectFromApi} />
  );
};

export const SearchableSelectFromApiController: React.FC<
  SelectControllerProps
> = ({ name, ...rest }) => {
  return (
    <BaseSelectController
      name={name}
      {...rest}
      Component={SearchableSelectFromApi}
    />
  );
};

export const MultiSelectController: React.FC<SelectControllerProps> = ({
  name,
  ...rest
}) => {
  return <BaseSelectController name={name} {...rest} Component={MultiSelect} />;
};

export const SearchableMultiSelectController: React.FC<
  SelectControllerProps
> = ({ name, ...rest }) => {
  return (
    <BaseSelectController
      name={name}
      {...rest}
      Component={SearchableMultiSelect}
    />
  );
};

export const MultiSelectFromApiController: React.FC<SelectControllerProps> = ({
  name,
  ...rest
}) => {
  return (
    <BaseSelectController
      name={name}
      {...rest}
      Component={MultiSelectFromApi}
    />
  );
};

export const SearchableMultiSelectFromApiController: React.FC<
  SelectControllerProps
> = ({ name, ...rest }) => {
  return (
    <BaseSelectController
      name={name}
      {...rest}
      Component={SearchableMultiSelectFromApi}
    />
  );
};
