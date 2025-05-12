import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Controller } from "../types";
import {
  UseFormReturn,
  useWatch,
  FieldValues,
  Control,
  ControllerRenderProps,
  UseFormRegisterReturn,
} from "react-hook-form";
import { z } from "zod";
import { cn, generateFieldId } from "../utils";

import { SelectController } from "./SelectController";
import TextareaController from "./TextareaController";
import CheckBoxController from "./CheckBoxController";
import DefaultInputController from "./DefaultInputController";
import MultiSelectController from "./MultiSelectController";
import SearchableSelectController from "./SearchableISelectController";
import FileUploadHandler from "./FileUploadHandler";
import RichTextEditorController from "./RichTextEditor";
import DateHandler from "./DateHandler";
import PhoneNumberController from "./PhoneNumber/PhoneNumberController";

type FormElementHandlerProps = {
  controller: Controller;
  form: UseFormReturn<any, any>;
  props?: any;
};

const FormElementHandler: React.FC<FormElementHandlerProps> = ({
  controller,
  form,
  props,
}) => {
  const selectedValues = useWatch({
    control: form.control,
    name: controller.name || "",
  });

  const [mappedControllers, setMappedControllers] = useState<Controller[]>([]);

  const fieldId = useMemo(
    () => generateFieldId(controller.name),
    [controller.name]
  );

  const fetchMappedControllers = useCallback(async () => {
    if (
      controller.mapController &&
      typeof controller.mapController === "function" &&
      selectedValues !== undefined &&
      selectedValues !== null &&
      selectedValues !== ""
    ) {
      try {
        const newControllers = await controller.mapController(
          selectedValues,
          form?.getValues()
        );
        setMappedControllers(newControllers);
      } catch (error) {
        console.error("Error mapping controllers:", error);
        setMappedControllers([]);
      }
    } else {
      setMappedControllers([]);
    }
  }, [controller.mapController, selectedValues]);

  useEffect(() => {
    fetchMappedControllers();
  }, [fetchMappedControllers]);

  const renderField = useCallback(() => {
    if (controller.type === "react-node" && controller.reactNode) {
      return controller.reactNode;
    }

    if (!form.register || !form.control) {
      return null;
    }

    const field: ControllerRenderProps = {
      ...form.register(controller.name || ""),
      value: form.getValues(controller.name || ""),
      onChange: (event) => {
        form.setValue(controller.name || "", event?.target?.value || event);
      },
      onBlur: () => {},
    };

    switch (controller.type) {
      case "phone-number":
        return (
          <PhoneNumberController
            controller={controller}
            field={field}
            form={form}
          />
        );

      case "date":
        return <DateHandler controller={controller} field={field} />;

      case "select":
      case "select-from-api":
      case "searchable-select":
      case "searchable-select-from-api":
        return (
          <SelectController
            controller={{
              ...controller,
              label: undefined,
              showError: false,
            }}
            field={field}
            form={form}
          />
        );

      case "multi-select":
      case "multi-select-from-api":
      case "searchable-multi-select":
      case "searchable-multi-select-from-api":
        return (
          <MultiSelectController
            controller={{
              ...controller,
              label: undefined,
              showError: false,
            }}
            field={field}
            form={form}
          />
        );

      case "textarea":
        return (
          <TextareaController
            controller={controller}
            field={field}
            name={controller.name || ""}
            form={form}
          />
        );

      case "group-checkbox":
        return controller?.groupCheckbox?.map((checkbox: any, index: any) => (
          <React.Fragment key={`${index}-${checkbox?.label}-${checkbox?.name}`}>
            <label className="block mb-1 font-medium text-sm">
              {checkbox?.label || ""}
            </label>
            <CheckBoxController
              form={form}
              items={checkbox?.options !== "from-api" ? checkbox.options : []}
              baseClassName="flex flex-wrap gap-4"
              checkBoxController={checkbox}
              field={field}
              name={checkbox?.name}
              controller={controller}
              type={checkbox?.type}
              colSpan={checkbox?.colSpan}
              {...checkbox}
            />
          </React.Fragment>
        ));

      case "checkbox":
        return (
          <CheckBoxController
            form={form}
            checkBoxController={controller}
            field={field}
            name={controller.name || ""}
          />
        );

      case "rich-text-editor":
        return (
          <RichTextEditorController
            controller={controller}
            field={field}
            form={form}
          />
        );

      case "upload":
        return (
          <FileUploadHandler
            controller={controller}
            field={field}
            form={form}
          />
        );

      default:
        return (
          <DefaultInputController
            controller={controller}
            field={field}
            form={form}
          />
        );
    }
  }, [controller, form]);

  const hasError = Boolean(form.formState.errors[controller.name || ""]);
  const errorMessage =
    form.formState.errors[controller.name || ""]?.message?.toString();

  return (
    <>
      <div className={cn("form-element", controller.className)}>
        {controller.type !== "group-checkbox" && controller.label && (
          <label
            htmlFor={fieldId}
            className={cn(
              "block text-sm font-medium mb-1",
              controller.labelProps?.className
            )}
            {...(controller.labelProps || {})}
          >
            <span className="flex items-center justify-between">
              <span>
                {controller.label}
                {controller.label && !controller.optional && (
                  <span className="text-red-600 ml-1">*</span>
                )}
                {controller.label && controller.optional && (
                  <span className="text-gray-500 text-xs ml-1">(optional)</span>
                )}
              </span>

              {controller.maximun && controller.type === "text" && (
                <span
                  className={cn(
                    "text-xs",
                    (selectedValues?.length || 0) > controller.maximun
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  {selectedValues?.length || 0}/{controller.maximun}
                </span>
              )}
            </span>
          </label>
        )}

        <div className="mt-1">
          {renderField()}

          {controller?.description && (
            <p className="mt-1 text-xs text-gray-500">
              {controller.description}
            </p>
          )}

          {hasError && (
            <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
          )}
        </div>
      </div>

      {mappedControllers?.length > 0 &&
        mappedControllers.map((mappedController, index) => {
          if (mappedController.groupControllers) {
            return (
              <div
                key={`${index}-${
                  mappedController?.groupName || mappedController?.type
                }`}
                className={mappedController?.className}
              >
                <p className="mt-4 mb-2 font-medium text-lg">
                  {mappedController?.groupName}
                </p>
                <div className="space-y-4" {...props?.groupcontrollerBase}>
                  {mappedController?.groupControllers?.map(
                    (groupController: any, groupIndex: any) => (
                      <FormElementHandler
                        key={`${index}-${groupIndex}-${groupController?.name}`}
                        controller={groupController}
                        form={form}
                        props={props}
                      />
                    )
                  )}
                </div>
              </div>
            );
          }
          return (
            <FormElementHandler
              key={`${index}-${mappedController?.name}`}
              controller={mappedController}
              form={form}
              props={props}
            />
          );
        })}
    </>
  );
};

export default React.memo(FormElementHandler);
