import React, { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
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
import { useCatchErrorHandler } from "./utils/error-handlers";
import ToastProvider, { useToast } from "./contexts/toast-context";

const VERIFICATION_DATA_LOCASTORAGE_NAME = "verification_data";
const VERIFICATION_VERIFY_NAME = "verification_status";

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
  const catchErrorHandler = useCatchErrorHandler();
  const toast = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [verifyingData, setVerifyingData] = useState<any>(null);
  const [verify, setVerify] = useState(false);
  const [modal, setModal] = useState<ModalType>({
    open: false,
    data: [],
  });

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

  const defaultValues = useMemo(() => {
    return formtype === "steper"
      ? initializeDefaultValuesFromSteps(steps || [])
      : initializeDefaultValues(controllers || []);
  }, [formtype, steps, controllers]);

  const form = useForm<z.infer<any>>({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    defaultValues,
  });

  async function onSubmit(values: z.infer<any>) {
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
    if (!handleSubmit && !verify) {
      setSubmitLoading(true);
      try {
        type HttpMethod = "get" | "post" | "put" | "delete";
        const method =
          (apiOptions?.method?.toLowerCase() as HttpMethod) || "post";
        const res = await Axios[method](
          apiOptions?.api as string,
          values,
          apiOptions?.options
        );

        if (res?.status >= 200 && res.status <= 299) {
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

          if (
            apiOptions?.onFinish &&
            res?.data?.action !== SUCCESSTYPE.VERIFIED
          ) {
            apiOptions?.onFinish(res?.data);
          }
          reset();
        }
      } catch (error) {
        catchErrorHandler(error, (data, type) => {
          if (type === "form") {
            if (Array.isArray(data)) {
              data.map((dt) => {
                setError(dt?.path[0], {
                  type: "manual",
                  message: dt?.message,
                });
              });
            } else {
              setError(data?.path[0], {
                type: "manual",
                message: data?.message,
              });
            }
          }
          if (type === "modal") {
            setModal({
              open: true,
              data: data,
            });
          }
          if (apiOptions?.errorHandler) {
            apiOptions?.errorHandler(data, type as any);
          }
        });
      } finally {
        setSubmitLoading(false);
      }
    }
  }

  if (verify) {
    return (
      <OttpInputHandler
        apiOptions={apiOptions as any}
        verifyingDataProps={verifyingData}
      />
    );
  }

  return (
    <ToastProvider>
      <FormProvider {...form}>
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
              stepPreview={stepPreview as any}
            />
          ) : (
            <NormalHandler
              controllers={controllers as any}
              props={props}
              form={form}
            />
          )}

          {!verify &&
            (tricker ? (
              tricker({ submitLoading, isValid: form.formState.isValid })
            ) : (
              <button
                className={cn(
                  "px-4 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed capitalize",
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
        <button
          onClick={() => {
            toast.error("somethinf happs hapens");
            console.log("clickked");
          }}
        >
          toast
        </button>
      </FormProvider>
    </ToastProvider>
  );
};

export default React.memo(DynamicForm);
