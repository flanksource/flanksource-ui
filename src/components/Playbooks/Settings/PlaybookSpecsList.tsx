import { useMemo } from "react";
import { PlaybookNames } from "../../../api/types/playbooks";
import PlaybookSpecCard from "./PlaybookSpecCard";

type GroupedPlaybooks = {
  [key: string]: PlaybookNames[];
};

type Props = {
  data: PlaybookNames[];
  refetch?: () => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

export default function PlaybookSpecsList({
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
    <div className="flex h-full flex-col" {...rest}>
      {Object.keys(groupPlaybooksByType).map((type) => {
        const playbooks = groupPlaybooksByType[type];
        return (
          <div key={type} className="flex h-auto flex-col gap-4">
            <h2 className="text-lg font-bold">{type ?? "Unknown"}</h2>
            <div className="flex flex-row flex-wrap">
              {playbooks.map((playbook) => (
                <div
                  className="flex w-full min-w-[23rem] flex-col p-2 md:w-1/2 lg:w-1/3 xl:w-1/4"
                  key={playbook.id}
                >
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
