import React, { useState } from "react";
import BasicForm from "./forms/BasicForm";
import MultiStepForm from "./forms/MultiStepForm";
import ValidationForm from "./forms/ValidationForm";
import FileUploadForm from "./forms/FileUploadForm";
import { DynamicFormWithSelectExample } from "./forms/DynamicFormWithSelectExample";

type FormExample = "basic" | "multistep" | "validation" | "fileupload";

const App: React.FC = () => {
  const [activeExample, setActiveExample] = useState<FormExample>("basic");

  const renderForm = () => {
    switch (activeExample) {
      case "basic":
        return <BasicForm />;
      case "multistep":
        return <MultiStepForm />;
      case "validation":
        return <ValidationForm />;
      case "fileupload":
        return <FileUploadForm />;
      default:
        return <BasicForm />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        React Dynamic Form Builder Examples
      </h1>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveExample("basic")}
          className={`px-4 py-2 rounded-md ${
            activeExample === "basic"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Basic Form
        </button>
        <button
          onClick={() => setActiveExample("multistep")}
          className={`px-4 py-2 rounded-md ${
            activeExample === "multistep"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Multi-Step Form
        </button>
        <button
          onClick={() => setActiveExample("validation")}
          className={`px-4 py-2 rounded-md ${
            activeExample === "validation"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Validation Form
        </button>
        <button
          onClick={() => setActiveExample("fileupload")}
          className={`px-4 py-2 rounded-md ${
            activeExample === "fileupload"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          File Upload
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">{renderForm()}</div>
    </div>
  );
};

export default App;
