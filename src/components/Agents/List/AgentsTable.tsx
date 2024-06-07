import { DataTable } from "@flanksource-ui/ui/DataTable";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import AgentForm from "../Add/AddAgentForm";
import { AgentSummary } from "../AgentPage";
import { agentsTableColumns } from "./AgentsTableColumns";

type AgentsTableProps = {
  agents: AgentSummary[];
  isLoading?: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  setPageState?: (state: { pageIndex: number; pageSize: number }) => void;
  hiddenColumns?: string[];
  refresh?: () => void;
};

export default function AgentsTable({
  agents,
  isLoading,
  hiddenColumns = [],
  refresh = () => {}
}: AgentsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const agentId = searchParams.get("id") ?? undefined;

  const [sortState, onSortByChanged] = useReactTableSortState();

  const columns = useMemo(() => agentsTableColumns, []);

  return (
    <>
      <DataTable
        data={agents}
        columns={columns}
        isLoading={isLoading}
        handleRowClick={(agent) => {
          searchParams.set("id", agent.original.id!);
          setSearchParams(searchParams);
        }}
        stickyHead
        hiddenColumns={hiddenColumns}
        tableSortByState={sortState}
        onTableSortByChanged={onSortByChanged}
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
