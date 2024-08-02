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
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import { useQuery } from "@tanstack/react-query";
import { FaHome } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function PlaybookRunsDetailsPage() {
  const { id } = useParams();

  const {
    data: playbookRun,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["playbookRuns", id],
    queryFn: () => getPlaybookRun(id!),
    enabled: !!id
  });

  return (
    <>
      <Head prefix={"Playbook Runs"} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key={"/playbooks"} link="/playbooks">
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
                <span className="flex flex-row gap-2">
                  {playbookRun?.config ? (
                    <ConfigLink
                      config={playbookRun.config}
                      showPrimaryIcon={false}
                    />
                  ) : null}
                  {playbookRun?.component ? (
                    <TopologyLink topology={playbookRun.component} />
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
        onRefresh={refetch}
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
