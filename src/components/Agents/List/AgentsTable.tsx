import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import AgentForm from "../Add/AddAgentForm";
import { AgentSummary } from "../AgentPage";
import { agentsTableColumns } from "./AgentsTableColumns";

type AgentsTableProps = {
  agents: AgentSummary[];
  isLoading?: boolean;
  isRefetching?: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  refresh?: () => void;
};

export default function AgentsTable({
  agents,
  isLoading,
  isRefetching,
  refresh = () => {}
}: AgentsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const agentId = searchParams.get("id") ?? undefined;

  const columns = useMemo(() => agentsTableColumns, []);

  return (
    <>
      <MRTDataTable
        data={agents}
        columns={columns}
        isLoading={isLoading}
        isRefetching={isRefetching}
        onRowClick={(agent) => {
          searchParams.set("id", agent.id!);
          setSearchParams(searchParams);
        }}
        enableServerSideSorting
      />
      {agentId && (
        <AgentForm
          isOpen={!!agentId}
          id={agentId}
          onClose={() => {
            refresh();
            searchParams.delete("id");
            setSearchParams(searchParams);
          }}
          onUpdated={() => {
            searchParams.delete("id");
            setSearchParams(searchParams);
            refresh();
          }}
        />
      )}
    </>
  );
}
