import { useToast } from "../contexts/toast-context";
export enum ERRORTYPE {
  TOAST = "toast",
  FORM = "form",
  DISPLAY = "display",
  MODAL = "modal",
  AUTHENTICATION = "authentication_error",
  NOT_ALLOWED = "not_allowed",
  FORBIDEN = "forbiden",
  NOT_PERMIT = "not_permit",
}
export type errorHandlertType =
  | "auth"
  | "display"
  | "forbiden"
  | "modal"
  | "form"
  | "not_allowed"
  | "not_permit"
  | "toast";
function useCatchErrorHandler() {
  const toast = useToast();

  const catchErrorHandler = (
    error: any,
    onAction?: (data: any, type: errorHandlertType) => void
  ) => {
    const response: { type: errorHandlertType } = { type: "toast" };
    try {
      const action = error?.response?.data?.action;
      const message = error?.response?.data?.message;
      const errorData = error?.response?.data?.error;
      const DisplayData = error?.response?.data?.data;

      if (action === ERRORTYPE.AUTHENTICATION) {
        // toast({
        //   title: "Authentication Error:",
        //   description: message,
        // });
        toast.error(message);
        response.type = "auth";
        return response;
      } else if (action === ERRORTYPE.DISPLAY) {
        if (onAction) {
          onAction(DisplayData, "display");
        }
      } else if (action === ERRORTYPE.FORBIDEN) {
        // toast({
        //   title: "Forbiden:",
        //   description: message,
        // });
        toast.warning(message);
        response.type = "forbiden";
        return response;
      } else if (action === ERRORTYPE.FORM) {
        if (onAction) {
          return onAction(errorData, "form");
        }
      } else if (action === ERRORTYPE.MODAL) {
        if (onAction) {
          return onAction(DisplayData, "modal");
        }
      } else if (action === ERRORTYPE.NOT_ALLOWED) {
        // toast({
        //   title: "Your Are Not Allowed:",
        //   description: message,
        // });
        toast.info(message);
        response.type = "not_allowed";
        return response;
      } else if (action === ERRORTYPE.NOT_PERMIT) {
        // toast({
        //   title: "Not Permit:",
        //   description: message,
        // });
        toast.info(message);
        response.type = "not_permit";
        return response;
      } else if (action === ERRORTYPE.TOAST) {
        // return toast({
        //   title: "Error:",
        //   description: message,
        // });
        toast.error(message);
        response.type = "toast";
        return response;
      }
    } catch (error) {
      console.error("Error in catchErrorHandler");
    }
  };

  return catchErrorHandler;
}

export { useCatchErrorHandler };
