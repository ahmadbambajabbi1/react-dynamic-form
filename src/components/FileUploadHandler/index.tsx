import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Controller, FileWithPreview } from "../../types";
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
  controller: Controller;
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
};

const FileUploadHandler: React.FC<FileUploadProps> = ({
  controller,
  field,
  form,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const multiple = useMemo(
    () => (controller.multiple !== undefined ? controller.multiple : false),
    [controller.multiple]
  );

  const maxFiles = useMemo(
    () => controller.maxFiles || (multiple ? 4 : 1),
    [controller.maxFiles, multiple]
  );

  const acceptedFileTypes = useMemo(
    () => controller.acceptedFileTypes || DEFAULT_ACCEPTED_FILE_TYPES,
    [controller.acceptedFileTypes]
  );

  useEffect(() => {
    if (field.value && field.value.length > 0 && files.length === 0) {
      let filesWithPreviews: FileWithPreview[] = [];

      if (Array.isArray(field.value)) {
        filesWithPreviews = field.value.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      } else if (field.value instanceof File) {
        filesWithPreviews = [
          Object.assign(field.value, {
            preview: URL.createObjectURL(field.value),
          }),
        ];
      }

      setFiles(filesWithPreviews);
    }
  }, [field.value, files.length]);

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
        const file = acceptedFiles[0];
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        setFiles([fileWithPreview]);
        form.setValue(controller?.name || "file", fileWithPreview);
      } else {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const combinedFiles = multiple
          ? [...files, ...newFiles].slice(0, maxFiles)
          : [newFiles[0]];

        setFiles(combinedFiles);
        form.setValue(controller?.name || "files", combinedFiles);
      }
    },
    [files, multiple, maxFiles, form, controller?.name]
  );

  const removeFile = useCallback(
    (fileToRemove: FileWithPreview) => {
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const newFiles = files.filter((file) => file !== fileToRemove);
      setFiles(newFiles);

      if (multiple) {
        form.setValue(controller?.name || "files", newFiles);
      } else {
        form.setValue(
          controller?.name || "file",
          newFiles.length > 0 ? newFiles[0] : null
        );
      }
    },
    [files, multiple, form, controller?.name]
  );

  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes,
      maxFiles: maxFiles,
      multiple: multiple,
    });

  const renderFilePreviews = useCallback(() => {
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
  }, [files, multiple, removeFile]);

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

export default React.memo(FileUploadHandler);
