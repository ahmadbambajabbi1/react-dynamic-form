// // src/components/select/SelectWrapper.tsx
// import React, { useEffect } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// // Import all the select components
// // import {
// //   BasicSelectController,
// //   SearchableSelectController,
// //   SelectFromApiController,
// //   SearchableSelectFromApiController,
// //   MultiSelectController,
// //   SearchableMultiSelectController,
// //   MultiSelectFromApiController,
// //   SearchableMultiSelectFromApiController,
// // } from "../select";

// // Schema for validating the form
// const formSchema = z.object({
//   // Add any validation rules for your select fields
//   basicSelect: z.string().optional(),
//   searchableSelect: z.string().optional(),
//   apiSelect: z.string().optional(),
//   searchableApiSelect: z.string().optional(),
//   multiSelect: z.array(z.string()).optional(),
//   searchableMultiSelect: z.array(z.string()).optional(),
//   multiApiSelect: z.array(z.string()).optional(),
//   searchableMultiApiSelect: z.array(z.string()).optional(),
// });

// // Props interface for the wrapper
// interface SelectWrapperProps {
//   // Add props as needed
//   onSubmit?: (data: any) => void;
//   defaultValues?: Record<string, any>;
//   children?: React.ReactNode;
//   className?: string;
// }

// /**
//  * SelectWrapper - A wrapper component that provides FormContext for select components
//  */
// const SelectWrapper: React.FC<SelectWrapperProps> = ({
//   onSubmit,
//   defaultValues = {},
//   children,
//   className = "",
// }) => {
//   // Initialize the form with react-hook-form
//   const methods = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues,
//   });

//   // Handle form submission
//   const handleSubmit = (data: any) => {
//     if (onSubmit) {
//       onSubmit(data);
//     }
//     console.log("Form data:", data);
//   };

//   // Reset the form when defaultValues change
//   useEffect(() => {
//     methods.reset(defaultValues);
//   }, [defaultValues, methods]);

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={methods.handleSubmit(handleSubmit)} className={className}>
//         {children}

//         {/* Submit button or other form controls can be added here */}
//         <div className="mt-4">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </FormProvider>
//   );
// };

// // Export the wrapper and all controller components
// export {
//   SelectWrapper,
//   BasicSelectController,
//   SearchableSelectController,
//   SelectFromApiController,
//   SearchableSelectFromApiController,
//   MultiSelectController,
//   SearchableMultiSelectController,
//   MultiSelectFromApiController,
//   SearchableMultiSelectFromApiController,
// }; /*}

// // Usage example:
// /*
// import { SelectWrapper, BasicSelectController } from './components/select/SelectWrapper';

// const MyForm = () => {
//   return (
//     <SelectWrapper onSubmit={data => console.log(data)}>
//       <BasicSelectController
//         name="country"
//         label="Country"
//         options={[
//           { value: 'us', label: 'United States' },
//           { value: 'ca', label: 'Canada' },
//           // ... more options
//         ]}
//       />
//       {/* Add more select fields as needed */ /*}
//     </SelectWrapper>
//   );
// };
// */
// export default SelectWrapper;
