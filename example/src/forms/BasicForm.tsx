import React from "react";
import { DynamicForm } from "react-dynamic-form-builder";
import { z } from "zod";

const BasicForm: React.FC = () => {
  // Define form schema for validation
  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    subscribeToNewsletter: z.boolean().optional(),
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
  ];

  // Handle form submission
  const handleSubmit = async ({ values }) => {
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
