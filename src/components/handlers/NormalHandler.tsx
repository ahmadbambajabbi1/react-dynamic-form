import React from "react";
import { Controller } from "react-hook-form";
import {
  Controller as ControllerType,
  ControllerType as ControllerTypeEnum,
} from "../../types";
import { cn } from "../../utils";
import {
  BasicSelectController,
  SearchableSelectController,
  SelectFromApiController,
  SearchableSelectFromApiController,
  MultiSelectController,
  SearchableMultiSelectController,
  MultiSelectFromApiController,
  SearchableMultiSelectFromApiController,
} from "../SelectController";
import TextFieldController from "../TextFieldController";
import TextareaController from "../TextareaController";
import CheckboxController from "../CheckBoxController";
import RadioController from "../RadioController";
import DateController from "../DateHandler/index";
import TimeController from "../TimeController";
import FileController from "../FileUploadHandler/index";
import PhoneController from "../PhoneNumber/PhoneNumberController";

interface NormalHandlerProps {
  controllers: ControllerType[];
  props?: any;
  form: any;
}

const NormalHandler: React.FC<NormalHandlerProps> = ({
  controllers,
  props,
  form,
}) => {
  const { control } = form;

  // Render the appropriate controller based on type
  const renderController = (controller: ControllerType) => {
    const {
      type,
      name,
      renderComponent,
      colSpan = 12,
      ...restControllerProps
    } = controller;

    // Handle custom component
    if (type === ControllerTypeEnum.CUSTOM && renderComponent) {
      return (
        <div
          key={name}
          className={cn(`col-span-${colSpan}`, props?.controller?.className)}
        >
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) =>
              renderComponent({
                field,
                fieldState,
                ...restControllerProps,
              })
            }
          />
        </div>
      );
    }
    if (type === ControllerTypeEnum.HIDDEN) {
      return (
        <Controller
          key={name}
          name={name}
          control={control}
          render={() => <></>}
        />
      );
    }
    return (
      <div
        key={name}
        className={cn(`col-span-${colSpan}`, props?.controller?.className)}
      >
        {renderStandardController(controller)}
      </div>
    );
  };

  const renderStandardController = (controller: ControllerType) => {
    const { type, name, ...restControllerProps } = controller;

    switch (type) {
      // Text input types
      case ControllerTypeEnum.TEXT:
      case ControllerTypeEnum.EMAIL:
      case ControllerTypeEnum.PASSWORD:
      case ControllerTypeEnum.NUMBER:
      case ControllerTypeEnum.URL:
      case ControllerTypeEnum.RANGE:
      case ControllerTypeEnum.COLOR:
        return (
          <TextFieldController
            name={name}
            type={type}
            {...restControllerProps}
          />
        );

      // Textarea
      case ControllerTypeEnum.TEXTAREA:
        return <TextareaController name={name} {...restControllerProps} />;

      // Checkbox
      case ControllerTypeEnum.CHECKBOX:
        return <CheckboxController name={name} {...restControllerProps} />;

      // Radio
      case ControllerTypeEnum.RADIO:
        return <RadioController name={name} {...restControllerProps} />;

      // Date and Time inputs
      case ControllerTypeEnum.DATE:
      case ControllerTypeEnum.TIME:
      case ControllerTypeEnum.DATETIME:
        return (
          <DateController name={name} type={type} {...restControllerProps} />
        );

      // File upload
      case ControllerTypeEnum.FILE:
        return <FileController name={name} {...restControllerProps} />;

      // Phone input
      case ControllerTypeEnum.PHONE:
        return <PhoneController name={name} {...restControllerProps} />;

      // All SELECT variants
      case ControllerTypeEnum.SELECT:
        return <BasicSelectController name={name} {...restControllerProps} />;

      case ControllerTypeEnum.SEARCHABLE_SELECT:
        return (
          <SearchableSelectController name={name} {...restControllerProps} />
        );

      case ControllerTypeEnum.SELECT_FROM_API:
        return <SelectFromApiController name={name} {...restControllerProps} />;

      case ControllerTypeEnum.SEARCHABLE_SELECT_FROM_API:
        return (
          <SearchableSelectFromApiController
            name={name}
            {...restControllerProps}
          />
        );

      case ControllerTypeEnum.MULTI_SELECT:
        return <MultiSelectController name={name} {...restControllerProps} />;

      case ControllerTypeEnum.SEARCHABLE_MULTI_SELECT:
        return (
          <SearchableMultiSelectController
            name={name}
            {...restControllerProps}
          />
        );

      case ControllerTypeEnum.MULTI_SELECT_FROM_API:
        return (
          <MultiSelectFromApiController name={name} {...restControllerProps} />
        );

      case ControllerTypeEnum.SEARCHABLE_MULTI_SELECT_FROM_API:
        return (
          <SearchableMultiSelectFromApiController
            name={name}
            {...restControllerProps}
          />
        );
      default:
        return <div>Unknown controller type: {type}</div>;
    }
  };

  return (
    <div className={cn("grid grid-cols-12 gap-4", props?.grid?.className)}>
      {controllers.map(renderController)}
    </div>
  );
};

export default NormalHandler;
