import { useComponentDetail } from "@flanksource-ui/api/query-hooks/useComponent";
import { useCheckDetail } from "@flanksource-ui/api/query-hooks/useCheck";
import { useConfigHardParents } from "@flanksource-ui/api/query-hooks/useConfigRelationshipsQuery";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { Label } from "@flanksource-ui/ui/FormControls/Label";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useFormikContext } from "formik";

type FormikNotificationResourceFieldProps = {
  prepopulatedConfigID?: string;
};

type RadioItem = {
  id: string;
  name: string;
  path: string;
  type: string;
  resource_id_field: "config_id" | "component_id" | "check_id" | "canary_id";
  recursive?: boolean;
  selected?: boolean;
};

export default function FormikNotificationDirectResourceField({
  prepopulatedConfigID = ""
}: FormikNotificationResourceFieldProps) {
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();
  const { component_id, config_id, check_id, canary_id } = values;

  const { data: components } = useComponentDetail(component_id || "");
  const { data: healthChecks } = useCheckDetail(check_id || "");
  const { data: hardParents } = useConfigHardParents(
    prepopulatedConfigID || ""
  );

  let radioItems: RadioItem[] = [];
  if (config_id) {
    radioItems =
      hardParents?.map((parent) => {
        const radioItem: RadioItem = {
          id: parent.id,
          name: parent.name,
          type: parent.type,
          resource_id_field: "config_id",
          path: parent.path || "",
          recursive: true
        };

        if (parent.id === prepopulatedConfigID) {
          radioItem.recursive = false;
          radioItem.selected = true;
        }

        return radioItem;
      }) || [];
  } else if (component_id && components) {
    const component = components[0] || {};
    radioItems.push({
      id: component_id,
      name: component.name,
      resource_id_field: "component_id",
      type: component.type || "",
      path: "",
      selected: true
    });
  } else if (check_id && healthChecks) {
    const check = healthChecks[0];
    radioItems.push({
      id: check_id,
      name: check.name,
      resource_id_field: "check_id",
      type: check.type,
      path: "",
      selected: true
    });
  } else if (canary_id) {
    radioItems.push({
      id: canary_id,
      name: "Canary",
      resource_id_field: "canary_id",
      type: "Canary",
      selected: true,
      path: ""
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label label="Resource" required={true} />
      <div>
        {radioItems &&
          radioItems
            .sort((a, b) => a.path.length - b.path.length) // higher level first in the list
            .map((radioItem) => (
              <label
                key={radioItem.id}
                title={radioItem.name}
                aria-label={radioItem.name}
                aria-description={radioItem.type || ""}
                onChange={() => {
                  setFieldValue(radioItem.resource_id_field, radioItem.id);
                  if (!radioItem.selected) {
                    // only set recursive if it isn't the pre-selected item
                    setFieldValue("recursive", true);
                  }
                }}
                className="group flex cursor-pointer border border-gray-200 p-4 first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md focus:outline-none has-[:checked]:relative has-[:checked]:border-indigo-200 has-[:checked]:bg-indigo-50"
              >
                <input
                  defaultValue={radioItem.name}
                  defaultChecked={radioItem.selected}
                  value={radioItem.id}
                  name="parent"
                  type="radio"
                  className="relative mt-0.5 size-4 shrink-0 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                />
                <span className="ml-3 flex flex-col">
                  <span className="block text-sm font-medium text-gray-900 group-has-[:checked]:text-indigo-900">
                    {config_id ? (
                      <ConfigsTypeIcon
                        config={{ type: radioItem.type }}
                        showPrimaryIcon={false}
                      >
                        <span>
                          {radioItem.name}{" "}
                          {radioItem.recursive && (
                            <Badge text="Recursive" className="ml-2" />
                          )}
                        </span>
                      </ConfigsTypeIcon>
                    ) : (
                      <div className="flex flex-row items-center gap-2">
                        <Icon
                          name={radioItem.type}
                          className={"flex h-auto w-6 flex-row"}
                        ></Icon>
                        <span>{radioItem.name}</span>
                      </div>
                    )}
                  </span>
                </span>
              </label>
            ))}
      </div>
    </div>
  );
}
