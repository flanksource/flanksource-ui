import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import { useFormikContext } from "formik";
import { useEffect } from "react";

const RESOURCE_OPTIONS = [
  { label: "All Resources (*)", value: "*" },
  { label: "Configs", value: "configs" },
  { label: "Components", value: "components" },
  { label: "Playbooks", value: "playbooks" },
  { label: "Canaries", value: "canaries" },
  { label: "Checks", value: "checks" },
  { label: "Topologies", value: "topologies" },
  { label: "Scrapers", value: "scrapers" },
  { label: "Notifications", value: "notifications" },
  { label: "Connections", value: "connections" }
];

export default function AccessScopeResourcesSelect() {
  const { values, setFieldValue } = useFormikContext<any>();
  const resources = values.resources || [];

  useEffect(() => {
    // If "*" is selected, clear all other selections
    if (resources.includes("*") && resources.length > 1) {
      setFieldValue("resources", ["*"]);
    }
  }, [resources, setFieldValue]);

  return (
    <FormikSelectDropdown
      name="resources"
      label="Resources"
      options={RESOURCE_OPTIONS}
      isMulti
      required
      hint="Select which resource types this scope applies to. Select 'All Resources' for everything."
    />
  );
}
