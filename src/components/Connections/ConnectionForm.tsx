import clsx from "clsx";
import { Form, Formik } from "formik";
import FormikTextInput from "../Forms/Formik/FormikTextInput";
import FormikCheckbox from "../Forms/Formik/FormikCheckbox";
import { Modal } from "../Modal";
import { useEffect, useState } from "react";
import { ConnectionType, Field, connectionTypes } from "./connectionTypes";
import { FormikEnvVarSource } from "../Forms/Formik/FormikEnvVarSource";
import { Icon } from "../Icon";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { Button } from "../Button";

export type Connection = {
  id?: string;
  name: string;
  type: string;
  url?: string;
  username?: string;
  password?: string;
  certificate?: string;
  domain?: string;
  region?: string;
  profile?: string;
  host?: string;
  port?: string | number;
  tenant?: string;
  checkIntegrity?: boolean;
  maxAge?: number;
  insecure_tls?: boolean;
  workstation?: string;
  sharename?: string;
  searchPath?: string;
  scheme?: string;
  db?: string;
};

type ConnectionFormProps = React.HTMLProps<HTMLDivElement> & {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onConnectionSubmit: (data: Connection) => Promise<any>;
  onConnectionDelete: (data: Connection) => Promise<any>;
  formValue?: Connection;
};

export default function ConnectionForm({
  className,
  isOpen,
  setIsOpen,
  onConnectionSubmit,
  onConnectionDelete,
  formValue,
  ...props
}: ConnectionFormProps) {
  const [connectionType, setConnectionType] = useState<ConnectionType>();
  const [formInitialValue, setFormInitialValue] = useState<Connection>();

  useEffect(() => {
    let connection = connectionTypes.find(
      (item) => item.title === formValue?.type
    );
    if (connection) {
      setConnectionType(connection);
      setFormInitialValue(
        connection.convertToFormSpecificValue
          ? connection.convertToFormSpecificValue(formValue as any)
          : formValue
      );
      return;
    }
    setTimeout(() => {
      setConnectionType(connection);
    }, 1000);
  }, [isOpen, formValue]);

  const convertData = (data: Connection) => {
    if (connectionType?.preSubmitConverter) {
      return connectionType.preSubmitConverter(data as any) as Connection;
    }
    const result: Record<string, string | undefined | boolean | number> = {};
    connectionType?.fields.forEach((field) => {
      result[field.key] = data[field.key as keyof Connection]!;
    });
    return result as Connection;
  };

  const getFieldView = (field: Field) => {
    const type = field.type ?? "input";
    switch (type) {
      case "input":
        return (
          <FormikTextInput
            name={field.key}
            label={field.label}
            required={field.required}
            defaultValue={field.default?.toString()}
          />
        );
      case "numberInput":
        return (
          <FormikTextInput
            type="number"
            name={field.key}
            label={field.label}
            required={field.required}
            defaultValue={field.default?.toString()}
          />
        );
      case "checkbox":
        return (
          <FormikCheckbox
            name={field.key}
            label={field.label}
            labelClassName="text-sm font-semibold text-gray-700"
            required={field.required}
          />
        );
      case "EnvVarSource":
        return (
          <FormikEnvVarSource
            name={field.key}
            label={field.label}
            variant={field.variant}
            required={field.required}
          />
        );
      default:
        return null;
    }
  };

  const getFormView = (connectionType: ConnectionType) => {
    return (
      <Formik
        initialValues={
          formInitialValue || {
            name: "",
            type: "",
            url: "",
            username: "",
            password: "",
            certificate: "",
            domain: "",
            region: "",
            profile: "",
            insecure_tls: false
          }
        }
        onSubmit={(value) => {
          onConnectionSubmit?.({
            ...convertData(value),
            type: connectionType.title
          });
        }}
      >
        <Form>
          <div
            className={clsx(
              "flex flex-col h-full my-2 overflow-y-auto",
              className
            )}
            style={{ maxHeight: "calc(65vh)" }}
            {...props}
          >
            <div className={clsx("flex flex-col px-2 mb-2")}>
              <div className="flex flex-col space-y-4 overflow-y-auto p-4">
                {connectionType.fields.map((field, index) => {
                  return (
                    <React.Fragment key={index}>
                      {getFieldView(field)}
                    </React.Fragment>
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
                onClick={() => {
                  onConnectionDelete?.(formValue!);
                }}
                className="btn-danger"
              />
            )}
            {connectionType && !Boolean(formValue?.id) && (
              <button
                className={clsx("btn-secondary-base btn-secondary")}
                type="button"
                onClick={(e) => {
                  setConnectionType(undefined);
                }}
              >
                Back
              </button>
            )}
            <div className="flex flex-1 justify-end">
              <Button
                type="submit"
                text={Boolean(formValue?.id) ? "Update" : "Save"}
                className="btn-primary"
              />
            </div>
          </div>
        </Form>
      </Formik>
    );
  };

  const getConnectionListingView = () => {
    return (
      <div className="flex flex-wrap p-2">
        {connectionTypes.map((item) => {
          return (
            <div className="flex flex-col w-1/5 p-2" key={item.title}>
              <div
                role="button"
                className="flex flex-col items-center space-y-2 justify-center p-2 border border-gray-300 hover:border-blue-200 hover:bg-gray-100 rounded-md text-center h-20"
                onClick={(e) => {
                  setConnectionType(item);
                }}
              >
                {typeof item.icon === "string" ? (
                  <Icon name={item.icon} />
                ) : (
                  item.icon
                )}
                <div>{item.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <Modal
        title={
          connectionType ? (
            <div
              className="flex flex-row items-center space-x-2"
              key={connectionType.title}
            >
              {typeof connectionType?.icon === "string" ? (
                <Icon name={connectionType?.icon} />
              ) : (
                connectionType.icon
              )}
              <div className="font-semibold text-lg">
                {connectionType.title} Connection Details
              </div>
            </div>
          ) : (
            <div className="font-semibold text-lg">Select Connection Type</div>
          )
        }
        onClose={() => {
          setIsOpen(false);
        }}
        open={isOpen}
        bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      >
        {connectionType && getFormView(connectionType)}
        {!connectionType && getConnectionListingView()}
      </Modal>
    </div>
  );
}
