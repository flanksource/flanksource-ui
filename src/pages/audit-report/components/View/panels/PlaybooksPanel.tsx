import { useMemo, useState, useRef, useEffect } from "react";
import { Loader2, ChevronDown, Workflow } from "lucide-react";
import { useGetPlaybookSpecsDetails } from "@flanksource-ui/api/query-hooks/playbooks";
import { SubmitPlaybookRunFormValues } from "@flanksource-ui/components/Playbooks/Runs/Submit/SubmitPlaybookRunForm";
import SubmitPlaybookRunForm from "@flanksource-ui/components/Playbooks/Runs/Submit/SubmitPlaybookRunForm";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import EmptyState from "@flanksource-ui/components/EmptyState";
import { PanelResult } from "../../../types";
import mixins from "@flanksource-ui/utils/mixins.module.css";
import { Button } from "@flanksource-ui/components/ui/button";
import PanelWrapper from "./PanelWrapper";

type PlaybookRunRow = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  icon?: string;
  component_id?: string;
  config_id?: string;
  check_id?: string;
  params?: SubmitPlaybookRunFormValues["params"];
};

type PlaybookRunPanelProps = {
  summary: PanelResult;
};

/**
 * A panel that lists playbooks with inline Run buttons and opens the existing
 * SubmitPlaybookRunForm modal when a playbook is selected.
 */
export default function PlaybooksPanel({ summary }: PlaybookRunPanelProps) {
  const rows = useMemo(
    () =>
      (summary.rows || []).filter(
        (row): row is PlaybookRunRow =>
          typeof row === "object" &&
          row !== null &&
          typeof row.id === "string" &&
          row.id.length > 0
      ),
    [summary.rows]
  );
  const [selected, setSelected] = useState<PlaybookRunRow | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: playbookSpec, isLoading } = useGetPlaybookSpecsDetails(
    selected?.id ?? "",
    {
      enabled: !!selected?.id
    }
  );

  const handleCloseModal = () => {
    setSelected(null);
  };

  // Check scroll position to show/hide indicator
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isScrollable = scrollHeight > clientHeight;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10; // 10px threshold

    setShowScrollIndicator(isScrollable && !isAtBottom);
  };

  // Set up scroll listener and check initial state
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();

    container.addEventListener("scroll", checkScrollPosition);
    return () => container.removeEventListener("scroll", checkScrollPosition);
  }, [rows]); // Re-check when rows change

  return (
    <PanelWrapper title={summary.name} description={summary.description}>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Playbook List */}
        <div className="relative min-h-0 flex-1">
          <div
            ref={scrollContainerRef}
            className={`h-full overflow-y-auto ${mixins.hoverScrollbar}`}
          >
            {(!rows || rows.length === 0) && (
              <EmptyState title="No playbooks" />
            )}

            {rows && rows.length > 0 && (
              <div className="space-y-1">
                {rows.map((row) => {
                  const title = row.title || row.name || "Playbook";
                  const isCurrentlyLoading =
                    isLoading && selected?.id === row.id;

                  return (
                    <div
                      key={row.id}
                      className="group rounded-lg border border-transparent px-3 py-2 transition-all hover:border-gray-200 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <div className="flex-shrink-0">
                            {row.icon ? (
                              <Icon
                                name={row.icon}
                                className="h-4 w-4 text-gray-600"
                              />
                            ) : (
                              <Workflow className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {title}
                            </p>
                            {row.description && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {row.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelected(row)}
                          disabled={isCurrentlyLoading}
                          className="h-7 flex-shrink-0 gap-1.5 px-4"
                        >
                          {isCurrentlyLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-xs">Loading</span>
                            </>
                          ) : (
                            <span className="text-xs font-medium">Run</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          {showScrollIndicator && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center pb-2">
              <div className="flex flex-col items-center gap-1 rounded-full bg-gradient-to-t from-white via-white to-transparent px-3 py-2">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>

      {playbookSpec && selected && playbookSpec.id === selected.id && (
        <SubmitPlaybookRunForm
          isOpen={!!selected}
          onClose={handleCloseModal}
          playbook={playbookSpec}
          componentId={selected.component_id}
          configId={selected.config_id}
          checkId={selected.check_id}
          params={selected.params}
        />
      )}
    </PanelWrapper>
  );
}
