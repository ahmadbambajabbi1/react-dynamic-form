import React from "react";
import {
  DynamicForm,
  FormControllerTypesProps,
  initConfig,
} from "react-dynamic-form-builder";
import config from "../../form.config.json";

async function getSession() {
  return {
    user: {
      _id: "67fe74719935898c22b5e55f",
      email: "ebrima@gmail.com",
      newUser: false,
      verify: false,
      role: 56,
      schoolEnrollIt: true,
    },
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3ZmU3NDcxOTkzNTg5OGMyMmI1ZTU1ZiIsImVtYWlsIjoiZWJyaW1hQGdtYWlsLmNvbSIsIm5ld1VzZXIiOmZhbHNlLCJ2ZXJpZnkiOmZhbHNlLCJyb2xlIjo1Niwic2Nob29sRW5yb2xsSXQiOnRydWV9LCJpYXQiOjE3NDYwNjQzOTMsImV4cCI6MTc0ODY1NjM5M30.lj18rum_k9wj_pvv3YrQmnDh9710SHqKpihCZMJ-FiY",
  };
}
initConfig(config, getSession as any);
import { z } from "zod";
const BasicForm: React.FC = () => {
  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    subscribeToNewsletter: z.boolean().optional(),
    select: z.string().optional(),
    searchInSelect: z.string().optional(),
    selectFromApi: z.string().optional(),
    searchFromApi: z.string().optional(),
    multiSelect: z.array(z.string()).optional(),
    multiSelectFromApi: z.array(z.string()).optional(),
  });
  const controllers = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email address",
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Enter your message here",
      rows: 5,
    },
    {
      name: "subscribeToNewsletter",
      label: "Subscribe to newsletter",
      type: "checkbox",
      optional: true,
    },
    {
      name: "select",
      label: "Select an option",
      type: "select",
      placeholder: "Choose an option",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
    },
    {
      name: "searchInSelect",
      label: "Search in select",
      type: "select",
      placeholder: "Search in select",
      options: [
        { label: "Option A", value: "optionA" },
        { label: "Option B", value: "optionB" },
        { label: "Option C", value: "optionC" },
      ],
      searchable: true,
    },
    {
      name: "selectFromApi",
      label: "Select from API",
      type: "select",
      placeholder: "Select from API",
      apiOptions: {
        api: "/api/select-options",
        method: "GET",
        paramsKeyName: ["search"],
      },
    },
    {
      name: "searchFromApi",
      label: "Search from API",
      type: "select",
      placeholder: "Search from API",
      apiOptions: {
        api: "/api/search-options",
        method: "GET",
      },
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values }: any) => {
    console.log("Form submitted with values:", values);
    alert("Form submitted successfully!\n\n" + JSON.stringify(values, null, 2));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Basic Contact Form</h2>
      <DynamicForm
        controllers={controllers}
        formSchema={formSchema}
        handleSubmit={handleSubmit}
        submitBtn={{ label: "Submit Form" }}
      />
    </div>
  );
};

export default BasicForm;
