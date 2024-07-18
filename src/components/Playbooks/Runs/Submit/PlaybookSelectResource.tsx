import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import { useMemo } from "react";

type PlaybookSelectResourceProps = {
  playbook: Pick<PlaybookSpec, "spec">;
};

export default function PlaybookSelectResource({
  playbook
}: PlaybookSelectResourceProps) {
  const configResourceSelector = playbook.spec?.configs;

  const componentResourceSelector = playbook.spec?.components;

  const checkResourceSelector = playbook.spec?.checks;

  const resourceSelectorLabel = useMemo(() => {
    if (configResourceSelector) {
      return { label: "Catalog Item", fieldName: "config_id" };
    }
    if (componentResourceSelector) {
      return { label: "Component", fieldName: "component_id" };
    }
    if (checkResourceSelector) {
      return { label: "Check", fieldName: "check_id" };
    }
  }, [
    checkResourceSelector,
    componentResourceSelector,
    configResourceSelector
  ]);

  if (
    !configResourceSelector &&
    !componentResourceSelector &&
    !checkResourceSelector
  ) {
    return null;
  }

  return (
    <div className="my-2 flex flex-col">
      <label className="form-label mb-0 text-lg">Resource</label>
      <div className="flex flex-row gap-2">
        <div className="w-36">
          <label htmlFor={`config_id`} className="form-label mb-0 py-4">
            {resourceSelectorLabel?.label}
          </label>
        </div>
        <div className="flex flex-1 flex-col">
          <FormikResourceSelectorDropdown
            name={resourceSelectorLabel!.fieldName}
            checkResourceSelector={checkResourceSelector}
            componentResourceSelector={componentResourceSelector}
            configResourceSelector={configResourceSelector}
          />
        </div>
      </div>
    </div>
  );
}
