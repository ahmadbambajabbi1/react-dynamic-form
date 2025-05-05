// src/components/handlers/StepsHandler.tsx
import React, { ReactNode, useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { PropsPropsType, StepsType } from "../../types";
import NormalHandler from "./NormalHandler";
import { cn } from "../../utils";

type StepsHandlerProps = {
  steps?: StepsType<any>[];
  props?: PropsPropsType;
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
  stepPreview?: (value: any) => ReactNode;
};

/**
 * StepsHandler - Manages multi-step forms
 */
const StepsHandler: React.FC<StepsHandlerProps> = ({
  steps,
  form,
  props,
  stepPreview,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeSchema, setActiveSchema] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update schema when active step changes
  useEffect(() => {
    const currentStep = steps && steps[activeStep];
    if (currentStep?.stepSchema) {
      setActiveSchema(currentStep.stepSchema);
    } else {
      setActiveSchema(null);
    }
  }, [activeStep, steps]);

  // Handle next button click
  const handleNext = () => {
    // If there's an active schema, validate the current step
    if (activeSchema) {
      try {
        // Parse form values with the current step schema
        const result = activeSchema.safeParse(form.getValues());

        if (result.success) {
          // If validation succeeds, move to next step
          setActiveStep((prevStep) => prevStep + 1);
          setErrors({});
        } else {
          // If validation fails, display errors and don't proceed
          const formattedErrors: Record<string, string> = {};

          result.error.issues.forEach((issue: z.ZodIssue) => {
            const path = issue.path[0] as string;
            formattedErrors[path] = issue.message;

            // Set form errors
            form.setError(path, {
              type: "manual",
              message: issue.message,
            });
          });

          setErrors(formattedErrors);
        }
      } catch (error) {
        console.error("Error validating step:", error);
      }
    } else {
      // If no schema, just proceed to next step
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Handle back button click
  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(0, prevStep - 1));
    setErrors({});
  };

  // Determine if this is the final step
  const isFinalStep = steps ? activeStep === steps.length : false;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Step indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps &&
            steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <div
                  key={`step-${index}`}
                  className="flex flex-col items-center relative"
                >
                  {/* Step bar connecting the steps */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute w-full h-1 top-4 left-1/2",
                        isCompleted ? "bg-black" : "bg-gray-200"
                      )}
                      style={{ width: "calc(100% - 2rem)" }}
                    />
                  )}

                  {/* Step indicator */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10",
                      isActive
                        ? "bg-black text-white"
                        : isCompleted
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {isCompleted ? (
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
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step label */}
                  <div
                    className={cn(
                      "mt-2 text-sm",
                      isActive
                        ? "text-black font-medium"
                        : isCompleted
                        ? "text-gray-700"
                        : "text-gray-500"
                    )}
                  >
                    {step.stepName || `Step ${index + 1}`}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Step content */}
      <div className="mb-6">
        {isFinalStep ? (
          // Final step preview
          <div className="bg-gray-50 rounded-lg p-6 border">
            <h3 className="text-lg font-medium mb-4">
              Review Your Information
            </h3>
            {stepPreview ? (
              stepPreview(form.getValues())
            ) : (
              <pre className="bg-white p-4 rounded border overflow-auto max-h-60">
                {JSON.stringify(form.getValues(), null, 2)}
              </pre>
            )}
          </div>
        ) : (
          // Current step form
          <div>
            <h3 className="text-lg font-medium mb-4">
              {steps && steps[activeStep]?.stepName
                ? steps[activeStep].stepName
                : `Step ${activeStep + 1}`}
            </h3>
            <NormalHandler
              controllers={steps && (steps[activeStep]?.controllers as any)}
              form={form}
              props={props}
            />
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={handleBack}
          disabled={activeStep === 0}
          className={cn(
            "px-4 py-2 rounded-md",
            activeStep === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          )}
        >
          Back
        </button>

        {isFinalStep ? (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default StepsHandler;
