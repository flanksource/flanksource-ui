import { useGetPlaybookNames } from "@flanksource-ui/api/query-hooks/playbooks";
import FormikFilterSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikFilterSelectDropdown";
import { useMemo } from "react";
import { Icon } from "../../../../ui/Icons/Icon";
import { StateOption } from "../../../ReactSelectDropdown";

type PlaybookSpecsDropdownProps = {
  label?: string;
};

/**
 *
 * PlaybookSpecsDropdown
 *
 * A formik dropdown component for selecting playbooks, needs to be used inside a
 * formik form and [FormikFilterFilter](@flanksource-ui/components/Forms/FormikFilterForm.tsx) component, to sync the value with url
 * params and formik state.
 *
 */
export default function PlaybookSpecsDropdown({
  label = "Playbook"
}: PlaybookSpecsDropdownProps) {
  const { data: playbooks, isLoading } = useGetPlaybookNames();

  const options: StateOption[] = useMemo(() => {
    return (
      playbooks?.map(
        (playbook) =>
          ({
            label: playbook.name,
            value: playbook.id,
            // we need a solution for this
            icon: <Icon name={playbook.icon} className="h-5" />
          } satisfies StateOption)
      ) ?? []
    );
  }, [playbooks]);

  return (
    <div className="flex flex-col">
      <FormikFilterSelectDropdown
        defaultValue="all"
        isDisabled={isLoading}
        items={[{ label: "All Playbooks", value: "all" }, ...options]}
        isLoading={isLoading}
        prefix={
          <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
            {label}:
          </div>
        }
        name="playbook"
      />
    </div>
  );
}
