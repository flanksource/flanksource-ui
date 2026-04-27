import { useSearchParams } from "react-router-dom";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import { Tab, Tabs } from "../../ui/Tabs/Tabs";
import JobsHistoryLogsTab from "./JobsHistoryLogsTab";
import JobsHistorySummaryTab from "./JobsHistorySummaryTab";

type JobsHistoryTab = "summary" | "logs";

export default function JobsHistorySettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: JobsHistoryTab =
    searchParams.get("tab") === "logs" ? "logs" : "summary";

  const setActiveTab = (tab: JobsHistoryTab) => {
    setSearchParams((params) => {
      params.set("tab", tab);
      params.delete("pageIndex");
      return params;
    });
  };

  return (
    <>
      <Head prefix="Job History" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key={"history"} link="/settings/jobs">
                Job History
              </BreadcrumbRoot>
            ]}
          />
        }
        contentClass="p-0 h-full"
      >
        <div className="flex h-full w-full flex-1 flex-col p-4 pb-0">
          <Tabs
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            contentClassName="flex min-h-0 flex-1 flex-col bg-white"
          >
            <Tab
              label="Summary"
              value="summary"
              className="mt-4 flex min-h-0 flex-1 flex-col"
            >
              <JobsHistorySummaryTab active={activeTab === "summary"} />
            </Tab>
            <Tab
              label="Logs"
              value="logs"
              className="flex min-h-0 flex-1 flex-col"
            >
              <JobsHistoryLogsTab active={activeTab === "logs"} />
            </Tab>
          </Tabs>
        </div>
      </SearchLayout>
    </>
  );
}
