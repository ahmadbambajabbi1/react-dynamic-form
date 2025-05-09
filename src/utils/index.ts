import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Controller } from "../types";

/**
 * Combines class names with Tailwind's merge function
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Initialize default values for a form based on controllers
 */
export const initializeDefaultValues = (
  controllers: Controller[]
): Record<string, any> => {
  return controllers.reduce((acc: Record<string, any>, controller) => {
    if ("groupControllers" in controller && controller.groupControllers) {
      controller.groupControllers.forEach((field: any) => {
        if (field.name) {
          acc[field.name] = field.defaultValue || "";
        }
      });
    } else {
      const field = controller as Controller;
      if (field.name) {
        acc[field.name] = field.defaultValue || "";
      }
    }
    return acc;
  }, {});
};

/**
 * Initialize default values for a form based on steps
 */
export const initializeDefaultValuesFromSteps = (
  steps: any[]
): Record<string, any> => {
  return steps.reduce((acc: Record<string, any>, step) => {
    step.controllers.forEach((controller: Controller) => {
      if ("groupControllers" in controller && controller.groupControllers) {
        controller.groupControllers.forEach((field: any) => {
          if (field.name) {
            acc[field.name] = field.defaultValue || "";
          }
        });
      } else {
        const field = controller as Controller;
        if (field.name) {
          acc[field.name] = field.defaultValue || "";
        }
      }
    });
    return acc;
  }, {});
};

/**
 * Filter controllers based on visibility condition
 */
export const filterVisibleControllers = (
  controllers: Controller[] | undefined,
  formValues: Record<string, any>
): Controller[] => {
  if (!controllers) return [];

  return controllers.filter((controller) => {
    const isVisible = (ctrl: Controller) => {
      if (ctrl.display !== undefined) {
        if (typeof ctrl.display === "function") {
          return ctrl.display(formValues);
        }
      }

      if (ctrl.visible !== undefined) {
        if (typeof ctrl.visible === "function") {
          return ctrl.visible(formValues);
        }
        return ctrl.visible !== false;
      }
      return true;
    };

    if (!isVisible(controller)) {
      return false;
    }

    if (controller.groupControllers) {
      controller.groupControllers = filterVisibleControllers(
        controller.groupControllers,
        formValues
      );
    }

    return true;
  });
};
/**
 * Generate field ID based on name and optional prefix
 */
export const generateFieldId = (name?: string, prefix = "field"): string => {
  if (!name) return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  return `${prefix}-${name}`;
};

/**
 * Parse file size to readable format
 */
export const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

/**
 * Default accepted file types for file upload
 */
export const DEFAULT_ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/msword": [".doc"],
  "application/vnd.ms-excel": [".xls"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "text/plain": [".txt"],
};

/**
 * Default max file size (5MB)
 */
export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024;
