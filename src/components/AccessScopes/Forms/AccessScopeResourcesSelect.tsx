import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

const RESOURCE_OPTIONS = [
  { label: "All Resources (*)", value: "*" },
  { label: "Configs", value: "configs" },
  { label: "Components", value: "components" },
  { label: "Playbooks", value: "playbooks" },
  { label: "Canaries", value: "canaries" }
];

type AccessScopeResourcesSelectProps = {
  disabled?: boolean;
};

export default function AccessScopeResourcesSelect({
  disabled = false
}: AccessScopeResourcesSelectProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const prevResourcesRef = useRef<string[]>([]);

  useEffect(() => {
    const resources = values.resources || [];
    const prevResources = prevResourcesRef.current;

    // If "*" was already selected and user adds another resource, remove "*"
    if (
      prevResources.includes("*") &&
      resources.includes("*") &&
      resources.length > 1
    ) {
      const newResources = resources.filter((r: string) => r !== "*");
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
