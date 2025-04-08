import { ReactNode, HTMLProps } from "react";
import { z, ZodType } from "zod";
import { UseFormReset, UseFormSetError } from "react-hook-form";
import { AxiosRequestConfig } from "axios";

export type FormControllerTypesProps =
  | "text"
  | "email"
  | "number"
  | "upload"
  | "phone-number"
  | "password"
  | "select"
  | "multi-select"
  | "searchable-select"
  | "textarea"
  | "checkbox"
  | "group-checkbox"
  | "rich-text-editor"
  | "date"
  | "react-node";

export type FormControllerProps = {
  name?: string;
  label?: string;
  type?: FormControllerTypesProps;
  placeholder?: string;
  groupName?: string;
  defaultValue?: any;
  description?: string;
  options?: { label: string; value: string }[] | "from-api";
  visible?: (value: any) => boolean;
  optionsApiOptions?: {
    api: string;
    method: "get" | "post" | "patch" | "put" | "delete";
    dependingContrllerName?: string;
    options?: AxiosRequestConfig<{}> | undefined;
    includeAll?: boolean;
  };
  willNeedControllersNames?: string[];
  emptyIndicator?: ReactNode;
  groupCheckbox?: FormControllerProps[];
  groupControllers?: FormControllerProps[];
  labelProps?: HTMLProps<HTMLLabelElement>;
  className?: string;
  optional?: boolean;
  rows?: number;
  maximun?: number;
  verify?: boolean;
  mode?: "default" | "single" | "multiple" | "range";
  outline?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  id?: string;
  disabled?: ((data: Date) => boolean) | boolean;
  flow?: (data: any) => boolean;
  reactNode?: ReactNode;
  mapControllerType?: "group" | "each";
  mapController?: (
    values: any
  ) => FormControllerProps[] | Promise<FormControllerProps[]>;
  cant?: { both: string[] }[];
  // File upload specific props
  maxFiles?: number;
  acceptedFileTypes?: Record<string, string[]>;
  multiple?: boolean;
};

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
};

export type DynamicFormHanldeSubmitParamType<T extends ZodType<any, any, any>> =
  {
    reset: UseFormReset<any>;
    values: z.infer<T>;
    setError: UseFormSetError<z.TypeOf<T>>;
  };

export type StepsType<T> = {
  stepName?: string;
  stepNameByNumber?: number;
  stepSchema?: T;
  skip?: (value: any) => boolean;
  condition?: (value: any) => string;
  controllers: FormControllerProps[];
};

export type DynamicFormProps<T extends z.ZodType<any, any>> = {
  controllers?: FormControllerProps[];
  steps?: StepsType<T>[];
  stepPreview?: (value: any) => ReactNode;
  formSchema?: T;
  handleSubmit?: (params: DynamicFormHanldeSubmitParamType<T>) => Promise<void>;
  apiOptions?: apiOptionsType;
  tricker?: (props: any) => ReactNode;
  props?: PropsPropsType;
  formtype?: "normal" | "steper";
  submitBtn?: HTMLProps<HTMLButtonElement> & {
    label: string;
  };
  modalComponenet?: (
    data: ModalType,
    setModal: (modal: ModalType) => void
  ) => ReactNode;
};

export type ModalType = {
  open: boolean;
  data: any;
};

// Generic form context type that can be used across components
export type FormContextType = {
  form: any;
  controllers?: FormControllerProps[];
  handleSubmit: (values: any) => void;
  formLoading: boolean;
};

// File upload types
export interface FileWithPreview extends File {
  preview: string;
}

// Other enums and constants
export enum SUCCESSTYPE {
  VERIFIED = "VERIFIED",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}
