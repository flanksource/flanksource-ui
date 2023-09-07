import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPlaybookRun } from "../../api/services/playbooks";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "../../components/BreadcrumbNav";
import { SearchLayout } from "../../components/Layout";
import PlaybookRunsActions from "../../components/Playbooks/Runs/PlaybookRunsActions";
import CardsSkeletonLoader from "../../components/SkeletonLoader/CardsSkeletonLoader";
import { Head } from "../../components/Head/Head";
import { playbookRunsPageTabs } from "../../components/Playbooks/Runs/PlaybookRunsPageTabs";
import TabbedLinks from "../../components/Tabs/TabbedLinks";

export default function PlaybookRunsDetailsPage() {
  const { id } = useParams();

  const {
    data: playbookRuns,
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
              <BreadcrumbChild link="/playbooks/runs">Runs</BreadcrumbChild>,
              <BreadcrumbChild>{id}</BreadcrumbChild>
            ]}
          />
        }
        onRefresh={refetch}
        loading={isLoading}
        contentClass="flex flex-col p-0 h-full overflow-y-hidden"
      >
        <TabbedLinks activeTabName={`Runs`} tabLinks={playbookRunsPageTabs}>
          <div className={`flex flex-col mx-auto h-full p-4`}>
            {playbookRuns ? (
              <PlaybookRunsActions data={playbookRuns} />
            ) : (
              <CardsSkeletonLoader />
            )}
          </div>
        </TabbedLinks>
      </SearchLayout>
    </>
  );
}
