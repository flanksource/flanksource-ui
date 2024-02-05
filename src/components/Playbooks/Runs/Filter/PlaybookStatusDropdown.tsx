import { useSearchParams } from "react-router-dom";
import { statusIconMap } from "../../../Icon/PlaybookStatusIcon";
import { ReactSelectDropdown, StateOption } from "../../../ReactSelectDropdown";

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

export default function PlaybookStatusDropdown({
  label = "Status"
}: PlaybookStatusDropdownProps) {
  const [params, setParams] = useSearchParams();

  const status = params.get("status") ?? "all";

  return (
    <div className="flex flex-col">
      <ReactSelectDropdown
        value={status}
        onChange={(value) => {
          if (value === "all" || value === "" || value === undefined) {
            params.delete("status");
          } else {
            params.set("status", value);
          }
          setParams(params);
        }}
        items={[
          {
            label: "All",
            value: "all"
          },
          ...options
        ]}
        prefix={
          <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
            {label}:
          </div>
        }
        name="status"
      />
    </div>
  );
}
