export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  data?: any;
}

export interface BaseSelectProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  clearable?: boolean;
  loading?: boolean;
  options?: any;
}

export interface SelectControllerProps extends BaseSelectProps {
  options: SelectOption[];
  defaultValue?: string | null;
}

export interface SelectFromApiControllerProps extends BaseSelectProps {
  apiUrl: string;
  params?: Record<string, any>;
  transformResponse?: (data: any) => SelectOption[];
  defaultValue?: string | null;
}

export interface SearchableSelectProps extends SelectControllerProps {
  searchPlaceholder?: string;
  minSearchLength?: number;
  noResultsMessage?: string;
}

export interface SearchableSelectFromApiProps
  extends SelectFromApiControllerProps {
  searchPlaceholder?: string;
  minSearchLength?: number;
  searchParam?: string;
  noResultsMessage?: string;
  debounceMs?: number;
}

export interface MultiSelectProps extends SelectControllerProps {
  maxSelections?: number;
  selectionSummary?: (selected: SelectOption[]) => string;
}

export interface MultiSelectFromApiProps extends SelectFromApiControllerProps {
  maxSelections?: number;
  selectionSummary?: (selected: SelectOption[]) => string;
}

export interface SearchableMultiSelectProps
  extends MultiSelectProps,
    SearchableSelectProps {}

export interface SearchableMultiSelectFromApiProps
  extends MultiSelectFromApiProps,
    SearchableSelectFromApiProps {}

// Hook return types
export interface SelectControllerReturn {
  selectedOption: SelectOption | null;
  options: SelectOption[];
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  selectOption: (option: SelectOption) => void;
  clearSelection: () => void;
  menuProps: {
    ref: React.RefObject<HTMLDivElement>;
    position: "top" | "bottom";
  };
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    ref: React.RefObject<HTMLInputElement>;
  };
}

export interface SearchableSelectControllerReturn
  extends SelectControllerReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredOptions: SelectOption[];
}

export interface SelectFromApiControllerReturn extends SelectControllerReturn {
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface SearchableSelectFromApiControllerReturn
  extends SelectFromApiControllerReturn,
    SearchableSelectControllerReturn {
  loadingResults: boolean;
}

export interface MultiSelectControllerReturn {
  selectedOptions: SelectOption[];
  options: SelectOption[];
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  selectOption: (option: SelectOption) => void;
  removeOption: (option: SelectOption) => void;
  clearAll: () => void;
  isSelected: (option: SelectOption) => boolean;
  menuProps: {
    ref: React.RefObject<HTMLDivElement>;
    position: "top" | "bottom";
  };
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    ref: React.RefObject<HTMLInputElement>;
  };
}

export interface SearchableMultiSelectControllerReturn
  extends MultiSelectControllerReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredOptions: SelectOption[];
}

export interface MultiSelectFromApiControllerReturn
  extends MultiSelectControllerReturn {
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface SearchableMultiSelectFromApiControllerReturn
  extends MultiSelectFromApiControllerReturn,
    SearchableMultiSelectControllerReturn {
  loadingResults: boolean;
}
