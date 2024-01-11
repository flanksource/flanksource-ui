import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getPlaybookRuns } from "../../api/services/playbooks";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "../../components/BreadcrumbNav";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import PlaybookRunsTable from "../../components/Playbooks/Runs/PlaybookRunsList";
import { playbookRunsPageTabs } from "../../components/Playbooks/Runs/PlaybookRunsPageTabs";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components";
import { FaEdit } from "react-icons/fa";
import { useGetPlaybookSpecsDetails } from "../../api/query-hooks/playbooks";
import PlaybookSpecsForm from "../../components/Playbooks/Settings/PlaybookSpecsForm";

export default function PlaybookRunsPage() {
  const [isEditPlaybookFormOpen, setIsEditPlaybookFormOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const playbookId = searchParams.get("playbook") ?? undefined;

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const {
    data,
    isLoading: isLoadingPlaybookRuns,
    refetch
  } = useQuery({
    queryKey: ["playbookRuns", { pageIndex, pageSize, playbookId }],
    queryFn: () =>
      getPlaybookRuns({
        pageIndex,
        pageSize,
        playbookId
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
                    <BreadcrumbChild key={"/playbooks"} link={`/playbooks`}>
                      {playbook?.name}
                    </BreadcrumbChild>
                  ]
                : []),
              <BreadcrumbChild key={"/playbooks/runs"} link="/playbooks/runs">
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
            {playbookId && (
              <div className="flex flex-row justify-end w-full py-2 gap-2">
                <Button
                  text="Edit Playbook"
                  className="btn-white"
                  icon={<FaEdit />}
                  disabled={isLoading}
                  onClick={() => setIsEditPlaybookFormOpen(true)}
                />
              </div>
            )}
            <div className="flex flex-col flex-1">
              <PlaybookRunsTable
                data={playbookRuns ?? []}
                isLoading={isLoading}
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
