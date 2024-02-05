import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetPlaybookNames } from "../../../../api/query-hooks/playbooks";
import { Icon } from "../../../Icon";
import { ReactSelectDropdown, StateOption } from "../../../ReactSelectDropdown";

type PlaybookSpecsDropdownProps = {
  label?: string;
};

export default function PlaybookSpecsDropdown({
  label = "Playbook"
}: PlaybookSpecsDropdownProps) {
  const [params, setParams] = useSearchParams();

  const playbook = params.get("playbook") ?? "all";

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
      <ReactSelectDropdown
        value={playbook}
        onChange={(value) => {
          if (value === "all" || value === "" || value === undefined) {
            params.delete("playbook");
          } else {
            params.set("playbook", value);
          }
          setParams(params);
        }}
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
