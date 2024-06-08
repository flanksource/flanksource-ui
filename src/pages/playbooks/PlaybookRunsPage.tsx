import { getPlaybookRuns } from "@flanksource-ui/api/services/playbooks";
import { Head } from "@flanksource-ui/components/Head/Head";
import { SearchLayout } from "@flanksource-ui/components/Layout";
import PlaybookRunsFilterBar from "@flanksource-ui/components/Playbooks/Runs/Filter/PlaybookRunsFilterBar";
import PlaybookRunsTable from "@flanksource-ui/components/Playbooks/Runs/PlaybookRunsList";
import { playbookRunsPageTabs } from "@flanksource-ui/components/Playbooks/Runs/PlaybookRunsPageTabs";
import PlaybookSpecIcon from "@flanksource-ui/components/Playbooks/Settings/PlaybookSpecIcon";
import PlaybookSpecsForm from "@flanksource-ui/components/Playbooks/Settings/PlaybookSpecsForm";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetPlaybookSpecsDetails } from "../../api/query-hooks/playbooks";

export default function PlaybookRunsPage() {
  const [isEditPlaybookFormOpen, setIsEditPlaybookFormOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const playbookId = searchParams.get("playbook") ?? undefined;
  const playbookStatus = searchParams.get("status") ?? undefined;

  const { timeRangeAbsoluteValue: timeRange } = useTimeRangeParams();

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const {
    data,
    isLoading: isLoadingPlaybookRuns,
    refetch
  } = useQuery({
    queryKey: [
      "playbookRuns",
      { pageIndex, pageSize, playbookId, playbookStatus, timeRange }
    ],
    queryFn: () =>
      getPlaybookRuns({
        pageIndex,
        pageSize,
        playbookId,
        status: playbookStatus,
        starts: timeRange?.from ?? undefined,
        ends: timeRange?.to ?? undefined
      })
  });

  const { data: playbook, isLoading: isLoadingPlaybook } =
    useGetPlaybookSpecsDetails(playbookId!, {
      enabled: !!playbookId
    });

  const isLoading = isLoadingPlaybookRuns || isLoadingPlaybook;

  const playbookRuns = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading
    };
  }, [setPageState, pageIndex, pageSize, pageCount, isLoading]);

  return (
    <>
      <Head
        prefix={
          playbookId ? `${playbook?.name} Playbook Runs` : "Playbook Runs"
        }
      />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key={"playbooks"} link="/playbooks">
                Playbooks
              </BreadcrumbRoot>,
              ...(playbook
                ? [
                    <BreadcrumbChild
                      key={"/playbooks"}
                      link={`/playbooks/runs?playbook=${playbookId}`}
                    >
                      <PlaybookSpecIcon playbook={playbook} showLabel />
                    </BreadcrumbChild>
                  ]
                : []),
              <BreadcrumbChild key={"/playbooks/runs"} link={`/playbooks/runs`}>
                Runs
              </BreadcrumbChild>
            ]}
          />
        }
        onRefresh={refetch}
        loading={isLoading}
        contentClass="flex flex-col p-0 h-full overflow-y-hidden"
      >
        <TabbedLinks tabLinks={playbookRunsPageTabs}>
          <div className={`flex flex-col max-w-screen-xl mx-auto h-full py-4`}>
            <div className="flex flex-row justify-between w-full py-2 gap-2">
              <PlaybookRunsFilterBar
                isLoading={isLoading}
                playbookId={playbookId}
                setIsEditPlaybookFormOpen={setIsEditPlaybookFormOpen}
                playbook={playbook}
              />
            </div>
            <div className="flex flex-col flex-1">
              <PlaybookRunsTable
                data={playbookRuns ?? []}
                isLoading={isLoadingPlaybookRuns}
                pagination={pagination}
              />
            </div>
          </div>
        </TabbedLinks>
        {playbook && (
          <PlaybookSpecsForm
            isOpen={isEditPlaybookFormOpen}
            onClose={() => {
              setIsEditPlaybookFormOpen(false);
            }}
            refresh={refetch}
            playbook={playbook}
          />
        )}
      </SearchLayout>
    </>
  );
}
