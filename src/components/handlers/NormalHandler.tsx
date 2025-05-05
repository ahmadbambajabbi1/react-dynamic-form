import React, { useEffect, useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Controller, PropsPropsType } from "../../types";
import FormElementHandler from "../FormElementHandler";
import { filterVisibleControllers, cn } from "../../utils";

type NormalHandlerProps = {
  props?: PropsPropsType;
  controllers?: Controller[];
  form: UseFormReturn<z.TypeOf<any>, any, undefined>;
};

const NormalHandler: React.FC<NormalHandlerProps> = ({
  props,
  controllers,
  form,
}) => {
  const [controllersState, setControllersState] = useState<Controller[]>([]);

  const updateControllers = useCallback(() => {
    const values = form.getValues();
    const filteredControllers = filterVisibleControllers(
      controllers || [],
      values
    );
    setControllersState(filteredControllers);
  }, [controllers, form]);
  useEffect(() => {
    updateControllers();
  }, [updateControllers]);
  useEffect(() => {
    const subscription = form.watch(() => {
      updateControllers();
    });

    return () => subscription.unsubscribe();
  }, [form, updateControllers]);

  return (
    <div
      className={cn("space-y-4", props?.controllerBase?.className)}
      {...(props?.controllerBase || {})}
    >
      {controllersState.map((controller, index) => {
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

export default React.memo(NormalHandler);
