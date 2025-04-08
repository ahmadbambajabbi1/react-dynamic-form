// src/components/OttpInputHandler.tsx
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiOptionsType, SUCCESSTYPE } from "../types";
import { cn } from "../utils";

// Constants
const VERIFICATION_DATA_LOCASTORAGE_NAME = "verification_data";
const VERIFICATION_VERIFY_NAME = "verification_status";

// Validation schema
const formSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

type OttpInputHandlerProps = {
  verifyingDataProps: any;
  apiOptions: apiOptionsType;
};

/**
 * OttpInputHandler - Handles OTP verification
 */
const OttpInputHandler: React.FC<OttpInputHandlerProps> = ({
  verifyingDataProps,
  apiOptions,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [verifyingData, setVerifyingData] = useState<any>(verifyingDataProps);
  const [verify, setVerify] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  // Get verification data from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getVerificationDataFromLocalStorage = localStorage.getItem(
        VERIFICATION_DATA_LOCASTORAGE_NAME
      );
      if (getVerificationDataFromLocalStorage) {
        setVerifyingData(JSON.parse(getVerificationDataFromLocalStorage));
      }
    }
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (!verify) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [verify]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading(true);
    try {
      // Here you would normally submit to your API
      // For example:
      // const response = await fetch("/api/verify", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     code: values.code,
      //     ...verifyingData
      //   }),
      // });
      // const data = await response.json();

      // Mock response
      console.log("Would submit verification:", values.code);
      console.log("With verification data:", verifyingData);

      // Mock successful verification
      const mockResponse = {
        status: 200,
        data: {
          message: "Successfully verified",
          action: SUCCESSTYPE.VERIFIED,
          data: {
            verified: true,
            user: { id: "123", email: "user@example.com" },
          },
        },
      };

      // Handle successful verification
      if (mockResponse.status === 200) {
        if (mockResponse.data.action === SUCCESSTYPE.VERIFIED) {
          // Store verification data in localStorage
          localStorage.setItem(
            VERIFICATION_DATA_LOCASTORAGE_NAME,
            JSON.stringify(mockResponse.data.data)
          );
          localStorage.setItem(VERIFICATION_VERIFY_NAME, JSON.stringify(true));

          // Update state
          setVerifyingData(mockResponse.data.data);
          setVerify(true);

          // Call onFinish callback if provided
          if (apiOptions?.onFinish) {
            apiOptions.onFinish(mockResponse.data);
          }
        }

        form.reset();
      }
    } catch (error) {
      console.error("Verification error:", error);
      // Handle errors appropriately
      form.setError("code", {
        type: "manual",
        message: "Invalid verification code",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle input changes for OTP fields
  const handleInputChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^[0-9]*$/.test(value)) return;

    // Get current code value
    const currentCode = form.getValues().code || "";
    const codeArray = currentCode.split("");

    // Update the specific digit
    codeArray[index] = value;

    // Update form value
    const newCode = codeArray.join("");
    form.setValue("code", newCode, { shouldValidate: true });

    // Move focus to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      form.setValue("code", pastedData, { shouldValidate: true });

      // Set values in each input
      pastedData.split("").forEach((digit, index) => {
        if (inputRefs[index].current) {
          inputRefs[index].current!.value = digit;
        }
      });

      // Focus on last input
      inputRefs[5].current?.focus();
    }
  };

  // Handle key press for navigation between inputs
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      // If input is empty and backspace is pressed, move focus to previous input
      if (!e.currentTarget.getAttribute("value") && index > 0) {
        inputRefs[index - 1]?.current?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  // Handle resend code
  const handleResend = () => {
    if (!canResend) return;

    // Here you would call your API to resend the verification code
    console.log("Would resend verification code to:", verifyingData?.value);

    // Reset timer
    setTimeLeft(60);
    setCanResend(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Verification Required</h2>
        <p className="text-gray-600">
          Enter the verification code sent to{" "}
          <span className="font-medium">{verifyingData?.value || ""}</span>
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>

          {/* OTP Input */}
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={cn(
                  "w-12 h-12 text-center text-xl font-semibold border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  form.formState.errors.code
                    ? "border-red-500"
                    : "border-gray-300"
                )}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          {/* Error message */}
          {form.formState.errors.code && (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.code.message}
            </p>
          )}
        </div>

        {/* Resend code option */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={cn(
                "text-blue-600 font-medium",
                !canResend && "opacity-50 cursor-not-allowed"
              )}
            >
              {canResend ? "Resend code" : `Resend in ${timeLeft}s`}
            </button>
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitLoading}
          className={cn(
            "w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            submitLoading && "opacity-75 cursor-not-allowed"
          )}
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
              Verifying...
            </span>
          ) : (
            "Verify"
          )}
        </button>
      </form>
    </div>
  );
};

export default OttpInputHandler;
