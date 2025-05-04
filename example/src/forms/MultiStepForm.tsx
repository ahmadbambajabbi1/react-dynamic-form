import React from "react";
import { DynamicForm } from "react-dynamic-form-builder";
import { z } from "zod";

const MultiStepForm: React.FC = () => {
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

  const preferencesSchema = z.object({
    preferredContact: z.string(),
    interests: z.array(z.string()).min(1, "Select at least one interest"),
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
    {
      stepName: "Preferences",
      stepSchema: preferencesSchema,
      controllers: [
        {
          name: "preferredContact",
          label: "Preferred Contact Method",
          type: "select",
          placeholder: "Select contact method",
          options: [
            { label: "Email", value: "email" },
            { label: "Phone", value: "phone" },
            { label: "Mail", value: "mail" },
          ],
        },
        {
          name: "interests",
          label: "Interests",
          type: "group-checkbox",
          groupCheckbox: [
            {
              name: "interests",
              label: "Select your interests",
              type: "group-checkbox",
              options: [
                { label: "Technology", value: "technology" },
                { label: "Health & Fitness", value: "fitness" },
                { label: "Art & Design", value: "art" },
                { label: "Business", value: "business" },
                { label: "Education", value: "education" },
              ],
            },
          ],
        },
      ],
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values }) => {
    console.log("Multi-step form submitted with values:", values);
    alert("Form submitted successfully!\n\n" + JSON.stringify(values, null, 2));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Multi-Step Registration Form
      </h2>
      <DynamicForm
        steps={steps}
        formtype="steper"
        handleSubmit={handleSubmit}
        submitBtn={{ label: "Complete Registration" }}
        stepPreview={(values) => (
          <div>
            <h3 className="text-lg font-medium mb-2">
              Review Your Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Personal Information</h4>
                  <p>First Name: {values.firstName}</p>
                  <p>Last Name: {values.lastName}</p>
                  <p>Email: {values.email}</p>
                </div>
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p>Street: {values.street}</p>
                  <p>City: {values.city}</p>
                  <p>Zip Code: {values.zipCode}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium">Preferences</h4>
                  <p>Preferred Contact: {values.preferredContact}</p>
                  <p>Interests: {values.interests?.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default MultiStepForm;
