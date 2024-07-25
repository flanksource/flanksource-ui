import { useFormikContext } from "formik";
import { useCallback, useState } from "react";
import { Switch } from "../../../ui/FormControls/Switch";
import { AWSConnectionFormEditor } from "./AWSConnectionFormEditor";
import { GCPConnectionFormEditor } from "./GCPConnectionFormEditor";
import { SFTPConnectionFormEditor } from "./SFTPConnectionFormEditor";
import { SMBConnectionFormEditor } from "./SMBConnectionFormEditor";

const Connections = {
  AWS: {
    Component: AWSConnectionFormEditor,
    name: "awsConnection",
    label: "AWS Connection"
  },
  GCP: {
    Component: GCPConnectionFormEditor,
    name: "gcpConnection",
    label: "GCP Connection"
  },
  SFTP: {
    Component: SFTPConnectionFormEditor,
    name: "sftpConnection",
    label: "SFTP Connection"
  },
  SMB: {
    Component: SMBConnectionFormEditor,
    name: "smbConnection",
    label: "SMB Connection"
  }
};

type ConnectionTypes = keyof typeof Connections;

type ConnectionFormEditProps = {
  name: string;
  connections: Array<ConnectionTypes>;
  showLabel?: boolean;
};

const ConnectionFormEdit = ({
  connections,
  name,
  showLabel
}: ConnectionFormEditProps) => {
  const { setFieldValue } = useFormikContext<Record<string, any>>();
  const [selectedMethod, setSelectedMethod] = useState<
    "None" | ConnectionTypes
  >("None");
  const [FormFields, setFormFields] =
    useState<(typeof Connections)[ConnectionTypes]>();

  const setConnectionFormFieldValues = useCallback(
    (connectionType: "None" | ConnectionTypes) => {
      // reset all fields
      connections.forEach((connection) => {
        setFieldValue(`${name}.${Connections[connection].name}`, undefined);
      });

      if (connectionType !== "None") {
        setFieldValue(`${name}.${Connections[connectionType].name}`, true);
        setFormFields(Connections[connectionType]);
      } else {
        setFormFields(undefined);
      }
    },
    [connections, name, setFieldValue]
  );

  return (
    <div className="flex flex-col space-y-2">
      <h5 className="font-bold">Connection</h5>
      <div className="flex w-full flex-row">
        <Switch
          options={["None", ...connections]}
          defaultValue="None"
          value={selectedMethod}
          onChange={(v) => {
            setConnectionFormFieldValues(v as any);
            setSelectedMethod(v as any);
          }}
        />
      </div>
      {FormFields && (
        <div className="flex flex-col space-y-2 rounded-md border border-gray-200 p-2">
          {showLabel && <label>{FormFields.label}</label>}
          <FormFields.Component name={`${name}.${FormFields.name}`} />
        </div>
      )}
    </div>
  );
};

export default ConnectionFormEdit;
