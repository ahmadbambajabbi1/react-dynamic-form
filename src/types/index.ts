// import { ReactNode, HTMLProps } from "react";
// import { z, ZodType } from "zod";
// import { UseFormReset, UseFormSetError } from "react-hook-form";
// import { AxiosRequestConfig } from "axios";

// export type FormControllerTypesProps =
//   | "text"
//   | "email"
//   | "number"
//   | "upload"
//   | "phone-number"
//   | "password"
//   | "select"
//   | "multi-select"
//   | "searchable-select"
//   | "textarea"
//   | "checkbox"
//   | "group-checkbox"
//   | "rich-text-editor"
//   | "date"
//   | "react-node";

// export type FormControllerProps = {
//   name?: string;
//   label?: string;
//   type?: FormControllerTypesProps;
//   placeholder?: string;
//   groupName?: string;
//   defaultValue?: any;
//   description?: string;
//   options?: { label: string; value: string }[] | "from-api";
//   visible?: (value: any) => boolean;
//   optionsApiOptions?: {
//     api: string;
//     method: "get" | "post" | "patch" | "put" | "delete";
//     dependingContrllerName?: string;
//     options?: AxiosRequestConfig<{}> | undefined;
//     includeAll?: boolean;
//   };
//   willNeedControllersNames?: string[];
//   emptyIndicator?: ReactNode;
//   groupCheckbox?: FormControllerProps[];
//   groupControllers?: FormControllerProps[];
//   labelProps?: HTMLProps<HTMLLabelElement>;
//   className?: string;
//   optional?: boolean;
//   rows?: number;
//   maximun?: number;
//   verify?: boolean;
//   mode?: "default" | "single" | "multiple" | "range";
//   outline?:
//     | "link"
//     | "default"
//     | "destructive"
//     | "outline"
//     | "secondary"
//     | "ghost";
//   id?: string;
//   disabled?: ((data: Date) => boolean) | boolean;
//   flow?: (data: any) => boolean;
//   reactNode?: ReactNode;
//   mapControllerType?: "group" | "each";
//   mapController?: (
//     values: any
//   ) => FormControllerProps[] | Promise<FormControllerProps[]>;
//   cant?: { both: string[] }[];
//   // File upload specific props
//   maxFiles?: number;
//   acceptedFileTypes?: Record<string, string[]>;
//   multiple?: boolean;
// };

// export type apiOptionsType = {
//   api: string;
//   method: "POST" | "PATCH" | "PUT" | "DELETE" | "GET";
//   options?: AxiosRequestConfig<{}> | undefined;
//   errorHandler?: (data: any, type: errorHandlertType) => void;
//   onFinish?: (data: any) => void;
// };

// export type errorHandlertType = "form" | "modal" | "toast" | "redirect";

// export type PropsPropsType = {
//   form?: JSX.IntrinsicElements["form"] & {
//     ref: React.Ref<HTMLFormElement>;
//   };
//   controllerBase?: JSX.IntrinsicElements["div"] & {
//     ref?: React.Ref<HTMLDivElement>;
//   };
//   groupcontrollerBase?: JSX.IntrinsicElements["div"] & {
//     ref?: React.Ref<HTMLDivElement>;
//   };
//   submitBtn?: JSX.IntrinsicElements["button"];
//   grid?: {
//     className?: string;
//   };
//   controller?: {
//     className?: string;
//   };
// };

// export type DynamicFormHanldeSubmitParamType<T extends ZodType<any, any, any>> =
//   {
//     reset: UseFormReset<any>;
//     values: z.infer<T>;
//     setError: UseFormSetError<z.TypeOf<T>>;
//   };

// export type StepsType<T> = {
//   stepName?: string;
//   stepNameByNumber?: number;
//   stepSchema?: T;
//   skip?: (value: any) => boolean;
//   condition?: (value: any) => string;
//   controllers: Controller[];
// };

// export type DynamicFormProps<T extends z.ZodType<any, any>> = {
//   controllers?: FormControllerProps[];
//   steps?: StepsType<T>[];
//   stepPreview?: (value: any) => ReactNode;
//   formSchema?: T;
//   handleSubmit?: (params: DynamicFormHanldeSubmitParamType<T>) => Promise<void>;
//   apiOptions?: apiOptionsType;
//   tricker?: (props: any) => ReactNode;
//   props?: PropsPropsType;
//   formtype?: "normal" | "steper";
//   submitBtn?: HTMLProps<HTMLButtonElement> & {
//     label: string;
//   };
//   modalComponenet?: (
//     data: ModalType,
//     setModal: (modal: ModalType) => void
//   ) => ReactNode;
// };

// export type ModalType = {
//   open: boolean;
//   data: any;
// };

// // Generic form context type that can be used across components
// export type FormContextType = {
//   form: any;
//   controllers?: FormControllerProps[];
//   handleSubmit: (values: any) => void;
//   formLoading: boolean;
// };

// // Other enums and constants
// export enum SUCCESSTYPE {
//   VERIFIED = "VERIFIED",
//   SUCCESS = "SUCCESS",
//   ERROR = "ERROR",
// }
// src/types/index.ts - Updated Controller interface
import { ReactNode } from "react";
import { z } from "zod";
import { SelectOption } from "../components/select/types";
import { AxiosRequestConfig } from "axios";

// File upload types
export interface FileWithPreview extends File {
  preview: string;
}

export enum SUCCESSTYPE {
  VERIFIED = "verified",
  SUCCESS = "success",
}

export enum ControllerType {
  TEXT = "text",
  EMAIL = "email",
  PASSWORD = "password",
  NUMBER = "number",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SELECT = "select",
  SEARCHABLE_SELECT = "searchable-select",
  SELECT_FROM_API = "select-from-api",
  SEARCHABLE_SELECT_FROM_API = "searchable-select-from-api",
  MULTI_SELECT = "multi-select",
  SEARCHABLE_MULTI_SELECT = "searchable-multi-select",
  MULTI_SELECT_FROM_API = "multi-select-from-api",
  SEARCHABLE_MULTI_SELECT_FROM_API = "searchable-multi-select-from-api",
  DATE = "date",
  TIME = "time",
  DATETIME = "datetime",
  FILE = "file",
}
// export type FormControllerTypesProps =
//   | "text"
//   | "email"
//   | "number"
//   | "password"
//   | "select"
//   | "multi-select"
//   | "searchable-select"
//   | "textarea"
//   | "date"
//   | "checkbox"
// | "group-checkbox"
// | "phone-number"
// | "upload"
// | "rich-text-editor"
// | "react-node";

export type ControllerTypeType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "checkbox"
  | "radio"
  | "select"
  | "searchable-select"
  | "select-from-api"
  | "searchable-select-from-api"
  | "multi-select"
  | "searchable-multi-select"
  | "multi-select-from-api"
  | "searchable-multi-select-from-api"
  | "date"
  | "time"
  | "datetime"
  | "file"
  | "phone"
  | "group-checkbox"
  | "phone-number"
  | "upload"
  | "rich-text-editor"
  | "react-node";

export interface ModalType {
  open: boolean;
  data: any[];
}

// API options for controllers that fetch options from API
export interface OptionsApiOptions {
  api?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  dependingContrllerName?: string;
  parameterName?: string; // Direct parameter name
  params?: Record<string, any>; // Add this line to support params
  includeAll?: boolean;
}
export interface Controller {
  type: ControllerTypeType;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  helperText?: string;
  colSpan?: number;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  options?:
    | SelectOption[]
    | { label: string; value: string | number }[]
    | "from-api";
  apiUrl?: string;
  transformResponse?: (data: any) => SelectOption[];
  searchParam?: string;
  minSearchLength?: number;
  maxSelections?: number;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  rows?: number;
  cols?: number;
  pattern?: string;
  autoComplete?: string;
  readOnly?: boolean;
  renderComponent?: (props: any) => JSX.Element;
  optionsApiOptions?: OptionsApiOptions;
  display?: (formData: Record<string, any>) => boolean;
  visible?: (formData: Record<string, any>) => boolean;
  [key: string]: any;
}

export interface Step {
  title: string;
  description?: string;
  controllers: Controller[];
}

export type apiOptionsType = {
  api: string;
  method: "POST" | "PATCH" | "PUT" | "DELETE" | "GET";
  options?: AxiosRequestConfig<{}> | undefined;
  errorHandler?: (data: any, type: errorHandlertType) => void;
  onFinish?: (data: any) => void;
};

export type errorHandlertType = "form" | "modal" | "toast" | "redirect";

export type PropsPropsType = {
  form?: JSX.IntrinsicElements["form"] & {
    ref: React.Ref<HTMLFormElement>;
  };
  controllerBase?: JSX.IntrinsicElements["div"] & {
    ref?: React.Ref<HTMLDivElement>;
  };
  groupcontrollerBase?: JSX.IntrinsicElements["div"] & {
    ref?: React.Ref<HTMLDivElement>;
  };
  submitBtn?: JSX.IntrinsicElements["button"];
  grid?: {
    className?: string;
  };
  controller?: {
    className?: string;
  };
};

export interface DynamicFormProps<T extends z.ZodType<any, any>> {
  controllers?: Controller[];
  formSchema?: T;
  handleSubmit?: (data: {
    values: z.infer<T>;
    setError: any;
    reset: () => void;
  }) => Promise<void>;
  apiOptions?: apiOptionsType;
  tricker?: (props: {
    submitLoading: boolean;
    isValid: boolean;
  }) => JSX.Element;
  props?: PropsPropsType;
  modalComponenet?: (
    modal: ModalType,
    setModal: (modal: ModalType) => void
  ) => ReactNode;
  steps?: Step[];
  formtype?: "normal" | "steper";
  stepPreview?: boolean;
  submitBtn?: {
    label?: string;
    className?: string;
    type?: string;
    disabled?: boolean;
  };
}

export type StepsType<T> = {
  stepName?: string;
  stepNameByNumber?: number;
  stepSchema?: T;
  skip?: (value: any) => boolean;
  condition?: (value: any) => string;
  controllers: Controller[];
};
