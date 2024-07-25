import FormikFilterSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikFilterSelectDropdown";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useComponentLabelsQuery } from "../../../api/query-hooks";
import { allOption } from "../../../pages/TopologyPage";

type ComponentLabelsDropdownProps = {
  name: string;
  className?: string;
  label?: string;
  prefix?: React.ReactNode;
};

/**
 *
 * ComponentLabelsDropdown
 *
 * A formik dropdown component for selecting labels, needs to be used inside a
 * formik form and [FormikFilterFilter](@flanksource-ui/components/Forms/FormikFilterForm.tsx) component, to sync the value with url
 * params and formik state.
 *
 */
export function ComponentLabelsDropdown({
  className,
  label,
  name,
  prefix = "label"
}: ComponentLabelsDropdownProps) {
  const [topologyLabels, setTopologyLabels] = useState<any>({});

  const { data: labels } = useComponentLabelsQuery({});

  useEffect(() => {
    setupLabelsDropdown(labels?.data);
  }, [labels]);

  function setupLabelsDropdown(data: any[]) {
    const allLabels: { [key: string]: any } = {
      ...allOption
    };
    if (!data) {
      setTopologyLabels(allLabels);
      return;
    }
    data.forEach((item: any) => {
      const value = `${item.key}=${item.value}`;
      const label = `${item.key}:${item.value}`;
      allLabels[value] = {
        id: value,
        name: label,
        description: label,
        value: value
      };
    });
    setTopologyLabels(allLabels);
  }

  return (
    <div className={clsx(className)}>
      <FormikFilterSelectDropdown
        label={label}
        name={name}
        items={topologyLabels}
        className="inline-block w-auto max-w-[500px] p-3"
        dropDownClassNames="w-auto max-w-[400px] left-0"
        defaultValue="All"
        prefix={
          <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
            {prefix}:
          </div>
        }
      />
    </div>
  );
}
