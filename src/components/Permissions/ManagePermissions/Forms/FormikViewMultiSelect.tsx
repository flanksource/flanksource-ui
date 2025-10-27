import { useQuery } from "@tanstack/react-query";
import { getViewsSummary } from "@flanksource-ui/api/services/views";
import { useField, useFormikContext } from "formik";
import { useMemo } from "react";
import Select, { components } from "react-select";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";

type ViewRef = {
  namespace?: string;
  name: string;
};

type ViewOption = {
  value: string;
  label: string;
  namespace?: string;
  name: string;
};

export default function FormikViewMultiSelect() {
  const { setFieldValue } = useFormikContext<Record<string, any>>();
  const [field] = useField<{ views?: ViewRef[] }>({
    name: "object_selector"
  });

  const { data: views, isLoading } = useQuery({
    queryKey: ["views_summary"],
    queryFn: getViewsSummary,
    staleTime: 5 * 60 * 1000
  });

  const viewOptions = useMemo(() => {
    if (!views) return [];
    return views.map((view) => ({
      value: JSON.stringify({
        namespace: view.namespace,
        name: view.name
      }),
      label: view.name,
      namespace: view.namespace,
      name: view.name
    }));
  }, [views]);

  const selectedView = useMemo(() => {
    const viewRef = field.value?.views?.[0];
    if (!viewRef) return null;
    return {
      value: JSON.stringify(viewRef),
      label: viewRef.name,
      namespace: viewRef.namespace,
      name: viewRef.name
    };
  }, [field.value]);

  const Option = (props: any) => {
    return (
      <components.Option {...props}>
        <div className="flex items-center gap-2">
          {props.data.namespace && (
            <Badge
              text={props.data.namespace}
              colorClass="bg-gray-200 text-gray-700"
            />
          )}
          <span>{props.data.label}</span>
        </div>
      </components.Option>
    );
  };

  const SingleValue = (props: any) => {
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center gap-2">
          {props.data.namespace && (
            <Badge
              text={props.data.namespace}
              colorClass="bg-gray-200 text-gray-700"
            />
          )}
          <span>{props.data.label}</span>
        </div>
      </components.SingleValue>
    );
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <Select
        isLoading={isLoading}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={isLoading ? "Loading views..." : "Select a view"}
        options={viewOptions}
        value={selectedView}
        components={{
          Option,
          SingleValue
        }}
        isClearable
        onChange={(selectedOption) => {
          if (selectedOption) {
            const viewRef = JSON.parse(selectedOption.value);
            setFieldValue("object_selector", { views: [viewRef] });
          } else {
            setFieldValue("object_selector", null);
          }
        }}
        onBlur={field.onBlur}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
      />
    </div>
  );
}
