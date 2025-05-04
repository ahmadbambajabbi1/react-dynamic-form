import React from "react";
import { DynamicForm } from "react-dynamic-form-builder";
import { z } from "zod";

const ValidationForm: React.FC = () => {
  // Define a complex validation schema
  const formSchema = z
    .object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores"
        ),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
          /[^A-Za-z0-9]/,
          "Password must contain at least one special character"
        ),

      confirmPassword: z.string(),

      email: z.string().email("Please enter a valid email address"),

      age: z
        .number()
        .min(18, "You must be at least 18 years old")
        .max(120, "Age cannot exceed 120"),

      website: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),

      termsAccepted: z.literal(true, {
        errorMap: () => ({
          message: "You must accept the terms and conditions",
        }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  // Define form controllers
  const controllers = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter a username",
      description:
        "Choose a unique username (letters, numbers, and underscores only)",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter a strong password",
      description:
        "Must contain at least 8 characters including uppercase, lowercase, number, and special character",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your password",
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
      name: "website",
      label: "Website",
      type: "text",
      placeholder: "Enter your website URL (optional)",
      optional: true,
    },
    {
      name: "termsAccepted",
      label: "I accept the terms and conditions",
      type: "checkbox",
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values }) => {
    console.log("Validation form submitted with values:", values);
    alert("Form submitted successfully!\n\n" + JSON.stringify(values, null, 2));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Advanced Validation Form</h2>
      <DynamicForm
        controllers={controllers}
        formSchema={formSchema}
        handleSubmit={handleSubmit}
        submitBtn={{ label: "Register Account" }}
      />
    </div>
  );
};

export default ValidationForm;
