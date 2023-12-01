import { TupleToUnion } from "type-fest";
import { Icon } from "../../../Icon";

export const createTopologyOptions = [
  "Kubernetes",
  "Flux",
  "Prometheus",
  "Custom"
] as const;

type AddTopologyOptionsListProps = {
  onSelectOption: (options: TupleToUnion<typeof createTopologyOptions>) => void;
};

export default function AddTopologyOptionsList({
  onSelectOption
}: AddTopologyOptionsListProps) {
  return (
    <div className="flex flex-wrap p-2">
      {createTopologyOptions.map((item) => {
        return (
          <div className="flex flex-col w-1/4 p-2" key={item}>
            <div
              role="button"
              className="flex flex-col items-center space-y-2 justify-center p-2 border border-gray-300 hover:border-blue-200 hover:bg-gray-100 rounded-md text-center h-20"
              onClick={(e) => {
                onSelectOption(item);
              }}
            >
              <Icon name={item.toLowerCase()} />
              <div>{item}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
