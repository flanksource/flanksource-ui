import { getPlaybookRunsWithActions } from "@flanksource-ui/api/services/playbooks";
import { CheckLink } from "@flanksource-ui/components/Canary/HealthChecks/CheckLink";
import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import PlaybookRunDetailView from "@flanksource-ui/components/Playbooks/Runs/Actions/PlaybookRunsActions";
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
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
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
    data: playbookRunsWithActions,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["playbookRuns", id],
    queryFn: () => getPlaybookRunsWithActions(id!),
    enabled: !!id,
    staleTime: 0,
    cacheTime: 0,
    // We want to refetch the playbook run every 5 seconds when the page is in
    // the background.
    refetchIntervalInBackground: true,
    // When the playbook run is running or pending, we want to refetch every 5
    // seconds to get the latest status. Otherwise, we don't want to refetch at
    // all.
    refetchInterval: (playbookRun) => {
      if (
        playbookRun?.status !== "completed" &&
        playbookRun?.status !== "failed" &&
        playbookRun?.status !== "cancelled"
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
              ...(playbookRunsWithActions?.playbooks
                ? [
                    <BreadcrumbChild
                      key={`/playbooks/${playbookRunsWithActions?.playbooks.id}`}
                      link={`/playbooks/runs?playbook=${playbookRunsWithActions?.playbooks.id}`}
                    >
                      <PlaybookSpecIcon
                        playbook={playbookRunsWithActions?.playbooks}
                        showLabel
                      />
                    </BreadcrumbChild>
                  ]
                : []),

              <BreadcrumbChild key={playbookRunsWithActions?.start_time}>
                <span className="flex flex-row items-center gap-2">
                  {playbookRunsWithActions?.config ? (
                    <ConfigLink
                      config={playbookRunsWithActions.config}
                      showPrimaryIcon={false}
                      className=""
                    />
                  ) : null}
                  {playbookRunsWithActions?.component ? (
                    <TopologyLink
                      topology={playbookRunsWithActions.component}
                      className=""
                      linkClassName=""
                      size="md"
                    />
                  ) : null}
                  {playbookRunsWithActions?.check ? (
                    <CheckLink check={playbookRunsWithActions.check} />
                  ) : null}

                  <PlaybookStatusIcon
                    status={playbookRunsWithActions?.status!}
                  />
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
          <div className={`mx-auto flex h-full w-full flex-col p-4`}>
            {playbookRunsWithActions ? (
              <PlaybookRunDetailView
                data={playbookRunsWithActions}
                refetch={refetch}
              />
            ) : (
              <CardsSkeletonLoader />
            )}
          </div>
        </TabbedLinks>
      </SearchLayout>
    </>
  );
}
