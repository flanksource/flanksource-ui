import FormikFilterSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikFilterSelectDropdown";
import { statusIconMap } from "../../../../ui/Icons/PlaybookStatusIcon";
import { StateOption } from "../../../ReactSelectDropdown";

const options: StateOption[] = [
  {
    icon: statusIconMap["running"],
    label: "Running",
    value: "running"
  },
  {
    icon: statusIconMap["scheduled"],
    label: "Scheduled",
    value: "scheduled"
  },
  {
    icon: statusIconMap["cancelled"],
    label: "Cancelled",
    value: "cancelled"
  },
  {
    icon: statusIconMap["completed"],
    label: "Completed",
    value: "completed"
  },
  {
    icon: statusIconMap["failed"],
    label: "Failed",
    value: "failed"
  },
  {
    icon: statusIconMap["pending"],
    label: "Pending",
    value: "pending"
  }
].sort((a, b) => a.label.localeCompare(b.label));

type PlaybookStatusDropdownProps = {
  label?: string;
};

/**
 *
 * ComponentLabelsDropdown
 *
 * A formik dropdown component for selecting playbook statuses, needs to be used inside a
 * formik form and [FormikFilterFilter](@flanksource-ui/components/Forms/FormikFilterForm.tsx) component, to sync the value with url
 * params and formik state.
 *
 */
export default function PlaybookStatusDropdown({
  label = "Status"
}: PlaybookStatusDropdownProps) {
  return (
    <div className="flex flex-col">
      <FormikFilterSelectDropdown
        defaultValue="all"
        items={[
          {
            label: "All",
            value: "all"
          },
          ...options
        ]}
        prefix={
          <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
            {label}:
          </div>
        }
        name="status"
      />
    </div>
  );
}
