import FormikCanaryDropdown from "@flanksource-ui/components/Forms/Formik/FormikCanaryDropdown";
import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useFormikContext } from "formik";
import { useState } from "react";

export const permissionObjectList = [
  { label: "Canaries", value: "canaries" },
  { label: "Catalog", value: "catalog" },
  { label: "Incident", value: "incident" },
  { label: "People", value: "people" },
  { label: "Topology", value: "topology" },
  { label: "Playbooks", value: "playbooks" },
  { label: "Connection", value: "connection" },
  { label: "Connection Detail", value: "connection-detail" },
  { label: "Agent Push", value: "agent-push" },
  { label: "Kubernetes Proxy", value: "kubernetes-proxy" },
  { label: "Notification", value: "notification" },
  { label: "RBAC", value: "rbac" },
  { label: "Logs", value: "logs" },
  { label: "Agent", value: "agent" },
  { label: "Artifact", value: "artifact" }
];

export default function FormikPermissionSelectResourceFields() {
  const { setFieldValue } = useFormikContext<Record<string, any>>();

  const [switchOption, setSwitchOption] = useState<
    "Component" | "Catalog" | "Canary" | "Playbook" | "Connection" | "Global"
  >("Catalog");

  return (
    <div className="flex flex-col gap-2">
      <label className={`form-label`}>Resource</label>
      <div>
        <div className="flex w-full flex-row">
          <Switch
            options={[
              "Catalog",
              "Component",
              "Connection",
              "Playbook",
              "Global"
            ]}
            className="w-auto"
            itemsClassName=""
            defaultValue="Go Template"
            value={switchOption}
            onChange={(v) => {
              setSwitchOption(v);
              setFieldValue("object", undefined);
              setFieldValue("config_id", undefined);
              setFieldValue("check_id", undefined);
              setFieldValue("canary_id", undefined);
              setFieldValue("component_id", undefined);
              setFieldValue("playbook_id", undefined);
            }}
          />
        </div>

        {switchOption === "Catalog" && (
          <FormikResourceSelectorDropdown
            required
            name="config_id"
            configResourceSelector={[{}]}
          />
        )}

        {switchOption === "Component" && (
          <FormikResourceSelectorDropdown
            required
            name="component_id"
            componentResourceSelector={[{}]}
          />
        )}

        {switchOption === "Playbook" && (
          <FormikResourceSelectorDropdown
            required
            name="playbook_id"
            playbookResourceSelector={[{}]}
          />
        )}

        {switchOption === "Canary" && (
          <FormikCanaryDropdown required name="canary_id" />
        )}

        {switchOption === "Connection" && (
          <FormikResourceSelectorDropdown
            required
            name="connection_id"
            connectionResourceSelector={[{}]}
          />
        )}

        {switchOption === "Global" && (
          <FormikSelectDropdown
            required
            name="object"
            options={permissionObjectList}
          />
        )}
      </div>
    </div>
  );
}
