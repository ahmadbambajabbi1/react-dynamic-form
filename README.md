# z-react-dynamic-form Documentation

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Form Validation with Zod](#form-validation-with-zod)
- [Available Controllers](#available-controllers)
  - [Text Input](#text-input)
  - [Email Input](#email-input)
  - [Password Input](#password-input)
  - [Number Input](#number-input)
  - [Textarea](#textarea)
  - [Checkbox](#checkbox)
  - [Group Checkbox](#group-checkbox)
  - [Phone Number Input](#phone-number-input)
  - [Select (Dropdown)](#select-dropdown)
  - [Searchable Select](#searchable-select)
  - [Multi-Select](#multi-select)
  - [Searchable Multi-Select](#searchable-multi-select)
  - [Select with API](#select-with-api)
  - [Dependent Select with API](#dependent-select-with-api)
  - [Date Picker](#date-picker)
  - [Range Date Picker](#range-date-picker)
  - [Rich Text Editor](#rich-text-editor)
  - [File Upload](#file-upload)
  - [Multiple File Upload](#multiple-file-upload)
  - [React Node (Custom Component)](#react-node-custom-component)
- [Conditional Field Display](#conditional-field-display)
- [Form Groups](#form-groups)
- [Multi-Step Forms](#multi-step-forms)
- [API Integration](#api-integration)
  - [API Options Configuration](#api-options-configuration)
  - [Automatic Form Submission](#automatic-form-submission)
  - [Error Handling](#error-handling)
  - [API Response Handling](#api-response-handling)
  - [Verification Flow with OTTP](#verification-flow-with-ottp)
  - [Global API Configuration](#global-api-configuration)
  - [API Options for Select Controllers](#api-options-for-select-controllers)
- [Backend Integration](#backend-integration)
  - [Error Response Format](#error-response-format)
  - [Validation Error Response](#validation-error-response)
  - [Multiple Error Fields](#multiple-error-fields)
  - [Modal Error Response](#modal-error-response)
  - [Toast Error Response](#toast-error-response)
  - [Redirect Response](#redirect-response)
- [Custom Form Submission](#custom-form-submission)
- [UI Customization](#ui-customization)
  - [Custom Modal Component](#custom-modal-component)
  - [Submit Button Customization](#submit-button-customization)
  - [Custom Submission Trigger](#custom-submission-trigger)
  - [Form Styling](#form-styling)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Conclusion](#conclusion)

## Introduction

`z-react-dynamic-form` is a powerful, flexible form builder for React applications that enables you to create complex forms with minimal effort. Leveraging Zod for schema validation, the library provides a type-safe approach to form development while supporting a wide range of input types, multi-step forms, and API integrations.

## Features

- **Type-safe forms** with Zod schema validation
- **Extensive controller library** with 20+ input types
- **Multi-step forms** with conditional logic
- **API integration** for dynamic data loading and form submission
- **File uploads** with preview and validation
- **Responsive design** with Tailwind CSS support
- **Toast notifications** for feedback
- **Conditional field rendering** based on form values
- **Seamless backend integration** for validation errors

## Installation

```bash
npm install z-react-dynamic-form
```

## Basic Usage

Here's a simple example of how to create a form using `z-react-dynamic-form`:

```tsx
import React from "react";
import { DynamicForm } from "z-react-dynamic-form";
import { z } from "zod";

// Define your form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  age: z.number().min(18, "You must be at least 18 years old"),
});

// Define your form controllers
const controllers = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
    min: 18,
    required: true,
  },
];

const MyForm = () => {
  const handleSubmit = async ({ values, setError, reset }) => {
    try {
      console.log("Form submitted with values:", values);
      // Submit your form data to an API
      // await api.submitForm(values);
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <DynamicForm
      controllers={controllers}
      formSchema={formSchema}
      handleSubmit={handleSubmit}
    />
  );
};

export default MyForm;
```

## Form Validation with Zod

The library uses Zod for schema validation, providing type safety and robust validation rules:

```tsx
import { z } from "zod";

const formSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

## Available Controllers

### Text Input

```tsx
{
  name: "username",
  label: "Username",
  type: "text",
  placeholder: "Enter your username",
  required: true,
  description: "Choose a unique username for your account",
  defaultValue: "",
  maximun: 20, // Maximum character length
}
```

### Email Input

```tsx
{
  name: "email",
  label: "Email Address",
  type: "email",
  placeholder: "user@example.com",
  required: true,
}
```

### Password Input

```tsx
{
  name: "password",
  label: "Password",
  type: "password",
  placeholder: "Enter your password",
  required: true,
}
```

### Number Input

```tsx
{
  name: "age",
  label: "Age",
  type: "number",
  placeholder: "Enter your age",
  min: 18,
  max: 120,
  step: 1,
  required: true,
}
```

### Textarea

```tsx
{
  name: "bio",
  label: "Biography",
  type: "textarea",
  placeholder: "Tell us about yourself",
  rows: 4,
  description: "Brief description about yourself",
}
```

### Checkbox

```tsx
{
  name: "newsletter",
  label: "Subscribe to newsletter",
  type: "checkbox",
  defaultValue: false,
}
```

### Group Checkbox

```tsx
{
  name: "interests",
  label: "Interests",
  type: "group-checkbox",
  groupCheckbox: [
    {
      name: "interests",
      label: "Select your interests",
      options: [
        { label: "Sports", value: "sports" },
        { label: "Music", value: "music" },
        { label: "Movies", value: "movies" },
        { label: "Reading", value: "reading" },
      ]
    }
  ]
}
```

### Phone Number Input

```tsx
{
  name: "phoneNumber",
  label: "Phone Number",
  type: "phone-number",
  placeholder: "Enter your phone number",
  defaultValue: {
    countryCode: "US",
    dialCode: "+1",
    phoneNumber: ""
  },
}
```

### Select (Dropdown)

```tsx
{
  name: "country",
  label: "Country",
  type: "select",
  placeholder: "Select your country",
  options: [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
    { label: "Australia", value: "au" },
  ],
  required: true,
}
```

### Searchable Select

```tsx
{
  name: "country",
  label: "Country",
  type: "searchable-select",
  placeholder: "Search for a country",
  searchPlaceholder: "Type to search...",
  minSearchLength: 1,
  options: [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
    { label: "Australia", value: "au" },
    // Many more options...
  ],
}
```

### Multi-Select

```tsx
{
  name: "skills",
  label: "Skills",
  type: "multi-select",
  placeholder: "Select your skills",
  maxSelections: 5, // Maximum number of selections
  options: [
    { label: "JavaScript", value: "js" },
    { label: "React", value: "react" },
    { label: "TypeScript", value: "ts" },
    { label: "Node.js", value: "node" },
  ],
}
```

### Searchable Multi-Select

```tsx
{
  name: "skills",
  label: "Skills",
  type: "searchable-multi-select",
  placeholder: "Select your skills",
  searchPlaceholder: "Search skills",
  minSearchLength: 1,
  maxSelections: 10,
  options: [
    // Large list of options...
    { label: "JavaScript", value: "js" },
    { label: "React", value: "react" },
    { label: "TypeScript", value: "ts" },
    { label: "Node.js", value: "node" },
    // ...many more
  ],
}
```

### Select with API

```tsx
{
  name: "state",
  label: "State",
  type: "select-from-api",
  placeholder: "Select your state",
  apiUrl: "https://api.example.com/states",
  transformResponse: (data) => {
    // Convert API response to options
    return data.map(item => ({
      label: item.name,
      value: item.code
    }));
  },
}
```

### Dependent Select with API

```tsx
{
  name: "country",
  label: "Country",
  type: "select-from-api",
  placeholder: "Select your country",
  apiUrl: "https://api.example.com/countries",
},
{
  name: "state",
  label: "State",
  type: "select-from-api",
  placeholder: "Select your state",
  apiUrl: "https://api.example.com/states",
  optionsApiOptions: {
    dependingContrllerName: "country", // Depends on country field
    paramName: "countryCode", // Parameter name for the API
  },
}
```

### Date Picker

```tsx
{
  name: "birthdate",
  label: "Date of Birth",
  type: "date",
  mode: "single", // Can be "single" or "range"
  placeholder: "Select your birth date",
}
```

### Range Date Picker

```tsx
{
  name: "travelDates",
  label: "Travel Dates",
  type: "date",
  mode: "range",
  placeholder: "Select travel dates",
}
```

### Rich Text Editor

```tsx
{
  name: "description",
  label: "Project Description",
  type: "rich-text-editor",
  placeholder: "Describe your project in detail",
}
```

### File Upload

```tsx
{
  name: "profilePhoto",
  label: "Profile Photo",
  type: "upload",
  multiple: false,
  acceptedFileTypes: {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  maxFiles: 1,
}
```

### Multiple File Upload

```tsx
{
  name: "documents",
  label: "Documents",
  type: "upload",
  multiple: true,
  acceptedFileTypes: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  },
  maxFiles: 5,
}
```

### React Node (Custom Component)

```tsx
{
  name: "custom",
  type: "react-node",
  reactNode: <div className="p-4 bg-gray-100 rounded-md">
    <h3 className="text-lg font-medium">Custom Instructions</h3>
    <p>Please read carefully before proceeding.</p>
  </div>
}
```

## Conditional Field Display

You can conditionally show/hide fields based on other form values:

```tsx
{
  name: "hasDiscount",
  label: "Do you have a discount code?",
  type: "checkbox",
},
{
  name: "discountCode",
  label: "Discount Code",
  type: "text",
  placeholder: "Enter your discount code",
  // Only show this field if hasDiscount is true
  visible: (formValues) => formValues.hasDiscount === true,
}
```

## Form Groups

Group related fields together:

```tsx
{
  groupName: "Contact Information",
  groupControllers: [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "phone-number",
    }
  ]
}
```

## Multi-Step Forms

Create multi-step forms with validation at each step:

```tsx
import React from "react";
import { DynamicForm } from "z-react-dynamic-form";
import { z } from "zod";

// Define schema for each step
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
});

const addressSchema = z.object({
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(5, "Valid zip code required"),
});

// Define steps
const steps = [
  {
    stepName: "Personal Information",
    stepSchema: personalInfoSchema,
    controllers: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        required: true,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
      },
    ],
  },
  {
    stepName: "Address",
    stepSchema: addressSchema,
    controllers: [
      {
        name: "address",
        label: "Street Address",
        type: "text",
        required: true,
      },
      {
        name: "city",
        label: "City",
        type: "text",
        required: true,
      },
      {
        name: "zipCode",
        label: "Zip Code",
        type: "text",
        required: true,
      },
    ],
  },
];

// Combine schemas
const formSchema = z.object({
  ...personalInfoSchema.shape,
  ...addressSchema.shape,
});

const StepFormExample = () => {
  const handleSubmit = async ({ values }) => {
    console.log("Form submitted with values:", values);
    // Submit form data
  };

  return (
    <DynamicForm
      steps={steps}
      formSchema={formSchema}
      handleSubmit={handleSubmit}
      formtype="steper"
    />
  );
};

export default StepFormExample;
```

## API Integration

### API Options Configuration

The `apiOptions` prop accepts an object with the following properties:

```typescript
type apiOptionsType = {
  api: string; // API endpoint URL
  method: "POST" | "PATCH" | "PUT" | "DELETE" | "GET"; // HTTP method
  options?: AxiosRequestConfig; // Additional Axios request configuration
  errorHandler?: (data: any, type: errorHandlertType) => void; // Custom error handler
  onFinish?: (data: any) => void; // Callback function after successful submission
};
```

### Automatic Form Submission

When you provide `apiOptions` without a custom `handleSubmit` function, the form automatically handles submission to your API:

```tsx
<DynamicForm
  controllers={controllers}
  formSchema={formSchema}
  apiOptions={{
    api: "https://api.example.com/submit",
    method: "POST",
    options: {
      headers: {
        // Additional headers
      },
    },
    onFinish: (responseData) => {
      // Handle successful response
      console.log("Success:", responseData);
    },
  }}
/>
```

With this configuration, the form will:

1. Validate all inputs using your Zod schema
2. Automatically submit the form data to the specified API endpoint
3. Handle loading states during submission
4. Display appropriate error messages on failure
5. Execute the `onFinish` callback on success

### Error Handling

The `apiOptions` provides a robust error handling system through the `errorHandler` property:

```typescript
type errorHandlertType = "form" | "modal" | "toast" | "redirect";
```

```tsx
<DynamicForm
  controllers={controllers}
  formSchema={formSchema}
  apiOptions={{
    api: "https://api.example.com/submit",
    method: "POST",
    errorHandler: (data, type) => {
      if (type === "form") {
        // Handle form validation errors returned from API
        console.log("Form errors:", data);
      } else if (type === "toast") {
        // Handle errors to be displayed as toasts
        console.log("Toast error:", data);
      } else if (type === "modal") {
        // Handle errors to be displayed in a modal
        console.log("Modal error:", data);
      } else if (type === "redirect") {
        // Handle redirect responses
        window.location.href = data.redirectUrl;
      }
    },
  }}
/>
```

### API Response Handling

The library also handles specific API response formats:

#### Success Type Response

When your API returns a success response with an action type, the library can perform specific actions:

```json
{
  "status": "success",
  "action": "VERIFIED",
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com"
    }
  }
}
```

In the example above, if the `action` is `VERIFIED`, the library can store verification data in localStorage and handle verification flows automatically.

#### Form Error Response

For form validation errors, your API can return:

```json
{
  "status": "error",
  "action": "form",
  "error": [
    {
      "path": ["email"],
      "message": "Email already exists"
    },
    {
      "path": ["password"],
      "message": "Password is too weak"
    }
  ]
}
```

The library will automatically map these errors to the corresponding form fields.

### Verification Flow with OTTP

The library also supports One-Time Password (OTP) verification flows. When your API returns a response with:

```json
{
  "action": "VERIFIED",
  "data": {
    // Verification data
  }
}
```

The component switches to the `OttpInputHandler` which provides a dedicated interface for entering verification codes. This feature is useful for:

- Email verification
- Phone verification
- Two-factor authentication
- Identity verification processes

The verification data is stored in localStorage under the key defined in the component (`VERIFICATION_DATA_LOCASTORAGE_NAME`).

### Global API Configuration

For global API configuration, you can use the `initConfig` utility:

```typescript
import { initConfig } from "z-react-dynamic-form";

initConfig(
  {
    api: {
      baseURL: "https://api.example.com",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "your-api-key",
      },
      timeout: 30000, // 30 seconds
    },
  },
  // Optional token provider function
  async () => {
    const token = localStorage.getItem("auth_token");
    return { accessToken: token };
  }
);
```

This configuration sets up:

1. Default base URL for all API requests
2. Default headers and timeout
3. Authentication token provider that's called automatically before requests

### API Options for Select Controllers

Many of the select controllers (`select-from-api`, `searchable-select-from-api`, etc.) also support API integration through the `apiUrl` and `optionsApiOptions` properties:

```tsx
{
  name: "country",
  label: "Country",
  type: "select-from-api",
  placeholder: "Select country",
  apiUrl: "https://api.example.com/countries",
  transformResponse: (data) => {
    // Transform API response to options format
    return data.map(item => ({
      label: item.name,
      value: item.id
    }));
  }
}
```

The `optionsApiOptions` property provides additional configuration:

```tsx
{
  name: "city",
  label: "City",
  type: "select-from-api",
  placeholder: "Select city",
  apiUrl: "https://api.example.com/cities",
  optionsApiOptions: {
    dependingContrllerName: "country", // Field this depends on
    paramName: "countryId", // Parameter name to send to API
    includeAll: false, // Whether to include "All" option
    params: {
      // Additional parameters
      limit: 50
    }
  }
}
```

With this configuration, when the value of the `country` field changes, the component will automatically fetch new options for the `city` select field, passing the country value as a parameter.

## Backend Integration

The library is designed to work seamlessly with backend validation. When your backend detects validation errors, it can send them in a standardized format that the form automatically interprets and displays.

### Error Response Format

For backend validation errors to be properly mapped to form fields, your API should return the following structure:

```json
{
  "error": {
    "path": ["fieldName"],
    "message": "Error message for this field"
  },
  "action": "form"
}
```

The `path` array contains the names of the form fields that have errors, and the `message` is the error text to display. The `action` property with the value `"form"` tells the component to treat this as a form validation error.

### Validation Error Response

For a simple form validation error, your backend should return:

```json
{
  "error": {
    "path": ["email"],
    "message": "This email is already registered"
  },
  "action": "form"
}
```

This will display the error message under the email field in the form.

### Multiple Error Fields

To return errors for multiple fields, use an array of error objects:

```json
{
  "error": [
    {
      "path": ["email"],
      "message": "This email is already registered"
    },
    {
      "path": ["password"],
      "message": "Password must contain at least one uppercase letter"
    }
  ],
  "action": "form"
}
```

This format directly maps to Zod's validation error structure, making it easy to integrate with backend validation libraries that use Zod or similar validation libraries.

### Modal Error Response

For errors that should be displayed in a modal:

```json
{
  "data": [
    {
      "message": "Your session has expired"
    },
    {
      "message": "Please log in again"
    }
  ],
  "action": "modal"
}
```

The component will display these messages in a modal dialog if you provide a `modalComponenet` prop.

### Toast Error Response

For errors that should be displayed as toast notifications:

```json
{
  "message": "Server is currently undergoing maintenance",
  "action": "toast"
}
```

The component will display this message as a toast notification.

### Redirect Response

For responses that should trigger a redirect:

```json
{
  "redirectUrl": "/login",
  "action": "redirect"
}
```

Your error handler can use this to navigate the user to another page.

## Custom Form Submission

Handle form submission with custom logic:

```tsx
const handleSubmit = async ({ values, setError, reset }) => {
  try {
    // Show loading state
    setSubmitLoading(true);

    // Send data to API
    const response = await fetch("https://api.example.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      // Handle API errors
      const errorData = await response.json();

      if (errorData.error && errorData.action === "form") {
        // Set field-specific errors from backend
        if (Array.isArray(errorData.error)) {
          errorData.error.forEach((err) => {
            setError(err.path[0], {
              type: "manual",
              message: err.message,
            });
          });
        } else {
          setError(errorData.error.path[0], {
            type: "manual",
            message: errorData.error.message,
          });
        }
        throw new Error("Please correct the form errors");
      }

      throw new Error(errorData.message || "Form submission failed");
    }

    // Handle success
    toast.success("Form submitted successfully!");
    reset(); // Reset form
  } catch (error) {
    toast.error(error.message);
    console.error("Form submission error:", error);
  } finally {
    setSubmitLoading(false);
  }
};
```

## UI Customization

### Custom Modal Component

When using `apiOptions`, you can provide a custom modal component for displaying API errors:

```tsx
<DynamicForm
  controllers={controllers}
  formSchema={formSchema}
  apiOptions={{
    api: "https://api.example.com/submit",
    method: "POST",
  }}
  modalComponenet={(modal, setModal) => (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        modal.open ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Error</h3>
        <div className="mb-4">
          {/* Display modal.data here */}
          {modal.data.map((error, index) => (
            <p key={index} className="text-red-500">
              {error.message}
            </p>
          ))}
        </div>
        <button
          onClick={() => setModal({ ...modal, open: false })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  )}
/>
```

This modal will be displayed when the API returns an error with the type "modal".

### Submit Button Customization

You can customize the submit button appearance and behavior:

```tsx
<DynamicForm
  controllers={controllers}
  formSchema={formSchema}
  apiOptions={{
    api: "https://api.example.com/submit",
    method: "POST",
  }}
  submitBtn={{
    label: "Save Changes", // Custom button text
    className: "bg-green-600 hover:bg-green-700", // Additional CSS classes
    type: "submit", // Button type
    disabled: false, // Control disabled state
  }}
/>
```

### Custom Submission Trigger

For complete control over the submission UI, you can use the `tricker` prop:

```tsx
<DynamicForm
  controllers={controllers}
  formSchema={formSchema}
  apiOptions={{
    api: "https://api.example.com/submit",
    method: "POST",
  }}
  tricker={({ submitLoading, isValid }) => (
    <div className="flex justify-between items-center mt-4">
      <button
        type="button"
        onClick={() => console.log("Cancel")}
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={submitLoading || !isValid}
        className={`px-6 py-2 rounded ${
          submitLoading || !isValid
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {submitLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit Form"
        )}
      </button>
    </div>
  )}
/>
```

### Form Styling

Customize form appearance:

```tsx
<DynamicForm
  controllers={controllers}
  formSchema={formSchema}
  handleSubmit={handleSubmit}
  props={{
    form: {
      className: "space-y-6 p-6 bg-gray-50 rounded-lg shadow-sm",
    },
    controllerBase: {
      className: "grid gap-6 md:grid-cols-2",
    },
    submitBtn: {
      className:
        "w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
      label: "Submit Application",
    },
  }}
/>
```

## Best Practices

1. **Schema Validation**: Always define a Zod schema that matches your form structure for type safety and validation.

2. **Error Handling**: Provide informative error messages in your schema for better user experience.

3. **Conditional Fields**: Use the `visible` property to conditionally show/hide fields based on form values.

4. **Field Dependencies**: Utilize `optionsApiOptions` with `dependingContrllerName` for fields that depend on other field values.

5. **Form Groups**: Group related fields together using `groupControllers` for better organization.

6. **Responsive Design**: Use the `props` object to apply responsive grid layouts.

7. **Loading States**: Handle loading states during form submission to provide feedback to users.

8. **Validation Feedback**: Use toast notifications or inline errors to provide feedback on validation failures.

9. **Default Values**: Set appropriate default values for your fields to pre-fill the form.

10. **API Error Format**: When developing your backend, follow the specified error response format to ensure seamless integration with the form.

## Troubleshooting

### Common Issues

1. **Form validation not working**:

   - Ensure your Zod schema correctly matches your form structure
   - Check for typos in field names

2. **API select not loading options**:

   - Verify API URL is correct
   - Check if `transformResponse` function is properly formatting the data
   - Confirm that API response format matches expected structure

3. **File uploads not working**:

   - Verify file size is within limits
   - Check accepted file types
   - Ensure maxFiles is set correctly

4. **Dependent fields not updating**:

   - Confirm `dependingContrllerName` matches exactly with the field name it depends on
   - Ensure the parent field is properly setting its value

5. **Backend validation errors not showing**:
   - Ensure your API returns errors in the correct format (`{ error: { path: [...], message: "..." }, action: "form" }`)
   - Check that field names in error paths match your controller names exactly

## Conclusion

`z-react-dynamic-form` provides a powerful, flexible solution for creating forms in React applications. By combining type safety with Zod, extensive controller options, and seamless backend integration, it simplifies the process of building complex forms while maintaining a great user experience.

The library is designed to handle a wide range of form scenarios, from simple contact forms to complex multi-step registration flows, making it suitable for various application needs.
