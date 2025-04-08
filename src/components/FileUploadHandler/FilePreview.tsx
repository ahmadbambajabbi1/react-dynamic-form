import React from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { FileWithPreview } from "../../types";
import { formatFileSize, getFileExtension, cn } from "../../utils";

type FilePreviewProps = {
  file: FileWithPreview;
  onRemove: () => void;
  displayMode: "grid" | "card" | "list";
};

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  displayMode = "grid",
}) => {
  const extension = getFileExtension(file.name);
  const isImage = /^(jpg|jpeg|png|gif|webp)$/i.test(extension);

  // Get the correct file icon style
  const getFileIconProps = () => {
    const ext = extension.toLowerCase();
    return {
      extension: ext,
      ...(ext in defaultStyles
        ? defaultStyles[ext as keyof typeof defaultStyles]
        : defaultStyles.txt),
    };
  };

  // Card display mode (for single file)
  if (displayMode === "card") {
    return (
      <div className="w-full border rounded-md overflow-hidden">
        <div className="flex items-center p-3">
          <div className="flex-shrink-0 w-12 h-12 mr-3">
            {isImage && file.preview ? (
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full">
                <FileIcon {...getFileIconProps()} />
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <p className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-2 p-1 rounded-full hover:bg-gray-100"
            aria-label="Remove file"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // List display mode (for inline display in forms)
  if (displayMode === "list") {
    return (
      <div className="flex items-center py-2 border-b">
        <div className="flex-shrink-0 w-6 h-6 mr-2">
          <FileIcon {...getFileIconProps()} />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-sm truncate" title={file.name}>
            {file.name}
          </p>
        </div>
        <div className="text-xs text-gray-500 mx-2">
          {formatFileSize(file.size)}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Remove file"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    );
  }

  // Grid display mode (default, for multiple files)
  return (
    <div className="border rounded-md p-3 flex flex-col">
      <div className="relative pb-3 mb-2 border-b">
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 p-1 rounded-full bg-white border shadow-sm"
          aria-label="Remove file"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>

        <div className="w-full h-24 flex items-center justify-center">
          {isImage && file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="w-16 h-16">
              <FileIcon {...getFileIconProps()} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-sm truncate font-medium" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
};

export default FilePreview;
