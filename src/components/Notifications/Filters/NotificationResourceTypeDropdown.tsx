import { useGetNotificationResourceTypesQuery } from "@flanksource-ui/api/query-hooks";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";

export default function NotificationResourceTypeDropdown() {
  const [field] = useField({
    name: "resource_type"
  });

  const { data: resourceTypes = [], isLoading } =
    useGetNotificationResourceTypesQuery();

  const options = useMemo(() => {
    return resourceTypes
      .map((item) => {
        const type = item.resource_type;
        const value = type.replaceAll("::", "__");
        return {
          label: type,
          value,
          id: value
        } satisfies TriStateOptions;
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [resourceTypes]);

  return (
    <div className="flex flex-col">
      <TristateReactSelect
        isLoading={isLoading}
        value={field.value}
        options={options}
        onChange={(val) => {
          if (val && val !== "All") {
            field.onChange({ target: { value: val, name: field.name } });
          } else {
            field.onChange({ target: { value: undefined, name: field.name } });
          }
        }}
        label="Resource Type"
      />
    </div>
  );
}
