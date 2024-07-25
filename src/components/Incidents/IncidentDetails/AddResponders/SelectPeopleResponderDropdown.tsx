import { useMemo } from "react";
import { useGetAllPeople } from "../../../../api/query-hooks/responders";
import { User } from "../../../../api/types/users";
import { Avatar } from "../../../../ui/Avatar";
import { ReactSelectDropdown } from "../../../ReactSelectDropdown";

type SelectTeamResponderDropdownProps = {
  onChange?: (value: User | undefined) => void;
  value?: string;
};

export default function SelectPeopleResponderDropdown({
  onChange = () => {},
  value
}: SelectTeamResponderDropdownProps) {
  const { data: persons = [], isLoading } = useGetAllPeople();

  const options = useMemo(
    () =>
      persons.map((user) => ({
        label: user.name,
        value: user.id,
        icon: () => <Avatar user={user} />
      })),
    [persons]
  );

  return (
    <div className="flex flex-1 flex-row items-center gap-2">
      <label className="mr-2 w-12 whitespace-nowrap text-sm text-gray-500">
        Person:
      </label>
      <div className="flex flex-1 flex-col">
        <ReactSelectDropdown
          name="team"
          isLoading={isLoading}
          items={[{ label: "None", value: "none" }, ...options]}
          onChange={(value) =>
            onChange(persons.find((person) => person.id === value))
          }
          value={value ?? "none"}
          className="w-full flex-1"
          dropDownClassNames="w-full left-0"
          hideControlBorder
        />
      </div>
    </div>
  );
}
