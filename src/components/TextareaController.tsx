// src/components/TextareaController.tsx
import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { FormControllerProps } from "../types";
import { cn } from "../utils";

type TextareaControllerProps = {
  field: ControllerRenderProps<z.TypeOf<any>, any>;
  controller: FormControllerProps;
};

/**
 * TextareaController - Handles multiline text input
 */
const TextareaController: React.FC<TextareaControllerProps> = ({
  controller,
  field,
}) => {
  return (
    <textarea
      {...field}
      placeholder={controller.placeholder}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]",
        controller.className
      )}
      rows={controller.rows || 4}
    />
  );
};

export default TextareaController;
