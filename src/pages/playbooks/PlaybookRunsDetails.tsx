import { getPlaybookRun } from "@flanksource-ui/api/services/playbooks";
import { CheckLink } from "@flanksource-ui/components/Canary/HealthChecks/CheckLink";
import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import { SearchLayout } from "@flanksource-ui/components/Layout/SearchLayout";
import PlaybookRunsActions from "@flanksource-ui/components/Playbooks/Runs/Actions/PlaybookRunsActions";
import { playbookRunsPageTabs } from "@flanksource-ui/components/Playbooks/Runs/PlaybookRunsPageTabs";
import PlaybookSpecIcon from "@flanksource-ui/components/Playbooks/Settings/PlaybookSpecIcon";
import { TopologyLink } from "@flanksource-ui/components/Topology/TopologyLink";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { PlaybookStatusIcon } from "@flanksource-ui/ui/Icons/PlaybookStatusIcon";
import CardsSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/CardsSkeletonLoader";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { FaHome } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function PlaybookRunsDetailsPage() {
  const { id } = useParams();

  const [, setRefreshTrigger] = useAtom(refreshButtonClickedTrigger);

  const {
    data: playbookRun,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["playbookRuns", id],
    queryFn: () => getPlaybookRun(id!),
    enabled: !!id,
    staleTime: 0,
    cacheTime: 0,
    // When the playbook run is running or pending, we want to refetch every 5
    // seconds to get the latest status. Otherwise, we don't want to refetch at
    // all.
    refetchInterval: (playbookRun) => {
      if (
        playbookRun?.status === "running" ||
        playbookRun?.status === "waiting" ||
        playbookRun?.status === "pending"
      ) {
        return 2000;
      }
      return false;
    }
  });

  return (
    <>
      <Head prefix={"Playbook Runs"} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key={"/playbooks/runs"} link="/playbooks/runs">
                <FaHome className="text-black" />
              </BreadcrumbRoot>,
              ...(playbookRun?.playbooks
                ? [
                    <BreadcrumbChild
                      key={`/playbooks/${playbookRun?.playbooks.id}`}
                      link={`/playbooks/runs?playbook=${playbookRun?.playbooks.id}`}
                    >
                      <PlaybookSpecIcon
                        playbook={playbookRun?.playbooks}
                        showLabel
                      />
                    </BreadcrumbChild>
                  ]
                : []),

              <BreadcrumbChild key={playbookRun?.start_time}>
                <span className="flex flex-row items-center gap-2">
                  {playbookRun?.config ? (
                    <ConfigLink
                      config={playbookRun.config}
                      showPrimaryIcon={false}
                      className=""
                    />
                  ) : null}
                  {playbookRun?.component ? (
                    <TopologyLink
                      topology={playbookRun.component}
                      className=""
                      linkClassName=""
                      size="md"
                    />
                  ) : null}
                  {playbookRun?.check ? (
                    <CheckLink check={playbookRun.check} />
                  ) : null}

                  <PlaybookStatusIcon status={playbookRun?.status!} />
                </span>
              </BreadcrumbChild>
            ]}
          />
        }
        onRefresh={() => {
          setRefreshTrigger((prev) => prev++);
          refetch();
        }}
        loading={isLoading}
        contentClass="flex flex-col p-0 h-full overflow-y-hidden"
      >
        <TabbedLinks activeTabName={`Runs`} tabLinks={playbookRunsPageTabs}>
          <div className={`mx-auto flex h-full flex-col p-4`}>
            {playbookRun ? (
              <PlaybookRunsActions data={playbookRun} />
            ) : (
              <CardsSkeletonLoader />
            )}
          </div>
        </TabbedLinks>
      </SearchLayout>
    </>
  );
}
