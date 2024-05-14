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
    <div className="flex flex-row gap-2 flex-1 items-center">
      <label className="text-sm text-gray-500 mr-2 whitespace-nowrap w-12">
        Person:
      </label>
      <div className="flex flex-col flex-1">
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
