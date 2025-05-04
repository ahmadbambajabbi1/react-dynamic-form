// // src/components/SelectController.tsx
// import React, { useState, useEffect, useRef, useMemo } from "react";
// import {
//   ControllerRenderProps,
//   UseFormReturn,
//   useWatch,
// } from "react-hook-form";
// import { z } from "zod";
// import { FormControllerProps } from "../types";
// import { cn } from "../utils";
// import Axios from "../utils/axiosConfig";

// type SelectControllerProps = {
//   field: ControllerRenderProps<z.TypeOf<any>, any>;
//   controller: FormControllerProps;
//   form: UseFormReturn<z.TypeOf<any>, any, undefined>;
// };

// const SelectController: React.FC<SelectControllerProps> = ({
//   controller,
//   field,
//   form,
// }) => {
//   // State management
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [options, setOptions] = useState<{ label: string; value: string }[]>(
//     controller.options !== "from-api" ? controller.options || [] : []
//   );
//   const [isLoading, setIsLoading] = useState(false);

//   // Refs
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Watch for dependent field changes
//   const dependantValue = useWatch({
//     control: form?.control,
//     name: controller?.optionsApiOptions?.dependingContrllerName || "",
//     defaultValue: null,
//   });

//   // Fetch options from API
//   const fetchOptionsFromApi = async () => {
//     if (!controller.optionsApiOptions?.api) return;

//     setIsLoading(true);
//     try {
//       const params: Record<string, any> = {
//         ...(controller.optionsApiOptions?.options?.params || {}),
//         q: searchQuery, // Add search query
//       };

//       // Add dependency parameter if needed
//       if (
//         controller.optionsApiOptions?.dependingContrllerName &&
//         dependantValue
//       ) {
//         const paramName =
//           controller.optionsApiOptions.dependingContrllerName.replace("Id", "");
//         const capitalizedParam = paramName
//           ? paramName.charAt(0).toUpperCase() + paramName.slice(1)
//           : "";

//         params[`filterBy${capitalizedParam}Id`] = dependantValue;
//       }

//       const res = await Axios.get(controller.optionsApiOptions.api, {
//         ...(controller.optionsApiOptions?.options || {}),
//         params,
//       });

//       // Process response data
//       const resultData = res?.data?.data || [];

//       // Add "All" option if specified
//       if (
//         controller.optionsApiOptions?.includeAll &&
//         (!searchQuery || searchQuery.toLowerCase().includes("all"))
//       ) {
//         resultData.unshift({ value: "all", label: "All" });
//       }

//       setOptions(resultData);
//     } catch (error) {
//       console.error("Error fetching options:", error);
//       setOptions([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch options when dependency or search changes
//   useEffect(() => {
//     if (controller.options === "from-api") {
//       fetchOptionsFromApi();
//     }
//   }, [dependantValue, searchQuery]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//         setSearchQuery("");
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownRef]);

//   // Filtered options based on search query
//   const filteredOptions = useMemo(() => {
//     const query = searchQuery.toLowerCase().trim();
//     return options.filter(
//       (option) =>
//         option.label.toLowerCase().includes(query) ||
//         option.value.toLowerCase().includes(query)
//     );
//   }, [options, searchQuery]);

//   // Handle option selection
//   const handleSelect = (option: { label: string; value: string }) => {
//     form.setValue(controller.name || "", option.value);
//     setIsOpen(false);
//     setSearchQuery("");
//   };

//   // Get selected option label
//   const selectedOption = options.find((option) => option.value === field.value);

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       {/* Dropdown Trigger */}
//       <button
//         type="button"
//         onClick={() => {
//           setIsOpen(!isOpen);
//           setTimeout(() => searchInputRef.current?.focus(), 100);
//         }}
//         className={cn(
//           "w-full text-left px-3 py-2 border rounded-md shadow-sm flex items-center justify-between",
//           !field.value && "text-gray-500",
//           controller.className
//         )}
//       >
//         <span className="truncate">
//           {selectedOption?.label ||
//             controller.placeholder ||
//             "Select an option"}
//         </span>
//         <ChevronIcon isOpen={isOpen} />
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
//           {/* Search Input */}
//           <div className="p-2 sticky top-0 bg-white z-10 border-b">
//             <input
//               ref={searchInputRef}
//               type="text"
//               placeholder="Search options..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full px-2 py-1 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Loading State */}
//           {isLoading && (
//             <div className="p-2 text-center text-gray-500">
//               Loading options...
//             </div>
//           )}

//           {/* Options List */}
//           {!isLoading && filteredOptions.length > 0
//             ? filteredOptions.map((option) => (
//                 <div
//                   key={option.value}
//                   onClick={() => handleSelect(option)}
//                   className={cn(
//                     "px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors",
//                     field.value === option.value
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   )}
//                 >
//                   {option.label}
//                 </div>
//               ))
//             : !isLoading && (
//                 <div className="p-2 text-center text-gray-500">
//                   No options found
//                 </div>
//               )}
//         </div>
//       )}
//     </div>
//   );
// };

// // Chevron Icon Component
// const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     className={cn(
//       "text-gray-400 transition-transform",
//       isOpen ? "rotate-180" : ""
//     )}
//   >
//     <path d="m6 9 6 6 6-6" />
//   </svg>
// );

// export default SelectController;

// SelectController.ts
import BaseSelectController from "./BaseSelectController";
import { SelectOption } from "./BaseSelectController";

export default class SelectController extends BaseSelectController {
  static targets = [...BaseSelectController.targets, "optionsList"];
  static values = {
    ...BaseSelectController.values,
    options: { type: Array, default: [] },
  };

  // Add additional targets
  optionsListTarget?: HTMLElement;
  hasOptionsListTarget!: boolean;

  // Add additional values
  optionsValue!: SelectOption[];

  connect(): void {
    super.connect();
    this.renderOptions();
    this.initializeSelectedValue();
  }

  renderOptions(): void {
    if (!this.hasOptionsListTarget || !this.optionsValue) return;

    this.optionsListTarget.innerHTML = "";

    if (this.optionsValue.length === 0) {
      const noResultsItem = document.createElement("div");
      noResultsItem.classList.add(
        "dropdown-item",
        "text-muted",
        "py-2",
        "px-3"
      );
      noResultsItem.textContent = "No options available";
      this.optionsListTarget.appendChild(noResultsItem);
      return;
    }

    this.optionsValue.forEach((option) => {
      const optionItem = document.createElement("div");
      optionItem.classList.add(
        "dropdown-item",
        "py-2",
        "px-3",
        "cursor-pointer"
      );
      optionItem.dataset.value = option.value;
      optionItem.textContent = option.label;
      optionItem.addEventListener("click", this.selectOption.bind(this));

      // If this option is selected, highlight it
      if (this.selectedOptions.includes(option.value)) {
        optionItem.classList.add("active", "bg-light");
      }

      this.optionsListTarget.appendChild(optionItem);
    });
  }

  initializeSelectedValue(): void {
    if (this.hasHiddenInputTarget && this.hiddenInputTarget.value) {
      const value = this.hiddenInputTarget.value;

      if (this.hasSelectTarget) {
        this.selectTarget.value = value;
      }

      const selectedOption = this.optionsValue.find(
        (option) => option.value === value
      );

      if (selectedOption) {
        this.selectedOptions = [value];

        if (this.hasPlaceholderTarget) {
          this.placeholderTarget.textContent = selectedOption.label;
          this.updatePlaceholder();
        }
      }
    }
  }

  handleChange(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    const selectedValue = selectEl.value;

    if (selectedValue) {
      const selectedOption = this.optionsValue.find(
        (option) => option.value === selectedValue
      );

      if (selectedOption && this.hasPlaceholderTarget) {
        this.placeholderTarget.textContent = selectedOption.label;
      }

      this.selectedOptions = [selectedValue];
    } else {
      this.selectedOptions = [];
      this.updatePlaceholder();
    }

    this.updateHiddenInput(selectedValue);
    this.closeDropdown();
  }

  selectOption(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const value = target.dataset.value || "";
    const label = target.textContent?.trim() || "";

    // Update hidden input and selected state
    this.selectedOptions = [value];
    this.updateHiddenInput(value);

    // Update placeholder
    if (this.hasPlaceholderTarget) {
      this.placeholderTarget.textContent = label;
      this.updatePlaceholder();
    }

    // Update select element if it exists
    if (this.hasSelectTarget) {
      this.selectTarget.value = value;
      // Trigger change event for any listeners
      this.selectTarget.dispatchEvent(new Event("change"));
    }

    // Dispatch custom event
    this.dispatch("change", { detail: { value, label } });

    // Close the dropdown
    this.closeDropdown();
  }
}
