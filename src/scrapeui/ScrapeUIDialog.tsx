import { getJobHistoryByID } from "@flanksource-ui/api/services/jobsHistory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import { App as ScrapeUIApp } from "@flanksource-ui/scrapeui/viewer/App";
import { useQuery } from "@tanstack/react-query";
import { Oval } from "react-loading-icons";

interface ScrapeUIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artifactId?: string;
  jobHistoryId?: string;
  title?: string;
}

const terminalStatuses = new Set(["SUCCESS", "FAILED", "WARNING", "STOPPED"]);

function isTerminal(status?: string) {
  return !!status && terminalStatuses.has(status);
}

function getRunArtifactID(jobHistory: any) {
  return (
    jobHistory?.details?.run_artifact_id ??
    jobHistory?.details?.runArtifactId ??
    jobHistory?.details?.artifact_id ??
    jobHistory?.details?.artifactId
  );
}

export function ScrapeUIDialog({
  open,
  onOpenChange,
  artifactId,
  jobHistoryId,
  title = "Scrape Run"
}: ScrapeUIDialogProps) {
  const { data: jobHistory } = useQuery({
    queryKey: ["job-history", jobHistoryId],
    queryFn: () => getJobHistoryByID(jobHistoryId!),
    enabled: open && !!jobHistoryId,
    refetchInterval: (data) => {
      const status = data?.status;
      const runArtifactId = getRunArtifactID(data);

      if (runArtifactId && isTerminal(status)) {
        return false;
      }

      if (isTerminal(status)) {
        return false;
      }

      return 2000;
    }
  });

  const resolvedArtifactId = artifactId ?? getRunArtifactID(jobHistory);
  const status = jobHistory?.status;
  const canRenderScrapeUI =
    !!resolvedArtifactId && (!jobHistoryId || isTerminal(status));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] w-[95vw] max-w-[95vw] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {resolvedArtifactId
              ? `Artifact: ${resolvedArtifactId}`
              : jobHistoryId
                ? `Job History: ${jobHistoryId}`
                : "Waiting for run artifact..."}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[calc(90vh-68px)] overflow-hidden">
          {canRenderScrapeUI ? (
            <ScrapeUIApp
              artifactId={resolvedArtifactId}
              syncRouteWithURL
              routeMode="search"
              containerClassName="flex h-full flex-col bg-gray-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-50 p-6">
              <div className="flex max-w-xl flex-col items-center gap-3 text-center">
                <Oval stroke="currentColor" className="h-5 w-5 text-gray-500" />
                <p className="text-sm text-gray-700">
                  Waiting for scraper run to complete and produce artifact...
                </p>
                {status && (
                  <p className="font-mono text-xs text-gray-500">
                    Status: {status}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
