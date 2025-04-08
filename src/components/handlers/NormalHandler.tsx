import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormControllerProps, PropsPropsType } from "../../types";
import FormElementHandler from "../FormElementHandler";
import { filterVisibleControllers, cn } from "../../utils";

type NormalHandlerProps = {
  props?: PropsPropsType;
  controllers?: FormControllerProps[];
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
};

/**
 * NormalHandler - Manages the form controllers in a regular (non-step) form
 */
const NormalHandler: React.FC<NormalHandlerProps> = ({
  props,
  controllers,
  form,
}) => {
  const [controllersState, setControllersState] = useState<
    FormControllerProps[]
  >([]);

  // Update controllers based on visibility conditions and form values
  useEffect(() => {
    const filteredControllers = filterVisibleControllers(
      controllers || [],
      form.getValues()
    );
    setControllersState(filteredControllers);
  }, [controllers, form]);

  return (
    <div
      className={cn("space-y-4", props?.controllerBase?.className)}
      {...(props?.controllerBase || {})}
    >
      {controllersState.map((controller, index) => {
        // Handle group controllers (controllers grouped under a heading)
        if (controller.groupControllers) {
          return (
            <div
              key={`${index}-${controller?.groupName || controller?.type}`}
              className={cn("mt-6", controller?.className)}
            >
              {controller?.groupName && (
                <h3 className="text-lg font-medium mb-3 capitalize">
                  {controller.groupName}
                </h3>
              )}
              <div
                className={cn(
                  "space-y-4",
                  props?.groupcontrollerBase?.className
                )}
                {...(props?.groupcontrollerBase || {})}
              >
                {controller?.groupControllers?.map(
                  (groupController, groupIndex) => (
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

        // Regular form controllers
        return (
          <FormElementHandler
            key={`${index}-${controller?.name}`}
            controller={controller}
            form={form}
            props={props}
          />
        );
      })}
    </div>
  );
};

export default NormalHandler;
