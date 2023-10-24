import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPlaybookRun } from "../../api/services/playbooks";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "../../components/BreadcrumbNav";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import PlaybookRunsActions from "../../components/Playbooks/Runs/Actions/PlaybookRunsActions";
import { playbookRunsPageTabs } from "../../components/Playbooks/Runs/PlaybookRunsPageTabs";
import CardsSkeletonLoader from "../../components/SkeletonLoader/CardsSkeletonLoader";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { relativeDateTime } from "../../utils/date";

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
              <BreadcrumbRoot link="/playbooks">Playbooks</BreadcrumbRoot>,
              ...(playbookRun?.playbooks
                ? [
                    <BreadcrumbChild
                      link={`/playbooks/${playbookRun?.playbooks.id}`}
                    >
                      {playbookRun?.playbooks.name}
                    </BreadcrumbChild>
                  ]
                : []),
              <BreadcrumbChild link="/playbooks/runs">Runs</BreadcrumbChild>,
              ...(playbookRun?.start_time
                ? [
                    <BreadcrumbChild>
                      {relativeDateTime(playbookRun.start_time)}
                    </BreadcrumbChild>
                  ]
                : [<BreadcrumbChild>{playbookRun?.id}</BreadcrumbChild>])
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
