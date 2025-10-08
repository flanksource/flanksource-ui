import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

export type ResourceType = "*" | "config" | "component" | "playbook" | "canary";

const RESOURCE_OPTIONS: Array<{ label: string; value: ResourceType }> = [
  { label: "All Resources (*)", value: "*" },
  { label: "Config", value: "config" },
  { label: "Component", value: "component" },
  { label: "Playbook", value: "playbook" },
  { label: "Canary", value: "canary" }
];

type AccessScopeResourcesSelectProps = {
  disabled?: boolean;
};

type AccessScopeFormValues = {
  resources?: ResourceType[];
};

export default function AccessScopeResourcesSelect({
  disabled = false
}: AccessScopeResourcesSelectProps) {
  const { values, setFieldValue } = useFormikContext<AccessScopeFormValues>();
  const prevResourcesRef = useRef<ResourceType[]>([]);

  useEffect(() => {
    const resources = values.resources || [];
    const prevResources = prevResourcesRef.current;

    // If "*" was already selected and user adds another resource, remove "*"
    if (
      prevResources.includes("*") &&
      resources.includes("*") &&
      resources.length > 1
    ) {
      const newResources = resources.filter((r) => r !== "*");
      setFieldValue("resources", newResources);
    }
    // If "*" is newly selected (wasn't in prev), clear all other selections
    else if (
      !prevResources.includes("*") &&
      resources.includes("*") &&
      resources.length > 1
    ) {
      setFieldValue("resources", ["*"]);
    }

    prevResourcesRef.current = resources;
  }, [values.resources, setFieldValue]);

  return (
    <FormikSelectDropdown
      name="resources"
      label="Resources"
      options={RESOURCE_OPTIONS}
      isMulti
      required
      isDisabled={disabled}
      hint="Select which resource types this scope applies to. Select 'All Resources' for everything."
    />
  );
}
