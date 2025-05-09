// src/contexts/toast-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { cn } from "../utils";

// Toast types
export type ToastType = "success" | "error" | "warning" | "info";

// Toast interface
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

// Context interface
interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// Create context with default values
const ToastContext = createContext<ToastContextType>({
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
});

// Individual toast component
const ToastElement: React.FC<{
  toast: ToastItem;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const { id, message, type } = toast;

  const colors = {
    success: "bg-green-500 border-l-4 border-green-700",
    error: "bg-red-500 border-l-4 border-red-700",
    warning: "bg-amber-500 border-l-4 border-amber-700",
    info: "bg-blue-500 border-l-4 border-blue-700",
  };

  // Icon for each toast type
  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 flex-shrink-0"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case "error":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 flex-shrink-0"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        );
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 flex-shrink-0"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case "info":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-start p-3 mb-2 rounded shadow-lg text-white min-w-[200px] max-w-md",
        colors[type],
        "animate-toast-in"
      )}
      style={{
        animationDuration: "0.3s",
        animationFillMode: "forwards",
      }}
    >
      <div className="mr-2 mt-0.5">{getIcon()}</div>
      <div className="flex-grow overflow-hidden">
        <p className="line-clamp-3 text-sm">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-2 p-1 rounded-full hover:bg-white/20 flex-shrink-0 h-5 w-5 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

// Toast Provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Add styles to document head once
  React.useEffect(() => {
    const styleId = "toast-animations";

    // Check if style already exists
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = `
        @keyframes toastIn {
          from { 
            transform: translateX(100%);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes toastOut {
          from { 
            transform: translateX(0);
            opacity: 1;
          }
          to { 
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-toast-in {
          animation: toastIn 0.3s ease-out;
        }
        .animate-toast-out {
          animation: toastOut 0.3s ease-in;
        }
        /* Add line-clamp utility if not available in your Tailwind config */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `;
      document.head.appendChild(styleElement);
    }

    return () => {
      // Only remove in development to prevent issues with hot reloading
      if (process.env.NODE_ENV === "development") {
        const element = document.getElementById(styleId);
        if (element) element.remove();
      }
    };
  }, []);

  // Add toast to the list
  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 3000);
  }, []);

  // Remove toast from the list
  const dismissToast = useCallback((id: string) => {
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  // Toast type methods
  const success = useCallback(
    (message: string) => addToast(message, "success"),
    [addToast]
  );
  const error = useCallback(
    (message: string) => addToast(message, "error"),
    [addToast]
  );
  const warning = useCallback(
    (message: string) => addToast(message, "warning"),
    [addToast]
  );
  const info = useCallback(
    (message: string) => addToast(message, "info"),
    [addToast]
  );

  // Toast context value
  const contextValue = {
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast container - fixed at top right */}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col items-end"
        style={{ pointerEvents: "none" }}
      >
        <div style={{ pointerEvents: "auto" }}>
          {toasts.map((toast) => (
            <ToastElement key={toast.id} toast={toast} onClose={dismissToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export function useToast() {
  return useContext(ToastContext);
}

export default ToastProvider;
