import { ChangeEvent, useMemo, useState, useRef, useEffect } from "react";
import { Search, X, Play, Loader2, ChevronDown, Workflow } from "lucide-react";
import { useGetPlaybookSpecsDetails } from "@flanksource-ui/api/query-hooks/playbooks";
import { SubmitPlaybookRunFormValues } from "@flanksource-ui/components/Playbooks/Runs/Submit/SubmitPlaybookRunForm";
import SubmitPlaybookRunForm from "@flanksource-ui/components/Playbooks/Runs/Submit/SubmitPlaybookRunForm";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import EmptyState from "@flanksource-ui/components/EmptyState";
import { PanelResult } from "../../../types";
import mixins from "@flanksource-ui/utils/mixins.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@flanksource-ui/components/ui/card";
import { Input } from "@flanksource-ui/components/ui/input";
import { Button } from "@flanksource-ui/components/ui/button";
import { Badge } from "@flanksource-ui/components/ui/badge";
import { Separator } from "@flanksource-ui/components/ui/separator";

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
    () => (summary.rows as PlaybookRunRow[]) || [],
    [summary.rows]
  );
  const [selected, setSelected] = useState<PlaybookRunRow | null>(null);
  const [search, setSearch] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => {
      const title = row.title || row.name || "";
      return (
        title.toLowerCase().includes(term) ||
        (row.name ?? "").toLowerCase().includes(term) ||
        (row.description ?? "").toLowerCase().includes(term)
      );
    });
  }, [rows, search]);

  const { data: playbookSpec, isLoading } = useGetPlaybookSpecsDetails(
    selected?.id ?? "",
    {
      enabled: !!selected?.id
    }
  );

  const handleCloseModal = () => {
    setSelected(null);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchExpanded(false);
  };

  const handleToggleSearch = () => {
    setSearchExpanded(!searchExpanded);
  };

  // Focus input when search is expanded
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

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
  }, [filteredRows]); // Re-check when filtered rows change

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {/* Title and Badge - always visible */}
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{summary.name}</CardTitle>
            <Badge variant="secondary">
              {filteredRows?.length ?? 0}
              {rows && filteredRows && rows.length !== filteredRows.length
                ? `/${rows.length}`
                : ""}
            </Badge>
          </div>

          {/* Spacer to push search to the right */}
          <div className="flex-1"></div>

          {/* Search Input - expands to the left when active */}
          <div
            className={`relative transition-all duration-300 ${
              searchExpanded
                ? "w-64 opacity-100"
                : "w-0 overflow-hidden opacity-0"
            }`}
          >
            <Input
              ref={searchInputRef}
              id="playbook-panel-search"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search playbooks..."
              className="h-9 pr-9 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Toggle Button - always on far right */}
          <button
            onClick={handleToggleSearch}
            className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
            aria-label="Toggle search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
        {summary.description && !searchExpanded && (
          <CardDescription>{summary.description}</CardDescription>
        )}
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-1 flex-col overflow-hidden p-4">
        {/* Playbook List */}
        <div className="relative min-h-0 flex-1">
          <div
            ref={scrollContainerRef}
            className={`h-full overflow-y-auto ${mixins.hoverScrollbar}`}
          >
            {(!rows || rows.length === 0) && (
              <EmptyState title="No playbooks" />
            )}

            {rows && rows.length > 0 && filteredRows.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  No playbooks found
                </p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search term
                </p>
              </div>
            )}

            {filteredRows && filteredRows.length > 0 && (
              <div className="space-y-1">
                {filteredRows.map((row) => {
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
                          onClick={() => setSelected(row)}
                          disabled={isCurrentlyLoading}
                          className="flex-shrink-0"
                        >
                          {isCurrentlyLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Run
                            </>
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
      </CardContent>

      {playbookSpec && selected && (
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
    </Card>
  );
}
