import { GetTopologyApiResponse } from "@flanksource-ui/api/services/topology";
import { AgentNamesDropdown } from "@flanksource-ui/components/Agents/AgentNamesDropdown";
import FormikFilterSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikFilterSelectDropdown";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { StateOption } from "@flanksource-ui/components/ReactSelectDropdown";
import { ComponentLabelsDropdown } from "@flanksource-ui/components/Topology/Dropdowns/ComponentLabelsDropdown";
import { ComponentTypesDropdown } from "@flanksource-ui/components/Topology/Dropdowns/ComponentTypesDropdown";
import { allOption } from "@flanksource-ui/pages/TopologyPage";
import { useMemo } from "react";
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
    <FormikFilterForm
      filterFields={[
        "labels",
        "team",
        "type",
        "status",
        "showHiddenComponents",
        "sortBy",
        "sortOrder",
        "agent_id"
      ]}
      paramsToReset={[]}
    >
      <div className="flex px-6">
        <div className="flex flex-wrap gap-2 py-3">
          <FormikFilterSelectDropdown
            name="status"
            defaultValue="All"
            items={healthStatuses}
            className="inline-block w-auto max-w-[500px]"
            dropDownClassNames="w-auto max-w-[400px] left-0"
            prefix={
              <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
                Health:
              </div>
            }
          />

          <ComponentTypesDropdown
            className="flex"
            name="type"
            topologyTypes={topologyTypes}
          />

          <FormikFilterSelectDropdown
            name="team"
            defaultValue={"All"}
            items={teams}
            className="inline-block w-auto max-w-[500px]"
            dropDownClassNames="w-auto max-w-[400px] left-0"
            prefix={
              <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
                Team:
              </div>
            }
          />

          <ComponentLabelsDropdown
            name="labels"
            label=""
            className="flex w-auto max-w-[500px]"
          />

          <AgentNamesDropdown
            name="agent_id"
            className="inline-block w-auto max-w-[500px]"
            dropDownClassNames="w-auto max-w-[400px] left-0"
          />

          <div className="flex">
            <TopologySort sortLabels={sortLabels} />
          </div>
        </div>

        <TopologyPopOver
          size={topologyCardSize}
          setSize={setTopologyCardSize}
        />
      </div>
    </FormikFilterForm>
  );
}
