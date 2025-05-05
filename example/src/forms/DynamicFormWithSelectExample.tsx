// src/examples/DynamicFormWithSelectExample.tsx
import React from "react";
import { z } from "zod";
// import DynamicForm from "../../../src/DynamicForm";
import DynamicForm from "react-dynamic-form-builder";
import { Controller, ControllerType } from "../../../src/types";

export const DynamicFormWithSelectExample: React.FC = () => {
  // Define form schema with Zod
  const formSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    country: z.string().min(1, "Please select a country"),
    interests: z
      .array(z.string())
      .min(1, "Please select at least one interest"),
    programmingLanguages: z.array(z.string()).optional(),
    department: z.string().min(1, "Please select a department"),
    team: z.string().min(1, "Please select a team"),
  });

  // Define controllers
  const controllers: Controller[] = [
    {
      type: ControllerType.TEXT,
      name: "firstName",
      label: "First Name",
      placeholder: "Enter your first name",
      required: true,
      colSpan: 6,
    },
    {
      type: ControllerType.TEXT,
      name: "lastName",
      label: "Last Name",
      placeholder: "Enter your last name",
      required: true,
      colSpan: 6,
    },
    {
      type: ControllerType.EMAIL,
      name: "email",
      label: "Email",
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
        { value: "au", label: "Australia" },
        { value: "br", label: "Brazil" },
        { value: "in", label: "India" },
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
        { value: "music", label: "Music" },
        { value: "sports", label: "Sports" },
        { value: "reading", label: "Reading" },
        { value: "cooking", label: "Cooking" },
        { value: "travel", label: "Travel" },
        { value: "art", label: "Art" },
        { value: "photography", label: "Photography" },
        { value: "gaming", label: "Gaming" },
        { value: "dancing", label: "Dancing" },
        { value: "gardening", label: "Gardening" },
        { value: "hiking", label: "Hiking" },
        { value: "movies", label: "Movies & TV Shows" },
        { value: "technology", label: "Technology" },
        { value: "fashion", label: "Fashion" },
        { value: "writing", label: "Writing" },
      ],
    },
    {
      type: ControllerType.MULTI_SELECT_FROM_API,
      name: "programmingLanguages",
      label: "Programming Languages",
      placeholder: "Select programming languages",
      apiUrl: "https://api.example.com/programming-languages",
      transformResponse: (data) =>
        data.map((lang: any) => ({
          value: lang.id,
          label: lang.name,
        })),
      colSpan: 12,
    },
    {
      type: ControllerType.SELECT_FROM_API,
      name: "department",
      label: "Department",
      placeholder: "Select department",
      required: true,
      apiUrl: "https://api.example.com/departments",
      transformResponse: (data) =>
        data.map((dept: any) => ({
          value: dept.id,
          label: dept.name,
        })),
      colSpan: 6,
    },
    {
      type: ControllerType.SEARCHABLE_SELECT_FROM_API,
      name: "team",
      label: "Team",
      placeholder: "Select team",
      searchPlaceholder: "Search teams...",
      required: true,
      apiUrl: "https://api.example.com/teams",
      transformResponse: (data) =>
        data.map((team: any) => ({
          value: team.id,
          label: team.name,
        })),
      searchParam: "query",
      minSearchLength: 2,
      colSpan: 6,
    },
  ];

  // Form submission handler
  const handleFormSubmit = async ({
    values,
    setError,
    reset,
  }: {
    values: z.infer<typeof formSchema>;
    setError: any;
    reset: () => void;
  }) => {
    console.log("Form submitted with values:", values);
    // In a real application, you would submit to an API here
    // For this example, we'll just show the values in the console
    // and simulate a successful submission
    alert("Form submitted successfully!");
    reset();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Profile Form</h1>
      <DynamicForm
        controllers={controllers}
        formSchema={formSchema}
        handleSubmit={handleFormSubmit}
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
          label: "Save Profile",
          className: "w-full bg-blue-600 hover:bg-blue-700",
        }}
      />
    </div>
  );
};

export default DynamicFormWithSelectExample;
