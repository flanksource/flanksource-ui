import { useMemo } from "react";
import { PlaybookSpec } from "../../../api/types/playbooks";
import PlaybookSpecCard from "./PlaybookSpecCard";

type GroupedPlaybooks = {
  [key: string]: PlaybookSpec[];
};

type Props = {
  data: PlaybookSpec[];
  refetch?: () => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

export default function PlaybookSpecsTable({
  data,
  className,
  refetch = () => {},
  ...rest
}: Props) {
  const groupPlaybooksByType: GroupedPlaybooks = useMemo(() => {
    return data.reduce((acc, playbook) => {
      // If playbook has a category, use that, otherwise use "Other", this goes
      // for empty strings as well
      const type = !!playbook.category ? playbook.category : "Other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(playbook);
      return acc;
    }, {} as GroupedPlaybooks);
  }, [data]);

  return (
    <div className="flex flex-col h-full overflow-y-hidden" {...rest}>
      {Object.keys(groupPlaybooksByType).map((type) => {
        const playbooks = groupPlaybooksByType[type];
        return (
          <div key={type} className="flex flex-col gap-4 h-auto">
            <h2 className="text-lg font-bold">{type ?? "Unknown"}</h2>
            <div className="flex flex-row flex-wrap">
              {playbooks.map((playbook) => (
                <div className="flex flex-col w-1/4 p-2" key={playbook.id}>
                  <PlaybookSpecCard playbook={playbook} refetch={refetch} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
