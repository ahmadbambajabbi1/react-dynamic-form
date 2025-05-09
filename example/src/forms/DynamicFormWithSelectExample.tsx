// import React, { useState } from "react";
// import { z } from "zod";
// import DynamicForm from "react-dynamic-form-builder";
// // import { Controller, ControllerType } from "../../../src/types";
// import {
//   Controller,
//   ControllerType,
//   DynamicFormProps,
// } from "../../../src/types";

// // Mock API response transformer
// const transformDepartmentsResponse = (data: any) => {
//   // In real usage, this would transform your API data to the format needed by select
//   // For our example, we're simulating the API response directly
//   return data.map((dept: any) => ({
//     value: dept.id,
//     label: dept.name,
//   }));
// };

// // Mock team members transformer
// const transformTeamMembersResponse = (data: any) => {
//   return data.map((user: any) => ({
//     value: user.id,
//     label: `${user.firstName} ${user.lastName}`,
//   }));
// };

// const DynamicFormExample: React.FC = () => {
//   // Define form schema with zod
//   const formSchema = z.object({
//     // Regular fields
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Please enter a valid email address"),

//     // Regular selects
//     country: z.string().min(1, "Please select a country"),
//     region: z.string().optional(),

//     // Multi-selects
//     interests: z
//       .array(z.string())
//       .min(1, "Please select at least one interest"),
//     languages: z.array(z.string()).optional(),

//     // API selects
//     department: z.string().min(1, "Please select a department"),
//     role: z.string().optional(),

//     // API multi-selects
//     teamMembers: z
//       .array(z.string())
//       .min(1, "Please select at least one team member"),
//     projects: z.array(z.string()).optional(),
//   });

//   // State to track submission status
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [formData, setFormData] = useState<any>(null);

//   // Define the controllers for the form
//   const controllers: Controller[] = [
//     // Text inputs
//     {
//       type: ControllerType.TEXT,
//       name: "name",
//       label: "Full Name",
//       placeholder: "Enter your full name",
//       required: true,
//       colSpan: 12,
//     },
//     {
//       type: ControllerType.DATE,
//       name: "date",
//       label: "date",
//       placeholder: "Enter date",
//       mode: "range",
//       required: true,
//       colSpan: 12,
//     },
//     {
//       type: ControllerType.TIME,
//       name: "time",
//       label: "time",
//       placeholder: "Enter time",
//       required: true,
//       colSpan: 12,
//     },
//     {
//       type: ControllerType.EMAIL,
//       name: "email",
//       label: "Email Address",
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
//       colSpan: 6,
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

//     // Searchable Select
//     {
//       type: ControllerType.SEARCHABLE_SELECT,
//       name: "region",
//       label: "Region",
//       placeholder: "Select your region",
//       searchPlaceholder: "Search regions...",
//       colSpan: 6,
//       options: [
//         { value: "northeast", label: "Northeast" },
//         { value: "southeast", label: "Southeast" },
//         { value: "midwest", label: "Midwest" },
//         { value: "southwest", label: "Southwest" },
//         { value: "west", label: "West" },
//         { value: "pacific", label: "Pacific" },
//         { value: "alaska", label: "Alaska" },
//         { value: "hawaii", label: "Hawaii" },
//         { value: "territories", label: "U.S. Territories" },
//       ],
//     },

//     // Multi-Select
//     {
//       type: ControllerType.MULTI_SELECT,
//       name: "interests",
//       label: "Interests",
//       placeholder: "Select your interests",
//       required: true,
//       colSpan: 6,
//       options: [
//         { value: "tech", label: "Technology" },
//         { value: "science", label: "Science" },
//         { value: "art", label: "Art & Design" },
//         { value: "music", label: "Music" },
//         { value: "sports", label: "Sports" },
//         { value: "cooking", label: "Cooking" },
//         { value: "travel", label: "Travel" },
//         { value: "books", label: "Books" },
//         { value: "movies", label: "Movies & TV" },
//         { value: "gaming", label: "Gaming" },
//         { value: "fitness", label: "Fitness" },
//         { value: "nature", label: "Nature & Outdoors" },
//       ],
//     },

//     // Searchable Multi-Select
//     {
//       type: ControllerType.SEARCHABLE_MULTI_SELECT,
//       name: "languages",
//       label: "Languages",
//       placeholder: "Select languages you speak",
//       searchPlaceholder: "Search languages...",
//       colSpan: 6,
//       options: [
//         { value: "en", label: "English" },
//         { value: "es", label: "Spanish" },
//         { value: "fr", label: "French" },
//         { value: "de", label: "German" },
//         { value: "it", label: "Italian" },
//         { value: "pt", label: "Portuguese" },
//         { value: "ru", label: "Russian" },
//         { value: "zh", label: "Chinese (Mandarin)" },
//         { value: "ja", label: "Japanese" },
//         { value: "ar", label: "Arabic" },
//         { value: "hi", label: "Hindi" },
//         { value: "bn", label: "Bengali" },
//         { value: "ko", label: "Korean" },
//         { value: "tr", label: "Turkish" },
//         { value: "vi", label: "Vietnamese" },
//       ],
//     },

//     // API-based Select
//     {
//       type: ControllerType.SELECT_FROM_API,
//       name: "department",
//       label: "Department",
//       placeholder: "Select department",
//       required: true,
//       colSpan: 6,
//       apiUrl: "http://localhost:1993/test/see/s",
//       optionsApiOptions: {
//         // dependingContrllerName: "country",
//         params: {
//           // includeInactive: false,
//           // paramName: "countryId",
//           sortBy: "name",
//         },
//         includeAll: true,
//       },
//       options: [
//         { value: "eng", label: "Engineering" },
//         { value: "des", label: "Design" },
//         { value: "prod", label: "Product" },
//         { value: "mktg", label: "Marketing" },
//         { value: "sales", label: "Sales" },
//         { value: "hr", label: "Human Resources" },
//         { value: "fin", label: "Finance" },
//         { value: "legal", label: "Legal" },
//       ],
//     },

//     // Searchable API-based Select
//     {
//       type: "",
//       name: "role",
//       label: "Role",
//       placeholder: "Select role",
//       searchPlaceholder: "Search roles...",
//       colSpan: 6,
//       apiUrl: "http://localhost:1993/test/see",
//       // transformResponse: (data) =>
//       //   data.map((role: any) => ({
//       //     value: role.id,
//       //     label: role.title,
//       //   })),
//       searchParam: "query",
//       minSearchLength: 2,
//       // Mock data for demo
//       // options: [],
//     },

//     // API-based Multi-Select
//     {
//       type: ControllerType.MULTI_SELECT_FROM_API,
//       name: "teamMembers",
//       label: "Team Members",
//       placeholder: "Select team members",
//       required: true,
//       colSpan: 6,
//       apiUrl: "http://localhost:1993/test/see/d",
//       optionsApiOptions: {
//         dependingContrllerName: "role",
//         params: {
//           // includeInactive: false,
//           // paramName: "countryId",
//           sortByssss: "name",
//         },
//         includeAll: true,
//       },
//     },

//     // Searchable API-based Multi-Select
//     {
//       type: ControllerType.SEARCHABLE_MULTI_SELECT_FROM_API,
//       name: "projects",
//       label: "Projects",
//       placeholder: "Select projects",
//       searchPlaceholder: "Search projects...",
//       colSpan: 6,
//       apiUrl: "http://localhost:1993/test/see",
//       // transformResponse: (data) =>
//       //   data.map((project: any) => ({
//       //     value: project.id,
//       //     label: project.name,
//       //   })),
//       searchParam: "name",
//       minSearchLength: 2,
//       // Mock data for demo
//       options: [
//         { value: "proj1", label: "Website Redesign" },
//         { value: "proj2", label: "Mobile App Development" },
//         { value: "proj3", label: "API Integration" },
//         { value: "proj4", label: "Data Migration" },
//         { value: "proj5", label: "CRM Implementation" },
//         { value: "proj6", label: "E-commerce Platform" },
//         { value: "proj7", label: "Internal Tools" },
//         { value: "proj8", label: "Analytics Dashboard" },
//       ],
//     },
//   ];

//   // Handle form submission
//   const handleSubmit = async ({
//     values,
//     setError,
//     reset,
//   }: {
//     values: z.infer<typeof formSchema>;
//     setError: any;
//     reset: () => void;
//   }) => {
//     try {
//       console.log("Form submitted with values:", values);

//       // In a real app, you would submit to your API here
//       // For this example, we'll just simulate a successful submission after a delay
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Show success message
//       setIsSubmitted(true);
//       setFormData(values);

//       // Reset form
//       reset();
//     } catch (error) {
//       console.error("Error submitting form:", error);

//       // Handle errors
//       setError("root", {
//         type: "manual",
//         message: "There was a problem submitting your form. Please try again.",
//       });
//     }
//   };

//   // Render the form or success message
//   return (
//     <div className="container mx-auto p-6 max-w-4xl">
//       <h1 className="text-2xl font-bold mb-6">
//         Dynamic Form with Select Controls
//       </h1>

//       {isSubmitted ? (
//         <div className="bg-green-50 border border-green-200 rounded-md p-6 mb-6">
//           <h2 className="text-lg font-semibold text-green-800 mb-2">
//             Form Submitted Successfully
//           </h2>
//           <p className="text-green-700 mb-4">
//             Thank you for your submission. Here's what we received:
//           </p>

//           <pre className="bg-white p-4 rounded-md border overflow-auto max-h-80 text-sm">
//             {JSON.stringify(formData, null, 2)}
//           </pre>

//           <button
//             className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//             onClick={() => setIsSubmitted(false)}
//           >
//             Submit Another Response
//           </button>
//         </div>
//       ) : (
//         <DynamicForm
//           controllers={controllers}
//           formSchema={formSchema}
//           handleSubmit={handleSubmit}
//           props={{
//             form: {
//               className: "space-y-6",
//             },
//             grid: {
//               className: "grid-cols-12 gap-6",
//             },
//             controller: {
//               className: "mb-1",
//             },
//           }}
//           submitBtn={{
//             label: "Submit Form",
//             className: "w-full bg-black hover:bg-black text-white",
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default DynamicFormExample;

import React, { useState } from "react";
import { z } from "zod";
import DynamicForm from "react-dynamic-form-builder";
import { Controller, ControllerType } from "../../../src/types";

// Modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Form Modal</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const DynamicFormExample = () => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to track submission status
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);

  // Define form schema with zod
  const formSchema = z.object({
    // Regular fields
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),

    // Regular selects
    country: z.string().min(1, "Please select a country"),
    region: z.string().optional(),

    // Multi-selects
    interests: z
      .array(z.string())
      .min(1, "Please select at least one interest"),
    languages: z.array(z.string()).optional(),

    // API selects
    department: z.string().min(1, "Please select a department"),
    role: z.string().optional(),

    // API multi-selects
    teamMembers: z
      .array(z.string())
      .min(1, "Please select at least one team member"),
    projects: z.array(z.string()).optional(),
  });

  // Define the controllers for the form
  const controllers = [
    // Text inputs
    {
      type: ControllerType.TEXT,
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      colSpan: 12,
    },
    {
      type: ControllerType.DATE,
      name: "date",
      label: "Date",
      placeholder: "Enter date",
      mode: "range",
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
      colSpan: 6,
      options: [
        { value: "us", label: "United States" },
        { value: "ca", label: "Canada" },
        { value: "mx", label: "Mexico" },
        { value: "uk", label: "United Kingdom" },
        { value: "fr", label: "France" },
        { value: "de", label: "Germany" },
        { value: "jp", label: "Japan" },
        { value: "au", label: "Australia" },
        { value: "br", label: "Brazil" },
        { value: "in", label: "India" },
      ],
    },

    // Searchable Select
    {
      type: ControllerType.SEARCHABLE_SELECT,
      name: "region",
      label: "Region",
      placeholder: "Select your region",
      searchPlaceholder: "Search regions...",
      colSpan: 6,
      options: [
        { value: "northeast", label: "Northeast" },
        { value: "southeast", label: "Southeast" },
        { value: "midwest", label: "Midwest" },
        { value: "southwest", label: "Southwest" },
        { value: "west", label: "West" },
        { value: "pacific", label: "Pacific" },
        { value: "alaska", label: "Alaska" },
        { value: "hawaii", label: "Hawaii" },
        { value: "territories", label: "U.S. Territories" },
      ],
    },

    // Multi-Select
    {
      type: ControllerType.MULTI_SELECT,
      name: "interests",
      label: "Interests",
      placeholder: "Select your interests",
      required: true,
      colSpan: 6,
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

    // Searchable Multi-Select
    {
      type: ControllerType.SEARCHABLE_MULTI_SELECT,
      name: "languages",
      label: "Languages",
      placeholder: "Select languages you speak",
      searchPlaceholder: "Search languages...",
      colSpan: 6,
      options: [
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
        { value: "it", label: "Italian" },
        { value: "pt", label: "Portuguese" },
        { value: "ru", label: "Russian" },
        { value: "zh", label: "Chinese (Mandarin)" },
        { value: "ja", label: "Japanese" },
        { value: "ar", label: "Arabic" },
        { value: "hi", label: "Hindi" },
        { value: "bn", label: "Bengali" },
        { value: "ko", label: "Korean" },
        { value: "tr", label: "Turkish" },
        { value: "vi", label: "Vietnamese" },
      ],
    },

    // API-based Select with fallback options
    {
      type: ControllerType.SELECT_FROM_API,
      name: "department",
      label: "Department",
      placeholder: "Select department",
      required: true,
      colSpan: 6,
      apiUrl: "http://localhost:1993/test/see/s",
      optionsApiOptions: {
        params: {
          sortBy: "name",
        },
        includeAll: true,
      },
      options: [
        { value: "eng", label: "Engineering" },
        { value: "des", label: "Design" },
        { value: "prod", label: "Product" },
        { value: "mktg", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "hr", label: "Human Resources" },
        { value: "fin", label: "Finance" },
        { value: "legal", label: "Legal" },
      ],
    },

    // Searchable API-based Select
    {
      type: ControllerType.SEARCHABLE_SELECT_FROM_API,
      name: "role",
      label: "Role",
      placeholder: "Select role",
      searchPlaceholder: "Search roles...",
      colSpan: 6,
      apiUrl: "http://localhost:1993/test/see",
      searchParam: "query",
      minSearchLength: 2,
      options: [
        { value: "dev", label: "Developer" },
        { value: "designer", label: "Designer" },
        { value: "pm", label: "Product Manager" },
        { value: "mgr", label: "Manager" },
      ],
    },

    // API-based Multi-Select
    {
      type: "",
      name: "teamMembers",
      label: "Team Members",
      placeholder: "Select team members",
      required: true,
      colSpan: 6,
      apiUrl: "http://localhost:1993/test/see/d",
      optionsApiOptions: {
        dependingContrllerName: "role",
        includeAll: true,
      },
      options: [
        { value: "user1", label: "John Doe" },
        { value: "user2", label: "Jane Smith" },
        { value: "user3", label: "Alex Johnson" },
        { value: "user4", label: "Taylor Wilson" },
      ],
    },

    // Searchable API-based Multi-Select
    {
      type: ControllerType.SEARCHABLE_MULTI_SELECT_FROM_API,
      name: "projects",
      label: "Projects",
      placeholder: "Select projects",
      searchPlaceholder: "Search projects...",
      colSpan: 6,
      apiUrl: "http://localhost:1993/test/see",
      searchParam: "name",
      minSearchLength: 2,
      options: [
        { value: "proj1", label: "Website Redesign" },
        { value: "proj2", label: "Mobile App Development" },
        { value: "proj3", label: "API Integration" },
        { value: "proj4", label: "Data Migration" },
        { value: "proj5", label: "CRM Implementation" },
        { value: "proj6", label: "E-commerce Platform" },
        { value: "proj7", label: "Internal Tools" },
        { value: "proj8", label: "Analytics Dashboard" },
      ],
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values, setError, reset }) => {
    try {
      console.log("Form submitted with values:", values);

      // In a real app, you would submit to your API here
      // For this example, we'll just simulate a successful submission after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setIsSubmitted(true);
      setFormData(values);
      setIsModalOpen(false);

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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dynamic Form Modal Example</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Open Form
        </button>
      </div>

      {isSubmitted && (
        <div className="bg-green-50 border border-green-200 rounded-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            Form Submitted Successfully
          </h2>
          <p className="text-green-700 mb-4">
            Thank you for your submission. Here's what we received:
          </p>

          <pre className="bg-white p-4 rounded-md border overflow-auto max-h-80 text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>

          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => {
              setIsModalOpen(true);
              setIsSubmitted(false);
            }}
          >
            Submit Another Response
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DynamicForm
          controllers={controllers}
          // formSchema={formSchema}
          // handleSubmit={handleSubmit}
          props={{
            form: {
              className: "space-y-6",
            },
            grid: {
              className: "grid-cols-12 gap-6",
            },
            controller: {
              className: "mb-1",
            },
          }}
          submitBtn={{
            label: "Submit Form",
            className: "w-full bg-black hover:bg-black text-white",
          }}
          apiOptions={{
            api: "/post/see",
            method: "POST",
            onFinish(data) {
              console.log({ data });
            },
            errorHandler(data, type) {
              console.log({ data, type });
            },
          }}
        />
      </Modal>
    </div>
  );
};

export default DynamicFormExample;
