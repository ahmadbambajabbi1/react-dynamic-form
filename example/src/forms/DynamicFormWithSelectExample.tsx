// // src/examples/DynamicFormWithSelectExample.tsx
// import React from "react";
// import { z } from "zod";
// import DynamicForm from "../../../src/DynamicForm";
import DynamicForm from "react-dynamic-form-builder";
import { Controller, ControllerType } from "../../../src/types";

// export const DynamicFormWithSelectExample: React.FC = () => {
//   // Define form schema with Zod
//   const formSchema = z.object({
//     firstName: z.string().min(2, "First name must be at least 2 characters"),
//     lastName: z.string().min(2, "Last name must be at least 2 characters"),
//     email: z.string().email("Please enter a valid email address"),
//     country: z.string().min(1, "Please select a country"),
//     interests: z
//       .array(z.string())
//       .min(1, "Please select at least one interest"),
//     programmingLanguages: z.array(z.string()).optional(),
//     department: z.string().min(1, "Please select a department"),
//     team: z.string().min(1, "Please select a team"),
//   });

//   // Define controllers
//   const controllers: Controller[] = [
//     {
//       type: ControllerType.TEXT,
//       name: "firstName",
//       label: "First Name",
//       placeholder: "Enter your first name",
//       required: true,
//       colSpan: 6,
//     },
//     {
//       type: ControllerType.TEXT,
//       name: "lastName",
//       label: "Last Name",
//       placeholder: "Enter your last name",
//       required: true,
//       colSpan: 6,
//     },
//     {
//       type: ControllerType.EMAIL,
//       name: "email",
//       label: "Email",
//       placeholder: "Enter your email address",
//       required: true,
//       colSpan: 12,
//     },
//     {
//       type: ControllerType.SELECT,
//       name: "country",
//       label: "Country",
//       placeholder: "Select your country",
//       required: true,
//       colSpan: 12,
//       options: [
//         { value: "us", label: "United States" },
//         { value: "ca", label: "Canada" },
//         { value: "mx", label: "Mexico" },
//         { value: "uk", label: "United Kingdom" },
//         { value: "fr", label: "France" },
//         { value: "de", label: "Germany" },
//         { value: "jp", label: "Japan" },
//         { value: "au", label: "Australia" },
//         { value: "br", label: "Brazil" },
//         { value: "in", label: "India" },
//       ],
//     },
//     {
//       type: ControllerType.SEARCHABLE_MULTI_SELECT,
//       name: "interests",
//       label: "Interests",
//       placeholder: "Select your interests",
//       searchPlaceholder: "Search interests...",
//       required: true,
//       colSpan: 12,
//       options: [
//         { value: "music", label: "Music" },
//         { value: "sports", label: "Sports" },
//         { value: "reading", label: "Reading" },
//         { value: "cooking", label: "Cooking" },
//         { value: "travel", label: "Travel" },
//         { value: "art", label: "Art" },
//         { value: "photography", label: "Photography" },
//         { value: "gaming", label: "Gaming" },
//         { value: "dancing", label: "Dancing" },
//         { value: "gardening", label: "Gardening" },
//         { value: "hiking", label: "Hiking" },
//         { value: "movies", label: "Movies & TV Shows" },
//         { value: "technology", label: "Technology" },
//         { value: "fashion", label: "Fashion" },
//         { value: "writing", label: "Writing" },
//       ],
//     },
//     {
//       type: ControllerType.MULTI_SELECT_FROM_API,
//       name: "programmingLanguages",
//       label: "Programming Languages",
//       placeholder: "Select programming languages",
//       apiUrl: "https://api.example.com/programming-languages",
//       transformResponse: (data) =>
//         data.map((lang: any) => ({
//           value: lang.id,
//           label: lang.name,
//         })),
//       colSpan: 12,
//     },
//     {
//       type: ControllerType.SELECT_FROM_API,
//       name: "department",
//       label: "Department",
//       placeholder: "Select department",
//       required: true,
//       apiUrl: "https://api.example.com/departments",
//       transformResponse: (data) =>
//         data.map((dept: any) => ({
//           value: dept.id,
//           label: dept.name,
//         })),
//       colSpan: 6,
//     },
//     {
//       type: ControllerType.SEARCHABLE_SELECT_FROM_API,
//       name: "team",
//       label: "Team",
//       placeholder: "Select team",
//       searchPlaceholder: "Search teams...",
//       required: true,
//       apiUrl: "https://api.example.com/teams",
//       transformResponse: (data) =>
//         data.map((team: any) => ({
//           value: team.id,
//           label: team.name,
//         })),
//       searchParam: "query",
//       minSearchLength: 2,
//       colSpan: 6,
//     },
//   ];

//   // Form submission handler
//   const handleFormSubmit = async ({
//     values,
//     setError,
//     reset,
//   }: {
//     values: z.infer<typeof formSchema>;
//     setError: any;
//     reset: () => void;
//   }) => {
//     console.log("Form submitted with values:", values);
//     // In a real application, you would submit to an API here
//     // For this example, we'll just show the values in the console
//     // and simulate a successful submission
//     alert("Form submitted successfully!");
//     reset();
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">User Profile Form</h1>
//       <DynamicForm
//         controllers={controllers}
//         formSchema={formSchema}
//         handleSubmit={handleFormSubmit}
//         props={{
//           form: {
//             className: "space-y-6",
//           },
//           grid: {
//             className: "grid-cols-12 gap-6",
//           },
//           controller: {
//             className: "mb-1",
//           },
//         }}
//         submitBtn={{
//           label: "Save Profile",
//           className: "w-full bg-blue-600 hover:bg-blue-700",
//         }}
//       />
//     </div>
//   );
// };

// export default DynamicFormWithSelectExample;

// src/examples/DynamicFormExample.tsx
import React from "react";
import { z } from "zod";
// import DynamicForm from '../DynamicForm';
// import { Controller, ControllerType } from '../types';

const DynamicFormExample: React.FC = () => {
  // Define form schema with zod
  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    country: z.string().min(1, "Please select a country"),
    interests: z
      .array(z.string())
      .min(1, "Please select at least one interest"),
    department: z.string().optional(),
    teamMembers: z.array(z.string()).optional(),
  });

  // Define the controllers for the form
  const controllers = [
    {
      type: ControllerType.TEXT,
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      colSpan: 12,
    },
    {
      type: ControllerType.EMAIL,
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      required: true,
      colSpan: 12,
    },
    {
      type: ControllerType.SELECT,
      name: "country",
      label: "Country",
      placeholder: "Select your country",
      required: true,
      colSpan: 12,
      options: [
        { value: "us", label: "United States" },
        { value: "ca", label: "Canada" },
        { value: "mx", label: "Mexico" },
        { value: "uk", label: "United Kingdom" },
        { value: "fr", label: "France" },
        { value: "de", label: "Germany" },
        { value: "jp", label: "Japan" },
      ],
    },
    {
      type: ControllerType.SEARCHABLE_MULTI_SELECT,
      name: "interests",
      label: "Interests",
      placeholder: "Select your interests",
      searchPlaceholder: "Search interests...",
      required: true,
      colSpan: 12,
      options: [
        { value: "tech", label: "Technology" },
        { value: "science", label: "Science" },
        { value: "art", label: "Art & Design" },
        { value: "music", label: "Music" },
        { value: "sports", label: "Sports" },
        { value: "cooking", label: "Cooking" },
        { value: "travel", label: "Travel" },
        { value: "books", label: "Books" },
        { value: "movies", label: "Movies & TV" },
        { value: "gaming", label: "Gaming" },
        { value: "fitness", label: "Fitness" },
        { value: "nature", label: "Nature & Outdoors" },
      ],
    },
    {
      type: ControllerType.SELECT_FROM_API,
      name: "department",
      label: "Department",
      placeholder: "Select department",
      colSpan: 6,
      apiUrl: "https://api.example.com/departments",
      transformResponse: (data: any) =>
        data.map((dept: any) => ({
          value: dept.id,
          label: dept.name,
        })),
    },
    {
      type: ControllerType.SEARCHABLE_MULTI_SELECT_FROM_API,
      name: "teamMembers",
      label: "Team Members",
      placeholder: "Select team members",
      searchPlaceholder: "Search members...",
      colSpan: 6,
      apiUrl: "https://api.example.com/users",
      transformResponse: (data) =>
        data.map((user: any) => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
        })),
      searchParam: "query",
      minSearchLength: 2,
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values, setError, reset }: any) => {
    try {
      console.log("Form submitted with values:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      alert("Form submitted successfully!");

      // Reset form
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle errors
      setError("root", {
        type: "manual",
        message: "There was a problem submitting your form. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">User Profile Form</h1>

      <DynamicForm
        controllers={controllers}
        formSchema={formSchema}
        handleSubmit={handleSubmit}
        props={{
          form: {
            className: "space-y-6",
          },
          grid: {
            className: "gap-6",
          },
          controller: {
            className: "mb-1",
          },
        }}
        submitBtn={{
          label: "Save Profile",
          className: "w-full bg-blue-600 hover:bg-blue-700",
        }}
      />
    </div>
  );
};

export default DynamicFormExample;

/*
when multi select is click to select the compoent keep rerending fast and the app crash. please update that.
MultiSelectController.tsx:46 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
overrideMethod @ hook.js:608
printWarning @ chunk-NUMECXU6.js?v=e91faa4f:521
error @ chunk-NUMECXU6.js?v=e91faa4f:505
checkForNestedUpdates @ chunk-NUMECXU6.js?v=e91faa4f:19665
scheduleUpdateOnFiber @ chunk-NUMECXU6.js?v=e91faa4f:18533
dispatchSetState @ chunk-NUMECXU6.js?v=e91faa4f:12403
callback @ chunk-Q3AWV5S2.js?v=e91faa4f:1938
next @ chunk-Q3AWV5S2.js?v=e91faa4f:1305
next @ chunk-Q3AWV5S2.js?v=e91faa4f:396
trigger @ chunk-Q3AWV5S2.js?v=e91faa4f:1256
await in trigger
setFieldValue @ chunk-Q3AWV5S2.js?v=e91faa4f:1124
setValue @ chunk-Q3AWV5S2.js?v=e91faa4f:1152
handleChange @ MultiSelectController.tsx:46
(anonymous) @ useMultiSelectController.ts:138
commitHookEffectListMount @ chunk-NUMECXU6.js?v=e91faa4f:16915
commitPassiveMountOnFiber @ chunk-NUMECXU6.js?v=e91faa4f:18156
commitPassiveMountEffects_complete @ chunk-NUMECXU6.js?v=e91faa4f:18129
commitPassiveMountEffects_begin @ chunk-NUMECXU6.js?v=e91faa4f:18119
commitPassiveMountEffects @ chunk-NUMECXU6.js?v=e91faa4f:18109
flushPassiveEffectsImpl @ chunk-NUMECXU6.js?v=e91faa4f:19490
flushPassiveEffects @ chunk-NUMECXU6.js?v=e91faa4f:19447
commitRootImpl @ chunk-NUMECXU6.js?v=e91faa4f:19416
commitRoot @ chunk-NUMECXU6.js?v=e91faa4f:19277
performSyncWorkOnRoot @ chunk-NUMECXU6.js?v=e91faa4f:18895
flushSyncCallbacks @ chunk-NUMECXU6.js?v=e91faa4f:9119
(anonymous) @ chunk-NUMECXU6.js?v=e91faa4f:18627Understand this error
9[Violation] 'click' handler took <N>ms
141MultiSelectController.tsx:46 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
*/
