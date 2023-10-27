import clsx from "clsx";
import { Form, Formik } from "formik";
import { mapValues, method } from "lodash";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Modal } from "../Modal";
import RenderConnectionFormFields from "./RenderConnectionFormFields";
import {
  ConnectionType,
  ConnectionValueType,
  connectionTypes
} from "./connectionTypes";

export type Connection = {
  altID?: string;
  authMethod?: string;
  certificate?: string;
  channel?: string;
  checkIntegrity?: boolean;
  contentType?: string;
  db?: string;
  domain?: string;
  email?: string;
  encryptionMethod?: string;
  from?: string;
  fromName?: string;
  group?: string;
  groupOwner?: string;
  host?: string;
  id?: string;
  insecure_tls?: boolean;
  key?: string;
  maxAge?: number;
  name: string;
  password?: string;
  path?: string;
  port?: string | number;
  profile?: string;
  region?: string;
  requestMethod?: string;
  scheme?: string;
  searchPath?: string;
  sharename?: string;
  targets?: string;
  tenant?: string;
  titleKey?: string;
  topic?: string;
  type?: ConnectionValueType;
  url?: string;
  user?: string;
  username?: string;
  webhook?: string;
  workstation?: string;
  properties?: Record<string, any>;
  ref?: string;
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

  const getFormView = (connectionType: ConnectionType) => {
    return (
      <Formik
        initialValues={
          formInitialValue || {
            name: "",
            type: undefined,
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
            type: connectionType.value
          });
        }}
      >
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
              className="flex flex-row items-center gap-2 overflow-y-auto"
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
