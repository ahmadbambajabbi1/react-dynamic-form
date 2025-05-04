import React from "react";
import { DynamicForm } from "react-dynamic-form-builder";
import { z } from "zod";

const FileUploadForm: React.FC = () => {
  // Define form schema
  const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    documentType: z.string().min(1, "Document type is required"),
    documents: z.any().optional(), // File validation is handled by the component
    notes: z.string().optional(),
  });

  // Define form controllers
  const controllers = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter your name",
    },
    {
      name: "documentType",
      label: "Document Type",
      type: "select",
      placeholder: "Select document type",
      options: [
        { label: "ID Proof", value: "id_proof" },
        { label: "Address Proof", value: "address_proof" },
        { label: "Income Proof", value: "income_proof" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "documents",
      label: "Upload Documents",
      type: "upload",
      multiple: true,
      maxFiles: 3,
      acceptedFileTypes: {
        "application/pdf": [".pdf"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      description:
        "Upload up to 3 files (PDF, JPG, PNG). Max size: 5MB per file.",
    },
    {
      name: "notes",
      label: "Additional Notes",
      type: "rich-text-editor",
      placeholder: "Add any additional information about the documents",
      optional: true,
    },
  ];

  // Handle form submission
  const handleSubmit = async ({ values }) => {
    console.log("File upload form submitted with values:", values);

    // In a real app, you would send the files to the server
    const fileNames = values.documents
      ? Array.isArray(values.documents)
        ? values.documents.map((file) => file.name).join(", ")
        : values.documents.name
      : "No files";

    alert(
      `Form submitted successfully!\nName: ${values.name}\nDocument Type: ${values.documentType}\nFiles: ${fileNames}`
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Document Upload Form</h2>
      <DynamicForm
        controllers={controllers}
        formSchema={formSchema}
        handleSubmit={handleSubmit}
        submitBtn={{ label: "Upload Documents" }}
      />
    </div>
  );
};

export default FileUploadForm;
