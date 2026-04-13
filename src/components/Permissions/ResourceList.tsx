import { Button } from "@flanksource-ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@flanksource-ui/components/ui/select";
import { Switch as SegmentedSwitch } from "@flanksource-ui/ui/FormControls/Switch";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ReactNode } from "react";
import type {
  McpSubjectResource,
  ResourceAccess
} from "./ResourceSelectorPanel";
import ResourceRow from "./ResourceRow";

const BULK_OPTIONS = ["Deny All", "Custom", "Allow All"] as const;
type BulkOption = (typeof BULK_OPTIONS)[number];

const RESOURCE_SORT_OPTIONS = ["deny", "allow", "alphabetical"] as const;
export type ResourceSortOption = (typeof RESOURCE_SORT_OPTIONS)[number];
export type ResourceSortDirection = "asc" | "desc";

const RESOURCE_SORT_OPTION_LABELS: Record<ResourceSortOption, string> = {
  deny: "Deny",
  allow: "Allow",
  alphabetical: "Alphabetical"
};

type ResourceListProps = {
  title: string;
  emptyMessage: string;
  defaultIcon: string;
  resources: McpSubjectResource[];
  sort: ResourceSortOption;
  sortDirection: ResourceSortDirection;
  onSortChange: (sort: ResourceSortOption) => void;
  onSortDirectionToggle: () => void;
  bulkAccess: ResourceAccess;
  onBulkAccessChange: (access: ResourceAccess) => void;
  accessByResourceKey: Record<string, ResourceAccess>;
  getResourceKey: (resource: McpSubjectResource) => string;
  getEffectiveBadge: (resource: McpSubjectResource) => ReactNode;
  isListLocked: boolean;
  isSubmitting: boolean;
  mutatingResourceIds: Record<string, true>;
  onSetResourceAccess: (
    resource: McpSubjectResource,
    access: ResourceAccess
  ) => Promise<void> | void;
};

export default function ResourceList({
  title,
  emptyMessage,
  defaultIcon,
  resources,
  sort,
  sortDirection,
  onSortChange,
  onSortDirectionToggle,
  bulkAccess,
  onBulkAccessChange,
  accessByResourceKey,
  getResourceKey,
  getEffectiveBadge,
  isListLocked,
  isSubmitting,
  mutatingResourceIds,
  onSetResourceAccess
}: ResourceListProps) {
  const bulkOptionValue: BulkOption =
    bulkAccess === "allow"
      ? "Allow All"
      : bulkAccess === "deny"
        ? "Deny All"
        : "Custom";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={
              isSubmitting || resources.length === 0
                ? "pointer-events-none opacity-60"
                : undefined
            }
            aria-disabled={isSubmitting || resources.length === 0 || undefined}
          >
            <SegmentedSwitch
              size="sm"
              className="w-48"
              itemsClassName="flex-1 justify-center"
              options={[...BULK_OPTIONS]}
              value={bulkOptionValue}
              onChange={(value) => {
                const access: ResourceAccess =
                  value === "Allow All"
                    ? "allow"
                    : value === "Deny All"
                      ? "deny"
                      : "default";
                onBulkAccessChange(access);
              }}
              getActiveItemClassName={(option) =>
                option === "Allow All"
                  ? "!bg-green-600 !text-white !ring-green-600"
                  : option === "Deny All"
                    ? "!bg-red-600 !text-white !ring-red-600"
                    : undefined
              }
            />
          </div>

          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as ResourceSortOption)}
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {RESOURCE_SORT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {RESOURCE_SORT_OPTION_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8"
            disabled={resources.length === 0}
            aria-label={
              sortDirection === "asc" ? "Sort ascending" : "Sort descending"
            }
            onClick={onSortDirectionToggle}
          >
            {sortDirection === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-gray-200">
        {resources.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">{emptyMessage}</div>
        ) : (
          resources.map((resource) => (
            <ResourceRow
              key={resource.id}
              resource={resource}
              access={
                accessByResourceKey[getResourceKey(resource)] ?? "default"
              }
              defaultIcon={defaultIcon}
              effectiveBadge={getEffectiveBadge(resource)}
              isListLocked={isListLocked}
              isSubmitting={isSubmitting}
              isMutating={Boolean(mutatingResourceIds[resource.id])}
              onSetResourceAccess={onSetResourceAccess}
            />
          ))
        )}
      </div>
    </div>
  );
}
