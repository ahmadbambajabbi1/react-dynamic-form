import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DynamicFormProps, ModalType, SUCCESSTYPE } from "./types";

import {
  initializeDefaultValues,
  initializeDefaultValuesFromSteps,
  cn,
} from "./utils";

import NormalHandler from "./components/handlers/NormalHandler";
import StepsHandler from "./components/handlers/StepsHandler";
import OttpInputHandler from "./components/OttpInputHandler";
import Axios from "./utils/axiosConfig";

// Verification constants
const VERIFICATION_DATA_LOCASTORAGE_NAME = "verification_data";
const VERIFICATION_VERIFY_NAME = "verification_status";

/**
 * DynamicForm - A flexible form component that supports various input types and validations
 */
const DynamicForm = <T extends z.ZodType<any, any>>({
  controllers,
  formSchema,
  handleSubmit,
  apiOptions = {
    method: "POST",
    api: "",
  },
  tricker,
  props,
  modalComponenet,
  steps,
  formtype = "normal",
  stepPreview,
  submitBtn,
}: DynamicFormProps<T>) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [verifyingData, setVerifyingData] = useState<any>(null);
  const [verify, setVerify] = useState(false);
  const [modal, setModal] = useState<ModalType>({
    open: false,
    data: [],
  });

  // Check for verification data in localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getVerificaionFromLocalStorage = localStorage.getItem(
        VERIFICATION_VERIFY_NAME
      );
      if (getVerificaionFromLocalStorage) {
        setVerify(JSON.parse(getVerificaionFromLocalStorage));
      }
    }
  }, []);

  // Initialize form with default values
  const form = useForm<z.infer<any>>({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    defaultValues:
      formtype === "steper"
        ? initializeDefaultValuesFromSteps(steps || [])
        : initializeDefaultValues(controllers || []),
  });

  // Form submission handler
  async function onSubmit(values: z.infer<any>) {
    console.log({ values });
    const { setError, reset } = form;

    if (handleSubmit) {
      setSubmitLoading(true);
      try {
        await handleSubmit({ values, setError, reset });
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setSubmitLoading(false);
      }
      return;
    }

    // If no custom handleSubmit provided and not in verification mode
    if (!handleSubmit && !verify) {
      setSubmitLoading(true);
      try {
        // Use Axios for API submission
        type HttpMethod = "get" | "post" | "put" | "delete";
        const method =
          (apiOptions?.method?.toLowerCase() as HttpMethod) || "post";
        const res = await Axios[method](
          apiOptions?.api as string,
          values,
          apiOptions?.options
        );

        // Simulated success response handling
        if (res?.status >= 200 && res.status <= 299) {
          // Handle verification flow if needed
          if (res?.data?.action === SUCCESSTYPE.VERIFIED) {
            localStorage.setItem(
              VERIFICATION_DATA_LOCASTORAGE_NAME,
              JSON.stringify(res?.data?.data)
            );
            localStorage.setItem(
              VERIFICATION_VERIFY_NAME,
              JSON.stringify(true)
            );
            setVerifyingData(res?.data?.data);
            setVerify(true);
          }

          // Call onFinish callback if provided
          if (
            apiOptions?.onFinish &&
            res?.data?.action !== SUCCESSTYPE.VERIFIED
          ) {
            apiOptions?.onFinish(res?.data);
          }

          reset();
        }
      } catch (error) {
        console.error("API submission error:", error);
        // Handle form errors
        // This would need to be adapted to your error handler implementation
      } finally {
        setSubmitLoading(false);
      }
    }
  }

  // If in verify mode, show the OTP input handler
  if (verify) {
    return (
      <OttpInputHandler
        apiOptions={apiOptions}
        verifyingDataProps={verifyingData}
      />
    );
  }

  // Normal form rendering
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      {...(props?.form ? props.form : {})}
      className={cn("space-y-4", props?.form?.className)}
    >
      {formtype === "steper" ? (
        <StepsHandler
          form={form}
          props={props}
          steps={steps}
          stepPreview={stepPreview}
        />
      ) : (
        <NormalHandler controllers={controllers} props={props} form={form} />
      )}

      {!verify &&
        (tricker ? (
          tricker({ submitLoading, isValid: form.formState.isValid })
        ) : (
          <button
            className={cn(
              "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 capitalize",
              submitBtn?.className
            )}
            {...(submitBtn || {})}
            type={
              (submitBtn?.type as "reset" | "button" | "submit") || "submit"
            }
            disabled={submitLoading || (submitBtn?.disabled as boolean)}
          >
            {submitLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : submitBtn?.label ? (
              submitBtn?.label
            ) : (
              "Submit"
            )}
          </button>
        ))}

      {modal.open && modalComponenet && modalComponenet(modal, setModal)}
    </form>
  );
};

export default DynamicForm;
