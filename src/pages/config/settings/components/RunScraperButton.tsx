import { runConfigScraper } from "@flanksource-ui/api/schemaResources";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import { toastSuccess } from "@flanksource-ui/components/Toast/toast";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal } from "@flanksource-ui/ui/Modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@flanksource-ui/components/ui/select";
import { Switch } from "@flanksource-ui/components/ui/switch";
import { Play } from "lucide-react";
import { useState } from "react";
import { Oval } from "react-loading-icons";

const RUN_LOG_LEVELS = ["trace", "debug", "info", "warn", "error"] as const;
type RunLogLevel = (typeof RUN_LOG_LEVELS)[number];

type RunScraperSuccessPayload = {
  artifactId?: string;
  jobHistoryId?: string;
};

type Props = {
  scraperId: string;
  onRunStart: () => void;
  onRunComplete: () => void;
  onRunSuccess: (payload: RunScraperSuccessPayload) => void;
};

export function RunScraperButton({
  scraperId,
  onRunStart,
  onRunComplete,
  onRunSuccess
}: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [logLevel, setLogLevel] = useState<RunLogLevel>("info");
  const [captureHAR, setCaptureHAR] = useState(false);
  const [captureLogs, setCaptureLogs] = useState(true);
  const [captureSnapshots, setCaptureSnapshots] = useState(false);
  const [openScrapeUI, setOpenScrapeUI] = useState(true);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    onRunStart();
    try {
      const response = await runConfigScraper(scraperId, {
        logLevel,
        captureHAR,
        captureLogs,
        captureSnapshots
      });
      const payload = response?.data?.payload ?? response?.data;
      const runArtifactId = payload?.run_artifact_id;
      const jobHistoryId = payload?.job_history_id;

      toastSuccess("Scraper started successfully");
      setIsDialogOpen(false);

      if (openScrapeUI && (runArtifactId || jobHistoryId)) {
        onRunSuccess({
          artifactId: runArtifactId,
          jobHistoryId
        });
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsRunning(false);
      onRunComplete();
    }
  };

  return (
    <>
      <Button
        size="xs"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsDialogOpen(true);
        }}
        disabled={isRunning}
      >
        <Play className="mr-2 h-3.5 w-3.5" />
        Run
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>Run scraper</DialogTitle>
            <DialogDescription>
              Configure this run before starting the scraper.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Log level</p>
              <Select
                value={logLevel}
                onValueChange={(value) => setLogLevel(value as RunLogLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  {RUN_LOG_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Run options</p>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Capture logs
                  </p>
                  <p className="text-xs text-gray-500">
                    Include scraper runtime logs in job details.
                  </p>
                </div>
                <Switch
                  checked={captureLogs}
                  onCheckedChange={setCaptureLogs}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Capture snapshots
                  </p>
                  <p className="text-xs text-gray-500">
                    Capture and store snapshots while scraping.
                  </p>
                </div>
                <Switch
                  checked={captureSnapshots}
                  onCheckedChange={setCaptureSnapshots}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Capture HAR
                  </p>
                  <p className="text-xs text-gray-500">
                    Capture HTTP archive (HAR) for the run.
                  </p>
                </div>
                <Switch checked={captureHAR} onCheckedChange={setCaptureHAR} />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Open Scrape UI
                </p>
                <p className="text-xs text-gray-500">
                  Automatically open run output dialog after starting.
                </p>
              </div>
              <Switch
                checked={openScrapeUI}
                onCheckedChange={setOpenScrapeUI}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              disabled={isRunning}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleRun} disabled={isRunning}>
              {isRunning ? (
                <Oval stroke="currentColor" className="mr-2 h-3.5 w-3.5" />
              ) : (
                <Play className="mr-2 h-3.5 w-3.5" />
              )}
              Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Modal
        title="Scraper Run Failed"
        open={error !== null}
        onClose={() => setError(null)}
        size="medium"
      >
        <div className="p-4">
          <ErrorViewer error={error} />
        </div>
      </Modal>
    </>
  );
}
