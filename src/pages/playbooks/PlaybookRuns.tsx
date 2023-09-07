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

export default function PlaybookRunsPage() {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["playbookRuns"],
    queryFn: () =>
      getPlaybookRuns({
        pageIndex,
        pageSize
      })
  });

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
      <Head prefix={"Playbook Runs"} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/playbooks">Playbooks</BreadcrumbRoot>,
              <BreadcrumbChild link="/playbooks/runs">Runs</BreadcrumbChild>
            ]}
          />
        }
        onRefresh={refetch}
        loading={isLoading}
        contentClass="flex flex-col p-0 h-full overflow-y-hidden"
      >
        <TabbedLinks tabLinks={playbookRunsPageTabs}>
          <div className={`flex flex-col max-w-screen-xl mx-auto h-full py-4`}>
            <PlaybookRunsTable
              data={playbookRuns ?? []}
              isLoading={isLoading}
              pagination={pagination}
            />
          </div>
        </TabbedLinks>
      </SearchLayout>
    </>
  );
}
