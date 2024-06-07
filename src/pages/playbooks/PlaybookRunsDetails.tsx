import { getPlaybookRun } from "@flanksource-ui/api/services/playbooks";
import { SearchLayout } from "@flanksource-ui/components/Layout/SearchLayout";
import PlaybookRunsActions from "@flanksource-ui/components/Playbooks/Runs/Actions/PlaybookRunsActions";
import { playbookRunsPageTabs } from "@flanksource-ui/components/Playbooks/Runs/PlaybookRunsPageTabs";
import PlaybookSpecIcon from "@flanksource-ui/components/Playbooks/Settings/PlaybookSpecIcon";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import CardsSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/CardsSkeletonLoader";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import { relativeDateTime } from "@flanksource-ui/utils/date";
import { useQuery } from "@tanstack/react-query";
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
                Playbooks
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
              <BreadcrumbChild key={`/playbooks/runs`} link="/playbooks/runs">
                Runs
              </BreadcrumbChild>,
              ...(playbookRun?.start_time
                ? [
                    <BreadcrumbChild key={playbookRun.start_time}>
                      {relativeDateTime(playbookRun.start_time)}
                    </BreadcrumbChild>
                  ]
                : [
                    <BreadcrumbChild key={playbookRun?.id}>
                      {playbookRun?.id}
                    </BreadcrumbChild>
                  ])
            ]}
          />
        }
        onRefresh={refetch}
        loading={isLoading}
        contentClass="flex flex-col p-0 h-full overflow-y-hidden"
      >
        <TabbedLinks activeTabName={`Runs`} tabLinks={playbookRunsPageTabs}>
          <div className={`flex flex-col mx-auto h-full p-4`}>
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
