import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { mapValues, method } from "lodash";
import { useMemo } from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { Button } from "../../ui/Buttons/Button";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import CanEditResource from "../Settings/CanEditResource";
import { Connection } from "./ConnectionFormModal";
import RenderConnectionFormFields from "./RenderConnectionFormFields";
import { TestConnection } from "./TestConnection";
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
            .reduce(
              (acc, field) => {
                acc[field.key] = field.default;
                return acc;
              },
              {} as Record<string, any>
            )
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
        <Form className="flex flex-1 flex-col overflow-y-auto">
          <div
            className={clsx(
              "my-2 flex flex-1 flex-col overflow-y-auto",
              className
            )}
            {...props}
          >
            <div className={clsx("mb-2 flex flex-col px-2")}>
              <div className="flex flex-col space-y-4 overflow-y-auto p-4">
                {connectionType.fields.map((field, index) => {
                  return (
                    <RenderConnectionFormFields field={field} key={field.key} />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-4">
            <CanEditResource
              id={formValue?.id}
              namespace={formValue?.namespace}
              name={formValue?.name}
              resourceType={"connections"}
              source={formValue?.source}
              onBack={connectionType && !formValue?.id ? handleBack : undefined}
            >
              {formValue?.id && (
                <AuthorizationAccessCheck
                  resource={tables.connections}
                  action="write"
                >
                  <Button
                    text="Delete"
                    icon={<FaTrash />}
                    onClick={handleDelete}
                    className="btn-danger"
                  />
                </AuthorizationAccessCheck>
              )}
              <div className="flex flex-1 justify-end gap-2">
                {formValue?.id && (
                  <TestConnection connectionId={formValue.id} />
                )}
                <AuthorizationAccessCheck
                  resource={tables.connections}
                  action="write"
                >
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
                </AuthorizationAccessCheck>
              </div>
            </CanEditResource>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ConnectionForm;
