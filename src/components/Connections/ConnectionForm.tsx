import clsx from "clsx";
import { Form, Formik } from "formik";
import { mapValues, method } from "lodash";
import { useMemo } from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { Button } from "../../ui/Button";
import { Connection } from "./ConnectionFormModal";
import RenderConnectionFormFields from "./RenderConnectionFormFields";
import { ConnectionType, connectionTypes } from "./connectionTypes";

interface ConnectionFormProps {
  connectionType: ConnectionType;
  onConnectionSubmit?: (data: Connection) => void;
  onConnectionDelete?: (data: Connection) => void;
  className?: string;
  formValue?: Connection;
  handleBack?: () => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

export function ConnectionForm({
  connectionType,
  formValue,
  onConnectionSubmit,
  onConnectionDelete,
  className,
  handleBack = () => {},
  isSubmitting = false,
  isDeleting = false,
  ...props
}: ConnectionFormProps) {
  const handleSubmit = (value: any) => {
    onConnectionSubmit?.({
      ...convertData(value),
      type: connectionType.value
    });
  };

  const formInitialValue = useMemo(() => {
    const connection = connectionTypes.find(
      (item) => item.value === connectionType.value
    );
    if (connection) {
      // if formValue is undefined, return default values, otherwise return
      // formValue
      if (!formValue) {
        return (
          connection.fields
            // if field is group field, return fields inside group field
            .flatMap((field) => {
              if (field.groupFieldProps?.fields) {
                return field.groupFieldProps.fields;
              }
              return field;
            })
            .reduce((acc, field) => {
              acc[field.key] = field.default;
              return acc;
            }, {} as Record<string, any>)
        );
      }
      const res = connection.convertToFormSpecificValue
        ? connection.convertToFormSpecificValue(formValue as any)
        : formValue;
      return {
        ...res,
        namespace: res?.namespace ?? "default"
      };
    }
  }, [connectionType.value, formValue]);

  const convertData = (data: Connection) => {
    if (connectionType?.preSubmitConverter) {
      const x = connectionType.preSubmitConverter(data as any) as Connection;
      return {
        ...x,
        properties: mapValues(x.properties, method("toString"))
      };
    }
    const result: Record<string, string | undefined | boolean | number> = {};
    connectionType?.fields.forEach((field) => {
      result[field.key] =
        data[field.key as keyof Omit<Connection, "properties">]!;
    });
    return {
      ...result,
      name: data.name,
      properties: mapValues(data.properties, method("toString"))
    } as Connection;
  };

  const handleDelete = () => {
    onConnectionDelete?.(formValue!);
  };

  return (
    <Formik
      initialValues={{
        name: "",
        type: undefined,
        url: "",
        username: "",
        password: "",
        certificate: "",
        domain: "",
        region: "",
        profile: "",
        insecure_tls: false,
        namespace: "default",
        ...formInitialValue
      }}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="flex flex-col flex-1 overflow-y-auto">
          <div
            className={clsx(
              "flex flex-col flex-1 my-2 overflow-y-auto",
              className
            )}
            {...props}
          >
            <div className={clsx("flex flex-col px-2 mb-2")}>
              <div className="flex flex-col space-y-4 overflow-y-auto p-4">
                {connectionType.fields.map((field, index) => {
                  return (
                    <RenderConnectionFormFields field={field} key={field.key} />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center py-4 px-5 rounded-lg bg-gray-100">
            {Boolean(formValue?.id) && (
              <Button
                text="Delete"
                icon={<FaTrash />}
                onClick={handleDelete}
                className="btn-danger"
              />
            )}
            {connectionType && !Boolean(formValue?.id) && (
              <button
                className={clsx("btn-secondary-base btn-secondary")}
                type="button"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            <div className="flex flex-1 justify-end">
              <Button
                type="submit"
                icon={
                  isSubmitting ? (
                    <FaSpinner className="animate-spin" />
                  ) : undefined
                }
                text={Boolean(formValue?.id) ? "Update" : "Save"}
                className="btn-primary"
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ConnectionForm;
