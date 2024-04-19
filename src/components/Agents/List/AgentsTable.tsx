import { DataTable } from "@flanksource-ui/ui/DataTable";
import { SortingState, Updater } from "@tanstack/react-table";
import { useMemo, useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentSummary>();

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
          setSelectedAgent(agent.original);
          setIsModalOpen(true);
        }}
        stickyHead
        hiddenColumns={hiddenColumns}
        tableSortByState={tableSortByState}
        onTableSortByChanged={onSortByChanged}
        enableServerSideSorting
      />

      {selectedAgent && (
        <AgentForm
          isOpen={isModalOpen}
          agent={{
            id: selectedAgent?.id!,
            name: selectedAgent?.name,
            properties: selectedAgent?.properties!
          }}
          onClose={() => {
            refresh();
            setIsModalOpen(false);
            setSelectedAgent(undefined);
          }}
          onUpdated={(agent) => {
            setIsModalOpen(false);
            refresh();
          }}
        />
      )}
    </>
  );
}
