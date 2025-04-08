import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { FormControllerProps, FileWithPreview } from "../../types";
import { z } from "zod";
import {
  DEFAULT_ACCEPTED_FILE_TYPES,
  formatFileSize,
  getFileExtension,
  cn,
} from "../../utils";
import FilePreview from "./FilePreview";

type FileUploadProps = {
  field: ControllerRenderProps<z.TypeOf<any>, any>;
  controller: FormControllerProps;
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
};

const FileUploadHandler: React.FC<FileUploadProps> = ({
  controller,
  field,
  form,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  // Default to single file upload if not specified
  const multiple =
    controller.multiple !== undefined ? controller.multiple : false;
  const maxFiles = controller.maxFiles || (multiple ? 4 : 1);
  const acceptedFileTypes =
    controller.acceptedFileTypes || DEFAULT_ACCEPTED_FILE_TYPES;

  // Initialize files from field value if present
  useEffect(() => {
    if (field.value && field.value.length > 0 && files.length === 0) {
      // If the field has value but no previews, try to create previews
      // This would happen if the form is pre-filled
      if (Array.isArray(field.value)) {
        const filesWithPreviews = field.value.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setFiles(filesWithPreviews);
      } else if (field.value instanceof File) {
        // Handle single file case
        const fileWithPreview = Object.assign(field.value, {
          preview: URL.createObjectURL(field.value),
        });
        setFiles([fileWithPreview]);
      }
    }
  }, [field.value]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!multiple && acceptedFiles.length > 0) {
        // For single file upload, just take the first file
        const file = acceptedFiles[0];
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        setFiles([fileWithPreview]);
        form.setValue(controller?.name || "file", fileWithPreview);
      } else {
        // For multiple file uploads
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const combinedFiles = multiple
          ? [...files, ...newFiles].slice(0, maxFiles)
          : [newFiles[0]]; // Ensure we only keep one file for single mode

        setFiles(combinedFiles);
        form.setValue(controller?.name || "files", combinedFiles);
      }
    },
    [files, multiple, maxFiles, form, controller?.name]
  );

  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes,
      maxFiles: maxFiles,
      multiple: multiple,
    });

  const removeFile = (fileToRemove: FileWithPreview) => {
    // Clean up the preview URL
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const newFiles = files.filter((file) => file !== fileToRemove);
    setFiles(newFiles);

    // Update form value
    if (multiple) {
      form.setValue(controller?.name || "files", newFiles);
    } else {
      form.setValue(
        controller?.name || "file",
        newFiles.length > 0 ? newFiles[0] : null
      );
    }
  };

  // Render file previews based on whether single or multiple files
  const renderFilePreviews = () => {
    if (files.length === 0) return null;

    return (
      <div
        className={cn(
          "mt-4",
          multiple
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "w-full"
        )}
      >
        {files.map((file, index) => (
          <FilePreview
            key={`${file.name}-${index}`}
            file={file}
            onRemove={() => removeFile(file)}
            displayMode={multiple ? "grid" : "card"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-4 text-center cursor-pointer rounded-md transition-colors duration-200",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400",
          controller.className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400 mb-2"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M12 12v9"></path>
            <path d="m16 16-4-4-4 4"></path>
          </svg>

          <p className="mb-1 font-medium">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here or click to browse"}
          </p>

          <p className="text-sm text-gray-500">
            {multiple
              ? `Upload up to ${maxFiles} files`
              : "Upload a single file"}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Supported formats:{" "}
            {Object.values(acceptedFileTypes).flat().join(", ")}
          </p>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-2 text-red-500 text-sm">
          {fileRejections.map(({ file, errors }) => (
            <p key={file.name}>
              {file.name} - {errors.map((e) => e.message).join(", ")}
            </p>
          ))}
        </div>
      )}

      {renderFilePreviews()}

      {files.length > 0 && multiple && (
        <div className="mt-2 text-sm text-gray-500">
          {files.length} of {maxFiles} files selected
        </div>
      )}
    </div>
  );
};

export default FileUploadHandler;
