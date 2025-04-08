<!-- # React Dynamic Form Builder

A flexible and powerful dynamic form builder for React applications with built-in validation using Zod and React Hook Form.

## Features

- **Dynamic Form Generation**: Create forms with various input types
- **Form Validation**: Built-in validation using Zod schemas
- **Step Forms**: Support for multi-step forms with individual validations
- **File Upload**: Support for single or multiple file uploads
- **Rich Text Editor**: Simple built-in rich text editor
- **Custom Input Types**: Extensible to support custom input types
- **Responsive Design**: Works on all device sizes

## Installation

```bash
npm install react-dynamic-form-builder
# or
yarn add react-dynamic-form-builder
```

## Usage

### Basic Form

```jsx
import React from "react";
import { DynamicForm } from "react-dynamic-form-builder";
import { z } from "zod";

const MyForm = () => {
  // Define form schema for validation
  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    age: z.number().min(18, "Must be at least 18 years old"),
    preferences: z.string().array().optional(),
  });

  // Define form controllers
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
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "Enter your age",
    },
    {
      name: "preferences",
      label: "Preferences",
      type: "multi-select",
      placeholder: "Select your preferences",
      options: [
        { label: "Sports", value: "sports" },
        { label: "Music", value: "music" },
        { label: "Reading", value: "reading" },
        { label: "Travel", value: "travel" },
      ],
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values }) => {
    console.log("Form values:", values);
    // Process form data here
  };

  return (
    <DynamicForm
      controllers={controllers}
      formSchema={formSchema}
      handleSubmit={handleSubmit}
      submitBtn={{ label: "Submit Form" }}
    />
  );
};

export default MyForm;
```

### Multi-Step Form

```jsx
import React from "react";
import { DynamicForm } from "react-dynamic-form-builder";
import { z } from "zod";

const MyStepForm = () => {
  // Define step schemas
  const personalInfoSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
  });

  const addressSchema = z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    zipCode: z.string().min(5, "Valid zip code is required"),
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
          placeholder: "Enter your first name",
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          placeholder: "Enter your last name",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email address",
        },
      ],
    },
    {
      stepName: "Address Information",
      stepSchema: addressSchema,
      controllers: [
        {
          name: "street",
          label: "Street Address",
          type: "text",
          placeholder: "Enter your street address",
        },
        {
          name: "city",
          label: "City",
          type: "text",
          placeholder: "Enter your city",
        },
        {
          name: "zipCode",
          label: "Zip Code",
          type: "text",
          placeholder: "Enter your zip code",
        },
      ],
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values }) => {
    console.log("Form values:", values);
    // Process form data here
  };

  return (
    <DynamicForm
      steps={steps}
      formtype="steper"
      handleSubmit={handleSubmit}
      submitBtn={{ label: "Complete Registration" }}
      stepPreview={(values) => (
        <div>
          <h3>Review Your Information</h3>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      )}
    />
  );
};

export default MyStepForm;
```

## Available Input Types

- `text` - Text input
- `email` - Email input
- `password` - Password input
- `number` - Number input
- `textarea` - Multiline text input
- `select` - Dropdown select
- `multi-select` - Multiple selection dropdown
- `searchable-select` - Searchable dropdown
- `checkbox` - Single checkbox
- `group-checkbox` - Group of checkboxes
- `date` - Date picker
- `upload` - File upload
- `rich-text-editor` - Simple rich text editor
- `react-node` - Custom React component

## Props

### DynamicForm Props

| Prop           | Type                    | Description                                         |
| -------------- | ----------------------- | --------------------------------------------------- |
| `controllers`  | `FormControllerProps[]` | Array of form controllers (for regular forms)       |
| `steps`        | `StepsType<T>[]`        | Array of step configurations (for multi-step forms) |
| `formSchema`   | `z.ZodType`             | Zod schema for form validation                      |
| `handleSubmit` | `Function`              | Function to handle form submission                  |
| `apiOptions`   | `object`                | API configuration for form submission               |
| `formtype`     | `"normal" \| "steper"`  | Form type (default: "normal")                       |
| `submitBtn`    | `object`                | Custom submit button configuration                  |
| `stepPreview`  | `Function`              | Function to render preview in multi-step forms      |

### FormController Props

| Prop              | Type                  | Description                   |
| ----------------- | --------------------- | ----------------------------- |
| `name`            | `string`              | Field name                    |
| `label`           | `string`              | Field label                   |
| `type`            | `string`              | Input type                    |
| `placeholder`     | `string`              | Placeholder text              |
| `defaultValue`    | `any`                 | Default value                 |
| `options`         | `array \| "from-api"` | Options for select inputs     |
| `optional`        | `boolean`             | Whether the field is optional |
| `className`       | `string`              | Custom CSS class              |
| ... and many more |                       |                               |

## License

MIT -->

# React Dynamic Form Builder

A powerful, flexible, and fully customizable form builder for React applications with built-in validation using Zod. Create everything from simple forms to complex multi-step wizards with ease.

![npm](https://img.shields.io/npm/v/react-dynamic-form-builder)
![license](https://img.shields.io/npm/l/react-dynamic-form-builder)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## Features

- **🔄 Dynamic Form Generation**: Create forms with various input types on the fly
- **✅ Built-in Validation**: Seamless integration with Zod for robust form validation
- **🧩 Multiple Input Types**: Support for text, select, multi-select, date pickers, file uploads, and more
- **📱 Responsive Design**: Works beautifully on all screen sizes
- **🧙‍♂️ Multi-step Forms**: Create step-by-step form wizards with individual validation per step
- **📁 File Upload**: Support for single or multiple file uploads with preview
- **📝 Rich Text Editor**: Simple built-in rich text editor for content creation
- **🔍 Searchable Selects**: Type to search in dropdown options
- **🔒 OTP Verification**: Built-in OTP input handling for verification flows
- **🎨 Customizable**: Fully customizable styling and behavior

## Installation

```bash
npm install react-dynamic-form-builder
# or
yarn add react-dynamic-form-builder
```

### Peer Dependencies

You'll need to install the following peer dependencies if you don't already have them:

```bash
npm install react react-dom zod
# or
yarn add react react-dom zod
```

### Type Definitions

TypeScript types are included and no additional installation is needed.

### Integration with CSS Frameworks

The library works well with any CSS framework, but it's designed to be easy to use with Tailwind CSS. If you're using Tailwind, add the following to your tailwind.config.js to ensure all the styling works correctly:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    // ...other content paths
    "./node_modules/react-dynamic-form-builder/**/*.{js,ts,jsx,tsx}",
  ],
  // ...rest of your config
};
```

## Project Structure

```
react-dynamic-form-builder/
├── DynamicForm.tsx           # Main component
├── components/               # Form components
│   ├── FileUploadHandler/    # File upload component
│   ├── RichTextEditor/       # Rich text editor
│   ├── DateHandler/          # Date picker
│   ├── FormElementHandler    # Input renderer
│   └── ... other components
├── services/                 # API and services
│   ├── axiosConfig.ts        # API configuration
│   └── sessionService.ts     # Session management
├── types/                    # Type definitions
└── utils/                    # Utility functions
```

## Basic Usage

Here's a simple example of a form with validation:

```jsx
import React from "react";
import { DynamicForm } from "react-dynamic-form-builder";
import { z } from "zod";

const MyForm = () => {
  // Define validation schema
  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    age: z.number().min(18, "Must be at least 18 years old"),
  });

  // Define form fields
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
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "Enter your age",
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values, setError, reset }) => {
    console.log("Form values:", values);

    try {
      // Process form data here (e.g., API call)
      // If you need to set custom errors:
      // setError('fieldName', { message: 'Custom error message' });
      // Reset form if needed
      // reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <DynamicForm
      controllers={controllers}
      formSchema={formSchema}
      handleSubmit={handleSubmit}
      submitBtn={{ label: "Submit Form" }}
    />
  );
};

export default MyForm;
```

## Multi-step Forms

Create wizards with individual validation per step:

```jsx
import React from "react";
import { DynamicForm } from "react-dynamic-form-builder";
import { z } from "zod";

const MyStepForm = () => {
  // Define step schemas
  const personalInfoSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
  });

  const addressSchema = z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    zipCode: z.string().min(5, "Valid zip code is required"),
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
          placeholder: "Enter your first name",
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          placeholder: "Enter your last name",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email address",
        },
      ],
    },
    {
      stepName: "Address Information",
      stepSchema: addressSchema,
      controllers: [
        {
          name: "street",
          label: "Street Address",
          type: "text",
          placeholder: "Enter your street address",
        },
        {
          name: "city",
          label: "City",
          type: "text",
          placeholder: "Enter your city",
        },
        {
          name: "zipCode",
          label: "Zip Code",
          type: "text",
          placeholder: "Enter your zip code",
        },
      ],
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values }) => {
    console.log("Form values:", values);
    // Process form data here
  };

  return (
    <DynamicForm
      steps={steps}
      formtype="steper"
      handleSubmit={handleSubmit}
      submitBtn={{ label: "Complete Registration" }}
      stepPreview={(values) => (
        <div>
          <h3>Review Your Information</h3>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      )}
    />
  );
};

export default MyStepForm;
```

## File Upload

Handle file uploads with ease:

```jsx
import React from "react";
import { DynamicForm } from "react-dynamic-form-builder";
import { z } from "zod";

const FileUploadForm = () => {
  const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    documents: z.any().optional(), // File validation is handled by the component
  });

  const controllers = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter your name",
    },
    {
      name: "documents",
      label: "Upload Documents",
      type: "upload",
      multiple: true, // Allow multiple files
      maxFiles: 3, // Maximum number of files
      acceptedFileTypes: {
        "application/pdf": [".pdf"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
    },
  ];

  const handleSubmit = async ({ values }) => {
    console.log("Files:", values.documents);
    // Process files here
  };

  return (
    <DynamicForm
      controllers={controllers}
      formSchema={formSchema}
      handleSubmit={handleSubmit}
      submitBtn={{ label: "Upload Files" }}
    />
  );
};

export default FileUploadForm;
```

## Available Input Types

- `text` - Text input
- `email` - Email input
- `password` - Password input with visibility toggle
- `number` - Number input
- `textarea` - Multiline text input
- `select` - Dropdown selection
- `multi-select` - Multiple selection dropdown
- `searchable-select` - Searchable dropdown
- `checkbox` - Single checkbox
- `group-checkbox` - Group of checkboxes
- `date` - Date picker with single or range mode
- `upload` - File upload with preview
- `rich-text-editor` - Simple rich text editor
- `phone-number` - Phone number input
- `react-node` - Custom React component

## API Configuration

The library automatically reads configuration from a `form.config.json` file in your project root. Create this file with your API settings:

```json
{
  "api": {
    "baseURL": "https://api.example.com",
    "headers": {
      "Content-Type": "application/json",
      "X-Custom-Header": "Custom Value"
    },
    "timeout": 30000
  }
}
```

### Authentication

For authentication, create a `services/sessionService.js` or `services/sessionService.ts` file in your project:

```javascript
// services/sessionService.js
export const getSession = async () => {
  // Your custom logic to get the auth token
  const token = localStorage.getItem("auth_token");
  return { accessToken: token };
};
```

The library will automatically detect and use your session service.

### Manual Configuration

You can also configure the API programmatically:

````javascript
import { initConfig } from 'react-dynamic-form-builder/dist/services/axiosConfig';

// Initialize with custom config and session function
initConfig(
  {
    api: {
      baseURL: 'https://api.example.com'
    }
  },
  async () => ({ accessToken: 'my-token' })
);
```1. Using form.config.json

Create a `form.config.json` file in your project root:

```json
{
  "api": {
    "baseURL": "https://api.example.com",
    "headers": {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Custom-Header": "Custom Value"
    },
    "timeout": 30000
  }
}
````

### 2. Using the initConfig method

```javascript
import { initConfig } from "react-dynamic-form-builder/services/axiosConfig";

// Initialize with custom config
initConfig({
  api: {
    baseURL: "https://api.example.com",
    headers: {
      "Content-Type": "application/json",
      "X-Custom-Header": "Custom Value",
    },
    timeout: 30000,
  },
});
```

### Authentication Integration

The library supports session-based authentication. You can implement your own session handler by creating a `services/sessionService.ts` file in your project:

```typescript
// services/sessionService.ts
export const getSession = async (): Promise<{ accessToken?: string }> => {
  // Your custom logic to get the access token
  // Example with next-auth:
  const session = await getNextAuthSession();
  return { accessToken: session?.accessToken };
};
```

With this setup, all API requests made by the form will automatically include the access token in the Authorization header.
