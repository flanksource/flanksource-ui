import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import { ScrapeRunViewer } from "./ScrapeRunViewer";

interface ScrapeRunViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobHistoryId: string;
  title?: string;
}

export function ScrapeRunViewerDialog({
  open,
  onOpenChange,
  jobHistoryId,
  title = "Scrape Run"
}: ScrapeRunViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] w-[95vw] max-w-[95vw] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            Job History: {jobHistoryId}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[calc(90vh-68px)] overflow-hidden">
          <ScrapeRunViewer
            jobHistoryId={jobHistoryId}
            syncRouteWithURL
            containerClassName="flex h-full flex-col bg-gray-100"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
