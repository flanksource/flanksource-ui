import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import { App as ScrapeUIApp } from "@flanksource-ui/scrapeui/viewer/App";

interface ScrapeUIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artifactId: string;
  title?: string;
}

export function ScrapeUIDialog({
  open,
  onOpenChange,
  artifactId,
  title = "Scrape Run"
}: ScrapeUIDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] w-[95vw] max-w-[95vw] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            Artifact: {artifactId}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[calc(90vh-68px)] overflow-hidden">
          <ScrapeUIApp
            artifactId={artifactId}
            syncRouteWithURL
            routeMode="search"
            containerClassName="flex h-full flex-col bg-gray-100"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
