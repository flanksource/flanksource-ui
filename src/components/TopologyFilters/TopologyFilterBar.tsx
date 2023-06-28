import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { GetTopologyApiResponse } from "../../api/services/topology";
import { allOption } from "../../pages/TopologyPage";
import { AgentNamesDropdown } from "../Agents/AgentNamesDropdown";
import { ComponentLabelsDropdown } from "../Dropdown/ComponentLabelsDropdown";
import { ComponentTypesDropdown } from "../Dropdown/ComponentTypesDropdown";
import { ReactSelectDropdown, StateOption } from "../ReactSelectDropdown";
import TopologyPopOver from "../TopologyPopover";

type TopologyFilterBarProps = {
  data?: GetTopologyApiResponse;
  topologyCardSize: string;
  setTopologyCardSize: (size: string) => void;
  sortLabels: {
    id: number;
    value: string;
    label: string;
    standard: boolean;
  }[];
};

export default function TopologyFilterBar({
  data,
  topologyCardSize,
  setTopologyCardSize,
  sortLabels
}: TopologyFilterBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedLabel = searchParams.get("labels") ?? "All";
  const team = searchParams.get("team") ?? "All";
  const agentId = searchParams.get("agent_id") ?? "All";
  const topologyType = searchParams.get("type") ?? "All";
  const healthStatus = searchParams.get("status") ?? "All";

  // todo: add team and inspect the shape of the data
  const teams = useMemo(() => {
    const teamOptions =
      data?.teams
        ?.filter((team) => team)
        .map((team) => ({
          id: team,
          name: team,
          description: team,
          value: team
        })) ?? [];
    return [allOption["All"], ...teamOptions];
  }, [data]);

  const topologyTypes = useMemo(() => {
    const typeOptions =
      data?.types
        ?.filter((type) => type)
        .map((type) => ({
          id: type,
          name: type,
          description: type,
          value: type
        })) ?? [];
    return [allOption["All"], ...typeOptions];
  }, [data?.types]);

  const healthStatuses = useMemo(() => {
    const statusOptions: StateOption[] =
      data?.healthStatuses?.map((status) => ({
        id: status,
        value: status,
        label: status
      })) ?? [];
    return [allOption["All"], ...statusOptions];
  }, [data?.healthStatuses]);

  return (
    <div className="flex px-6">
      <div className="flex flex-wrap">
        <div className="flex p-3 pl-0">
          <ReactSelectDropdown
            name="health"
            label=""
            value={healthStatus}
            items={healthStatuses}
            className="inline-block p-3 w-auto max-w-[500px]"
            dropDownClassNames="w-auto max-w-[400px] left-0"
            onChange={(val: any) => {
              setSearchParams({
                ...Object.fromEntries(searchParams),
                status: val
              });
            }}
            prefix={
              <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                Health:
              </div>
            }
          />
        </div>
        <ComponentTypesDropdown
          className="flex p-3"
          name="Types"
          label=""
          topologyTypes={topologyTypes}
          value={topologyType}
          onChange={(val: any) => {
            setSearchParams({
              ...Object.fromEntries(searchParams),
              type: val
            });
          }}
        />
        <div className="flex p-3">
          <ReactSelectDropdown
            name="team"
            label=""
            value={team}
            items={teams}
            className="inline-block p-3 w-auto max-w-[500px]"
            dropDownClassNames="w-auto max-w-[400px] left-0"
            onChange={(val: any) => {
              setSearchParams({
                ...Object.fromEntries(searchParams),
                team: val
              });
            }}
            prefix={
              <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                Team:
              </div>
            }
          />
        </div>
        <ComponentLabelsDropdown
          name="Labels"
          label=""
          className="flex p-3 w-auto max-w-[500px]"
          value={selectedLabel}
          onChange={(val: any) => {
            setSearchParams({
              ...Object.fromEntries(searchParams),
              labels: val
            });
          }}
        />
        <div className="flex p-3">
          <AgentNamesDropdown
            name="agent_id"
            value={agentId}
            className="inline-block p-3 w-auto max-w-[500px]"
            dropDownClassNames="w-auto max-w-[400px] left-0"
            onChange={(val: any) => {
              setSearchParams({
                ...Object.fromEntries(searchParams),
                agent_id: val
              });
            }}
          />
        </div>
      </div>
      <TopologyPopOver
        size={topologyCardSize}
        setSize={setTopologyCardSize}
        sortLabels={sortLabels || []}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  );
}
