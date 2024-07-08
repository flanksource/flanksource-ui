import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { Tab, Tabs } from "@flanksource-ui/ui/Tabs/Tabs";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../ui/Modal";
import { JobHistory } from "./JobsHistoryTable";

interface CellProps {
  children: React.ReactNode;
  className?: string;
}

function HCell({ children, className }: CellProps) {
  return <th className={className}>{children}</th>;
}

function Cell({ children, className }: CellProps) {
  return (
    <td className={clsx("px-3 py-3 text-sm border-b", className)}>
      {children}
    </td>
  );
}

function JobHistoryErrorDetails({ errors }: { errors?: string[] }) {
  if (!errors || isEmpty(errors)) {
    return null;
  }

  return (
    <table
      className="table-auto table-fixed w-full relative"
      aria-label="table"
    >
      <thead className={`bg-white sticky top-0 z-01`}>
        <tr>
          <HCell>Error</HCell>
        </tr>
      </thead>
      <tbody>
        {errors?.map((error, index) => (
          <tr key={error} className="last:border-b-0 border-b cursor-pointer">
            <Cell className="leading-5 text-gray-900 font-medium">{error}</Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function JobHistoryScrapeSummary({
  scrapeSummary
}: {
  scrapeSummary?: Record<string, Record<string, any>>;
}) {
  if (!scrapeSummary || isEmpty(scrapeSummary)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <JSONViewer
        code={JSON.stringify(scrapeSummary, null, 2)}
        convertToYaml
        format={"json"}
      />
    </div>
  );
}

function JobHistoryReconcileSummary({
  summary
}: {
  summary?: Record<string, Record<string, any>>;
}) {
  if (!summary || isEmpty(summary)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <JSONViewer
        code={JSON.stringify(summary, null, 2)}
        convertToYaml
        format={"json"}
      />
    </div>
  );
}

type ActiveTab = "errors" | "scrape_summary" | "summary";

type JobsHistoryDetailsProps = {
  job?: Pick<JobHistory, "details" | "name">;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};

export function JobsHistoryDetails({
  job,
  isModalOpen,
  setIsModalOpen
}: JobsHistoryDetailsProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (job?.details?.errors) {
      return "errors";
    }
    if (job?.details?.scrape_summary) {
      return "scrape_summary";
    }
    return "summary";
  });

  // update active tab if job details change
  useEffect(() => {
    if (job?.details?.errors) {
      setActiveTab("errors");
    } else if (job?.details?.scrape_summary) {
      setActiveTab("scrape_summary");
    } else {
      setActiveTab("summary");
    }
  }, [job]);

  const tabs = useMemo(() => {
    if (!job) {
      return [];
    }

    return [
      ...(job.details?.errors
        ? [
            {
              value: "errors",
              label: "Errors",
              component: <JobHistoryErrorDetails errors={job.details?.errors} />
            }
          ]
        : []),
      ...(job.details?.scrape_summary
        ? [
            {
              value: "scrape_summary",
              label: "Scrape Summary",
              component: (
                <JobHistoryScrapeSummary
                  scrapeSummary={job.details?.scrape_summary}
                />
              )
            }
          ]
        : []),
      ...(job.details?.summary
        ? [
            {
              label: "Reconcile Summary",
              value: "summary",
              component: (
                <JobHistoryReconcileSummary summary={job.details?.summary} />
              )
            }
          ]
        : [])
    ];
  }, [job]);

  if (!hasValidJobDetails(job)) {
    return null;
  }

  return (
    <Modal
      title={`Details for job ${job.name}`}
      onClose={() => setIsModalOpen(false)}
      open={isModalOpen}
    >
      <div className="flex flex-col overflow-y-auto justify-center p-4">
        <div
          className="overflow-y-auto flex flex-col"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <Tabs
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            className="w-full"
          >
            {tabs.map(({ label, component, value }) => {
              return (
                <Tab
                  key={label}
                  label={label}
                  value={value}
                  className="flex flex-col p-2 w-full"
                >
                  <div className={`flex flex-col gap-4`}>{component}</div>
                </Tab>
              );
            })}
          </Tabs>
        </div>
      </div>
    </Modal>
  );
}

function hasValidJobDetails(
  job: Pick<JobHistory, "name" | "details"> | undefined
): job is Pick<JobHistory, "name" | "details"> {
  return !(
    !job ||
    ((!job.details?.errors || isEmpty(job.details?.errors)) &&
      (!job.details?.scrape_summary || isEmpty(job.details?.scrape_summary)) &&
      (!job.details?.summary || isEmpty(job.details?.summary)))
  );
}
