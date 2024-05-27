import { DataTable } from "@flanksource-ui/ui/DataTable";
import { SortingState, Updater } from "@tanstack/react-table";
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
  sortBy: string;
  sortOrder: string;
  setPageState?: (state: { pageIndex: number; pageSize: number }) => void;
  hiddenColumns?: string[];
  onSortByChanged?: (sortByState: Updater<SortingState>) => void;
  refresh?: () => void;
};

export default function AgentsTable({
  agents,
  isLoading,
  hiddenColumns = [],
  sortBy,
  sortOrder,
  onSortByChanged = () => {},
  refresh = () => {}
}: AgentsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const agentId = searchParams.get("id") ?? undefined;

  const tableSortByState = useMemo(() => {
    return [
      {
        id: sortBy,
        desc: sortOrder === "desc"
      }
    ];
  }, [sortBy, sortOrder]);

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
        tableSortByState={tableSortByState}
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
          onUpdated={(agent) => {
            searchParams.delete("id");
            setSearchParams(searchParams);
            refresh();
          }}
        />
      )}
    </>
  );
}
