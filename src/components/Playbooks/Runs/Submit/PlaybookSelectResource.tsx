import { PlaybookSpec } from "../../../../api/types/playbooks";
import FormikComponentsDropdown from "../../../Forms/Formik/FormikComponentsDropdown";
import FormikConfigsDropdown from "../../../Forms/Formik/FormikConfigsDropdown";

type PlaybookSelectResourceProps = {
  playbook: Pick<PlaybookSpec, "spec">;
};

export default function PlaybookSelectResource({
  playbook
}: PlaybookSelectResourceProps) {
  const configTypes = playbook.spec?.configs?.map((item) => item?.type);

  const componentTypes = playbook.spec?.components?.map((item) => item?.type);

  if (!configTypes && !componentTypes) {
    return null;
  }

  return (
    <div className="flex flex-col my-2">
      <label className="form-label text-lg mb-0">Resource</label>
      {configTypes && (
        <div className="flex flex-row gap-2">
          <div className="w-36">
            <label htmlFor={`config_id`} className="form-label mb-0 py-4">
              Catalog Item
            </label>
          </div>
          <div className="flex flex-col flex-1">
            <FormikConfigsDropdown
              name="config_id"
              required
              filter={{
                types: configTypes as any
              }}
            />
          </div>
        </div>
      )}
      {componentTypes && (
        <div className="flex flex-row gap-2">
          <div className="w-36">
            <label htmlFor={`config_id`} className="form-label mb-0 py-4">
              Component
            </label>
          </div>
          <div className="flex flex-col flex-1">
            <FormikComponentsDropdown
              required
              name="component_id"
              filter={{
                types: componentTypes as any
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
