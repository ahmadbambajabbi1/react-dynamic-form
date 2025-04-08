import React, { useRef, useState, useEffect, ChangeEvent } from "react";

interface SimpleEditorProps {
  onChange: (content: string) => void;
  value?: string;
  placeholder?: string;
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  onChange,
  value = "",
  placeholder = "Start typing...",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isEditorFocused, setIsEditorFocused] = useState<boolean>(false);

  useEffect(() => {
    // Set initial content
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleExecCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value as any);
    updateContentState();

    // Update format states
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));
  };

  const updateContentState = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const handleFocus = () => {
    setIsEditorFocused(true);
  };

  const handleBlur = () => {
    setIsEditorFocused(false);
  };

  const toggleBold = () => handleExecCommand("bold");
  const toggleItalic = () => handleExecCommand("italic");
  const toggleUnderline = () => handleExecCommand("underline");
  const alignLeft = () => handleExecCommand("justifyLeft");
  const alignCenter = () => handleExecCommand("justifyCenter");
  const alignRight = () => handleExecCommand("justifyRight");
  const createLink = () => {
    const url = prompt("Enter the URL:", "https://");
    if (url) {
      handleExecCommand("createLink", url);
    }
  };
  const removeFormat = () => handleExecCommand("removeFormat");
  const insertUnorderedList = () => handleExecCommand("insertUnorderedList");
  const insertOrderedList = () => handleExecCommand("insertOrderedList");

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800">
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={toggleBold}
          className={`p-1 rounded ${
            isBold
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          title="Bold"
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
          >
            <path d="M14 12a4 4 0 0 0 0-8H6v8" />
            <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={toggleItalic}
          className={`p-1 rounded ${
            isItalic
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          title="Italic"
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
          >
            <line x1="19" x2="10" y1="4" y2="4" />
            <line x1="14" x2="5" y1="20" y2="20" />
            <line x1="15" x2="9" y1="4" y2="20" />
          </svg>
        </button>

        <button
          type="button"
          onClick={toggleUnderline}
          className={`p-1 rounded ${
            isUnderline
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          title="Underline"
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
          >
            <path d="M6 4v6a6 6 0 0 0 12 0V4" />
            <line x1="4" x2="20" y1="20" y2="20" />
          </svg>
        </button>

        <div className="w-px h-6 mx-1 bg-gray-300 dark:bg-gray-600"></div>

        <button
          type="button"
          onClick={alignLeft}
          className="p-1 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Align Left"
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
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="13" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        </button>

        <button
          type="button"
          onClick={alignCenter}
          className="p-1 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Align Center"
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
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="8" x2="16" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        </button>

        <button
          type="button"
          onClick={alignRight}
          className="p-1 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Align Right"
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
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="11" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        </button>

        <div className="w-px h-6 mx-1 bg-gray-300 dark:bg-gray-600"></div>

        <button
          type="button"
          onClick={insertUnorderedList}
          className="p-1 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Bullet List"
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
          >
            <line x1="9" x2="21" y1="6" y2="6" />
            <line x1="9" x2="21" y1="12" y2="12" />
            <line x1="9" x2="21" y1="18" y2="18" />
            <circle cx="4" cy="6" r="1" />
            <circle cx="4" cy="12" r="1" />
            <circle cx="4" cy="18" r="1" />
          </svg>
        </button>

        <button
          type="button"
          onClick={insertOrderedList}
          className="p-1 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Numbered List"
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
          >
            <line x1="10" x2="21" y1="6" y2="6" />
            <line x1="10" x2="21" y1="12" y2="12" />
            <line x1="10" x2="21" y1="18" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </button>

        <button
          type="button"
          onClick={createLink}
          className="p-1 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Insert Link"
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
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>

        <button
          type="button"
          onClick={removeFormat}
          className="p-1 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Clear Formatting"
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
          >
            <path d="M7 21h10" />
            <path d="M12.22 16.83 9 8H7M16 8l-4 8H9M22 8l-1.33 4" />
          </svg>
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable="true"
        className={`p-3 min-h-[150px] max-h-[350px] overflow-y-auto focus:outline-none text-gray-900 dark:text-gray-100 ${
          !value && !isEditorFocused ? "empty-editor" : ""
        }`}
        style={
          {
            "--placeholder": `"${placeholder}"`,
          } as React.CSSProperties
        }
        onInput={updateContentState}
        onFocus={handleFocus}
        onBlur={handleBlur}
        suppressContentEditableWarning={true}
      ></div>

      <style>{`
  .empty-editor:before {
    content: var(--placeholder);
    color: #9ca3af;
    position: absolute;
    pointer-events: none;
  }

  @media (prefers-color-scheme: dark) {
    .empty-editor:before {
      color: #6b7280;
    }
  }
`}</style>
    </div>
  );
};

export default SimpleEditor;
