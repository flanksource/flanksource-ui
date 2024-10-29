import FormikFilterSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikFilterSelectDropdown";
import { StateOption } from "../../../ReactSelectDropdown";
import { PlaybookStatusIcon } from "@flanksource-ui/ui/Icons/PlaybookStatusIcon";

const options: StateOption[] = [
  {
    icon: <PlaybookStatusIcon status="running" animated={false} />,
    label: "Running",
    value: "running"
  },
  {
    icon: <PlaybookStatusIcon status="scheduled" animated={false} />,
    label: "Scheduled",
    value: "scheduled"
  },
  {
    icon: <PlaybookStatusIcon status="cancelled" animated={false} />,
    label: "Cancelled",
    value: "cancelled"
  },
  {
    icon: <PlaybookStatusIcon status="completed" animated={false} />,
    label: "Completed",
    value: "completed"
  },
  {
    icon: <PlaybookStatusIcon status="failed" animated={false} />,
    label: "Failed",
    value: "failed"
  },
  {
    icon: <PlaybookStatusIcon status="pending_approval" animated={false} />,
    label: "Pending Approval",
    value: "pending_approval"
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
