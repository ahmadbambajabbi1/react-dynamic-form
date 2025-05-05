// src/components/RichTextEditor/index.tsx
import React from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Controller } from "../../types";
import SimpleEditor from "./SimpleEditor";

interface RichTextEditorControllerProps {
  field: ControllerRenderProps<any, any>;
  controller: Controller;
  form: UseFormReturn<any, any, undefined>;
}

/**
 * RichTextEditorController - Wrapper for rich text editor component
 */
const RichTextEditorController: React.FC<RichTextEditorControllerProps> = ({
  field,
  controller,
  form,
}) => {
  return (
    <SimpleEditor
      value={field.value || ""}
      onChange={(content: string) => {
        // Update form value when content changes
        form.setValue(controller.name as string, content, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }}
      placeholder={controller.placeholder || "Start typing..."}
    />
  );
};

export default RichTextEditorController;
