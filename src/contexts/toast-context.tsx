"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { cn } from "../utils";
import { XIcon } from "../icons/XIcon";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: (message: string) => console.log(`Success: ${message}`),
      error: (message: string) => console.log(`Error: ${message}`),
      warning: (message: string) => console.log(`Warning: ${message}`),
      info: (message: string) => console.log(`Info: ${message}`),
    };
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const createToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => createToast(message, "success"),
    [createToast]
  );
  const error = useCallback(
    (message: string) => createToast(message, "error"),
    [createToast]
  );
  const warning = useCallback(
    (message: string) => createToast(message, "warning"),
    [createToast]
  );
  const info = useCallback(
    (message: string) => createToast(message, "info"),
    [createToast]
  );

  const contextValue = {
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const toastClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between w-72 py-3 px-4 rounded shadow-md animate-slide-in",
        toastClasses[type]
      )}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close toast"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ToastProvider;
