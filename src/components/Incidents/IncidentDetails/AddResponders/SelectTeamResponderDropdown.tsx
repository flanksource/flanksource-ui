import { useMemo } from "react";
import { useGetAllTeams } from "../../../../api/query-hooks/responders";
import { Team } from "../../../../api/types/users";
import { Icon } from "../../../../ui/Icons/Icon";
import { ReactSelectDropdown } from "../../../ReactSelectDropdown";

type SelectTeamResponderDropdownProps = {
  onChange?: (value: Team | undefined) => void;
  value?: string;
};

export default function SelectTeamResponderDropdown({
  onChange = () => {},
  value
}: SelectTeamResponderDropdownProps) {
  const { data: teams = [], isLoading } = useGetAllTeams();

  const options = useMemo(
    () =>
      teams.map((team) => ({
        label: team.name,
        value: team.id,
        icon: () => <Icon name={team.icon} secondary={team.name} />
      })),
    [teams]
  );

  return (
    <div className="flex flex-1 flex-row items-center gap-2">
      <label className="mr-2 w-12 whitespace-nowrap text-sm text-gray-500">
        Team:
      </label>
      <div className="flex flex-1 flex-col">
        <ReactSelectDropdown
          name="team"
          isLoading={isLoading}
          items={[{ label: "None", value: "none" }, ...options]}
          onChange={(value) =>
            onChange(teams.find((team) => team.id === value))
          }
          value={value ?? "none"}
          className="w-full"
          dropDownClassNames="w-full left-0"
          hideControlBorder
        />
      </div>
    </div>
  );
}
