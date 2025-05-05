// Main entry point for the package
import DynamicForm from "./DynamicForm";
import { initConfig } from "./utils/axiosConfig";

// Export component types
export type {
  DynamicFormProps,
  StepsType,
  apiOptionsType,
  PropsPropsType,
  errorHandlertType,
  FileWithPreview,
  ControllerType,
} from "./types";

// Export utility functions
export {
  initializeDefaultValues,
  initializeDefaultValuesFromSteps,
  filterVisibleControllers,
  formatFileSize,
  getFileExtension,
  DEFAULT_ACCEPTED_FILE_TYPES,
  DEFAULT_MAX_FILE_SIZE,
} from "./utils";

// Export the main component
export { DynamicForm, initConfig };
export default DynamicForm;
