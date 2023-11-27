import React, { useEffect, useState } from "react";
import { Icon } from "../Icon";
import { Modal } from "../Modal";
import ConnectionForm from "./ConnectionForm";
import {
  ConnectionType,
  ConnectionValueType,
  connectionTypes
} from "./connectionTypes";
import ConnectionListView from "./ConnectionListView";

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
  namespace?: string;
};

type ConnectionFormProps = React.HTMLProps<HTMLDivElement> & {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onConnectionSubmit: (data: Connection) => Promise<any>;
  onConnectionDelete: (data: Connection) => Promise<any>;
  formValue?: Connection;
};

export default function ConnectionFormModal({
  className,
  isOpen,
  setIsOpen,
  onConnectionSubmit,
  onConnectionDelete,
  formValue
}: ConnectionFormProps) {
  const [connectionType, setConnectionType] = useState<
    ConnectionType | undefined
  >(() => connectionTypes.find((item) => item.title === formValue?.type));

  useEffect(() => {
    let connection = connectionTypes.find(
      (item) => item.value === formValue?.type
    );
    setConnectionType(connection);
  }, [isOpen, formValue]);

  const type =
    connectionTypes.find((item) => item.value === formValue?.type) ??
    connectionType;

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
        {type ? (
          <ConnectionForm
            handleBack={() => setConnectionType(undefined)}
            connectionType={type}
            onConnectionSubmit={onConnectionSubmit}
            onConnectionDelete={onConnectionDelete}
            formValue={formValue}
            className={className}
          />
        ) : (
          <ConnectionListView setConnectionType={setConnectionType} />
        )}
      </Modal>
    </div>
  );
}
