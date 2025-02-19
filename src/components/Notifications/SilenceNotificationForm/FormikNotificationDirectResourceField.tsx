import { useComponentDetail } from "@flanksource-ui/api/query-hooks/useComponent";
import { useCheckDetail } from "@flanksource-ui/api/query-hooks/useCheck";
import { useConfigHardParents } from "@flanksource-ui/api/query-hooks/useConfigRelationshipsQuery";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { Label } from "@flanksource-ui/ui/FormControls/Label";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useFormikContext } from "formik";

type FormikNotificationResourceFieldProps = {
  prepopulatedConfigID?: string;
};

type RadioItem = {
  // input field value
  value: string;

  name: string;
  badges?: string[];
  path?: string;
  type?: string;
  recursive?: boolean;
  selected?: boolean;
  radioItemType: "resource" | "Kind" | "Tag";

  // which field to set in the formik values
  form_field:
    | "config_id"
    | "component_id"
    | "check_id"
    | "canary_id"
    | "selectors";
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

  const resourcesRadioItems: RadioItem[] = [];
  const attributesRadioItems: RadioItem[] = [];
  const seenAttributes = new Set<string>();

  if (config_id) {
    hardParents?.forEach((parent) => {
      const radioItem: RadioItem = {
        value: parent.id,
        name: parent.name,
        type: parent.type,
        radioItemType: "resource",
        form_field: "config_id",
        path: parent.path || "",
        badges: [parent.type, "Recursive"],
        recursive: true
      };

      if (parent.id === prepopulatedConfigID) {
        radioItem.recursive = false;
        radioItem.badges = [parent.type];
        radioItem.selected = true;
      }

      resourcesRadioItems.push(radioItem);

      if (!seenAttributes.has(parent.type)) {
        attributesRadioItems.push({
          value: parent.type,
          name: parent.type,
          type: parent.type,
          radioItemType: "Kind",
          badges: ["Kind"],
          form_field: "selectors"
        });

        seenAttributes.add(parent.type);
      }

      for (const tag in parent.tags) {
        const tagDisplay = `${tag}=${parent.tags[tag]}`;

        if (!seenAttributes.has(tagDisplay)) {
          attributesRadioItems.push({
            value: tagDisplay,
            name: tagDisplay,
            radioItemType: "Tag",
            form_field: "selectors"
          });

          seenAttributes.add(tagDisplay);
        }
      }
    });
  } else if (component_id && components) {
    const component = components[0] || {};
    resourcesRadioItems.push({
      value: component_id,
      name: component.name,
      form_field: "component_id",
      type: component.type || "",
      selected: true,
      radioItemType: "resource"
    });
  } else if (check_id && healthChecks) {
    const check = healthChecks[0];
    resourcesRadioItems.push({
      value: check_id,
      name: check.name,
      form_field: "check_id",
      type: check.type,
      selected: true,
      radioItemType: "resource"
    });
  } else if (canary_id) {
    resourcesRadioItems.push({
      value: canary_id,
      name: "Canary",
      radioItemType: "resource",
      form_field: "canary_id",
      selected: true
    });
  }

  const onResourceSelect = (radioItem: RadioItem) => {
    return () => {
      setFieldValue(radioItem.form_field, radioItem.value);
      if (!radioItem.selected) {
        // only set recursive if it isn't the pre-selected item
        setFieldValue("recursive", true);
      }
    };
  };

  const onAttributeSelect = () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[name="resource_attributes"]:checked'
    );

    const selectors = Array.from(checkboxes).map((checkbox) => {
      if (checkbox.value.includes("=")) {
        return {
          tagSelector: checkbox.value
        };
      }

      // It's a kind
      return {
        types: [checkbox.value]
      };
    });

    setFieldValue("selectors", selectors);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label label="Resource" required={true} />
      <div>
        {resourcesRadioItems &&
          resourcesRadioItems
            .sort((a, b) => (a.path?.length ?? 0) - (b.path?.length ?? 0)) // higher level first in the list
            .map((radioItem) => (
              <label
                key={radioItem.value}
                title={radioItem.name}
                aria-label={radioItem.name}
                aria-description={radioItem.type || ""}
                onChange={onResourceSelect(radioItem)}
                className="group flex cursor-pointer border border-gray-200 p-4 first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md focus:outline-none has-[:checked]:relative has-[:checked]:border-indigo-200 has-[:checked]:bg-indigo-50"
              >
                <input
                  defaultValue={radioItem.name}
                  defaultChecked={radioItem.selected}
                  value={radioItem.value}
                  name="resource"
                  type="radio"
                  className="relative mt-0.5 size-4 shrink-0 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                />
                <span className="ml-3 flex flex-col">
                  <span className="block text-sm font-medium text-gray-900 group-has-[:checked]:text-indigo-900">
                    <div className="flex flex-row items-center gap-2">
                      <Icon
                        name={radioItem.type}
                        className={"flex h-auto w-6 flex-row"}
                      ></Icon>
                      <span>{radioItem.name}</span>
                      {radioItem.badges?.map((b) => <Badge key={b} text={b} />)}
                    </div>
                  </span>
                </span>
              </label>
            ))}
      </div>

      {attributesRadioItems.length > 0 && (
        <Label label="Attributes" required={false} />
      )}
      <div>
        {attributesRadioItems &&
          attributesRadioItems
            .sort((a, b) => a.radioItemType.length - b.radioItemType.length) // group by kind and tags
            .map((checkboxItem) => (
              <label
                key={checkboxItem.value}
                title={checkboxItem.name}
                aria-label={checkboxItem.name}
                aria-description={checkboxItem.type || ""}
                className="group flex cursor-pointer border border-gray-200 p-4 first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md focus:outline-none has-[:checked]:relative has-[:checked]:border-indigo-200 has-[:checked]:bg-indigo-50"
              >
                <input
                  defaultValue={checkboxItem.name}
                  defaultChecked={checkboxItem.selected}
                  value={checkboxItem.value}
                  name="resource_attributes"
                  type="checkbox"
                  onChange={onAttributeSelect}
                  className="checkbox cursor-pointer"
                />
                <span className="ml-3 flex flex-col">
                  <span className="block text-sm font-medium text-gray-900 group-has-[:checked]:text-indigo-900">
                    <div className="flex flex-row items-center gap-2">
                      <Icon
                        name={checkboxItem.type}
                        className={"flex h-auto w-6 flex-row"}
                      ></Icon>
                      {checkboxItem.radioItemType === "Tag" ? (
                        <span className="space-x-1 text-sm">
                          <span className="text-gray-600">
                            {checkboxItem.value.split("=")[0]}:
                          </span>
                          <span>{checkboxItem.value.split("=")[1]}</span>
                        </span>
                      ) : (
                        <>
                          <span>{checkboxItem.name}</span>
                          {checkboxItem.badges?.map((b) => (
                            <Badge key={b} text={b} />
                          ))}
                        </>
                      )}
                    </div>
                  </span>
                </span>
              </label>
            ))}
      </div>
    </div>
  );
}
