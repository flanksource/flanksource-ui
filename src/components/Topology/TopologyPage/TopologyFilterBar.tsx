import { GetTopologyApiResponse } from "@flanksource-ui/api/services/topology";
import { AgentNamesDropdown } from "@flanksource-ui/components/Agents/AgentNamesDropdown";
import { ComponentLabelsDropdown } from "@flanksource-ui/components/Dropdown/ComponentLabelsDropdown";
import { ComponentTypesDropdown } from "@flanksource-ui/components/Dropdown/ComponentTypesDropdown";
import {
  ReactSelectDropdown,
  StateOption
} from "@flanksource-ui/components/ReactSelectDropdown";
import { allOption } from "@flanksource-ui/pages/TopologyPage";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import TopologyPopOver from "../TopologyPopover";
import { TopologySort } from "../TopologyPopover/topologySort";

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
      <div className="flex gap-2 py-3 flex-wrap">
        <div className="flex">
          <ReactSelectDropdown
            name="health"
            label=""
            value={healthStatus}
            items={healthStatuses}
            className="inline-block w-auto max-w-[500px]"
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
          className="flex"
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
        <div className="flex">
          <ReactSelectDropdown
            name="team"
            label=""
            value={team}
            items={teams}
            className="inline-block w-auto max-w-[500px]"
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
          className="flex w-auto max-w-[500px]"
          value={selectedLabel}
          onChange={(val: any) => {
            setSearchParams({
              ...Object.fromEntries(searchParams),
              labels: val
            });
          }}
        />
        <div className="flex">
          <AgentNamesDropdown
            name="agent_id"
            value={agentId}
            className="inline-block w-auto max-w-[500px]"
            dropDownClassNames="w-auto max-w-[400px] left-0"
            onChange={(val: any) => {
              setSearchParams({
                ...Object.fromEntries(searchParams),
                agent_id: val
              });
            }}
          />
        </div>

        <div className="flex">
          <TopologySort sortLabels={sortLabels} />
        </div>
      </div>

      <TopologyPopOver size={topologyCardSize} setSize={setTopologyCardSize} />
    </div>
  );
}
