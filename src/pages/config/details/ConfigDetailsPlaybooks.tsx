import { getPlaybookRuns } from "@flanksource-ui/api/services/playbooks";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import PlaybookRunsTable from "@flanksource-ui/components/Playbooks/Runs/PlaybookRunsList";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function ConfigDetailsPlaybooksPage() {
  const { id } = useParams();

  const { pageIndex, pageSize } = useReactTablePaginationState();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["playbookRuns", { pageIndex, pageSize, configId: id }],
    queryFn: () =>
      getPlaybookRuns({
        pageIndex,
        pageSize,
        configId: id
      })
  });

  const playbookRuns = data?.data;

  const totalEntries = data?.totalEntries;

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Config Playbooks"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Playbooks"
    >
      <div className={`flex h-full flex-1 flex-col space-y-2 overflow-auto`}>
        <div className="flex h-full flex-col overflow-x-auto overflow-y-hidden">
          <PlaybookRunsTable
            data={playbookRuns ?? []}
            isLoading={isLoading}
            numberOfPages={
              totalEntries ? Math.ceil(totalEntries / pageSize) : -1
            }
            totalRecords={totalEntries ?? 0}
          />
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
