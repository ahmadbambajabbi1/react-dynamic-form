// src/components/select/types.ts
export interface SelectOption {
  id: string | number;
  label: string;
  [key: string]: any; // For additional properties
}

export interface BaseSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  menuPlacement?: "auto" | "top" | "bottom";
  onChange: (value: any) => void;
}

export interface SingleSelectProps extends BaseSelectProps {
  value: SelectOption | null;
}

export interface MultiSelectProps extends BaseSelectProps {
  value: SelectOption[];
}

export interface SearchableProps {
  searchPlaceholder?: string;
}

export interface ApiProps {
  endpoint: string;
  queryParam?: string;
  transformResponse?: (data: any) => SelectOption[];
}
