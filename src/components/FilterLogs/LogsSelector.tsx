import { useSearchParams } from "react-router-dom";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { getTopology } from "../../api/services/topology";
import { useQuery } from "@tanstack/react-query";
import { defaultSelections } from "../FilterLogs/FilterLogsByComponent";
import { StateOption } from "../ReactSelectDropdown";

type Props = {
  classNames?: string;
};

export default function LogsSelectorDropdown({ classNames }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const topologyId = searchParams.get("topologyId");
  const logsSelector = searchParams.get("logsSelector");

  const { data: logsSelectors = [], isLoading } = useQuery(
    ["topology", topologyId],
    async () => {
      const data = await getTopology({
        id: topologyId!
      });
      return data;
    },
    {
      enabled: !!topologyId,
      select: ({ data }) => {
        const selectors = data[0].logs ?? [];
        const options: { [key: string]: StateOption } = {};
        selectors.forEach((selector) => {
          options[selector.name] = {
            id: selector.name,
            label: selector.name,
            value: selector.name
          };
        });
        return options;
      }
    }
  );

  return (
    <div className={classNames}>
      <ReactSelectDropdown
        onChange={(value) => {
          if (!value) {
            searchParams.delete("logsSelector");
          } else {
            searchParams.set("logsSelector", value);
          }
          setSearchParams(searchParams);
        }}
        prefix="Logs selector:"
        name="component"
        className="w-auto max-w-[400px] capitalize"
        value={logsSelector ?? "none"}
        items={{ ...defaultSelections, ...logsSelectors }}
        dropDownClassNames="w-auto max-w-[400px] left-0"
        hideControlBorder
        isLoading={isLoading}
        isDisabled={isLoading}
      />
    </div>
  );
}
