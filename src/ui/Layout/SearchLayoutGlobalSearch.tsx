import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Cable,
  ChevronRight,
  Database,
  GitCompareArrows,
  HeartPulse,
  ListChecks,
  Loader2,
  Search,
  type LucideIcon
} from "lucide-react";

import {
  searchResources,
  SearchResourcesRequest,
  SearchedResource
} from "@flanksource-ui/api/services/search";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import { Badge } from "@flanksource-ui/components/ui/badge";
import { Checkbox } from "@flanksource-ui/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from "@flanksource-ui/components/ui/command";
import { Dialog, DialogContent } from "@flanksource-ui/components/ui/dialog";

const SEARCH_RESULT_LIMIT = 10;

type SearchResourceType =
  | "configs"
  | "canaries"
  | "checks"
  | "config_changes"
  | "playbooks"
  | "connections";

type EnabledSearchTypeState = Record<SearchResourceType, boolean>;

type SearchTypeOption = {
  key: SearchResourceType;
  label: string;
  icon: LucideIcon;
};

type SearchableResource = SearchedResource & {
  summary?: string;
  change_type?: string;
  config_id?: string;
};

type FlattenedSearchResult = {
  key: string;
  value: string;
  href: string;
  title: string;
  description: string;
  resourceType: SearchResourceType;
  icon: LucideIcon;
};

const SEARCH_TYPE_OPTIONS: SearchTypeOption[] = [
  { key: "configs", label: "Configs", icon: Database },
  { key: "canaries", label: "Canaries", icon: HeartPulse },
  { key: "checks", label: "Checks", icon: ListChecks },
  {
    key: "config_changes",
    label: "Config Changes",
    icon: GitCompareArrows
  },
  { key: "playbooks", label: "Playbooks", icon: BookOpen },
  { key: "connections", label: "Connections", icon: Cable }
];

function toNameWildcardQuery(query: string) {
  const normalized = query.trim().split(/\s+/).filter(Boolean).join("*");

  return `*${normalized}*`;
}

function buildSearchRequest(
  query: string,
  enabledSearchTypes: EnabledSearchTypeState
): SearchResourcesRequest | null {
  const trimmedQuery = query.trim();
  const hasEnabledType = Object.values(enabledSearchTypes).some(Boolean);

  if (trimmedQuery.length < 2 || !hasEnabledType) {
    return null;
  }

  const nameQuery = toNameWildcardQuery(trimmedQuery);

  const request: SearchResourcesRequest = {
    limit: SEARCH_RESULT_LIMIT
  };

  if (enabledSearchTypes.configs) {
    request.configs = [{ search: trimmedQuery, agent: "all" }];
  }

  // Use name-based selectors for non-config resources to avoid unsupported
  // query fields (e.g. tags.* on canaries, type on playbooks).
  if (enabledSearchTypes.canaries) {
    request.canaries = [{ name: nameQuery, agent: "all" }];
  }

  if (enabledSearchTypes.checks) {
    request.checks = [{ name: nameQuery, agent: "all" }];
  }

  if (enabledSearchTypes.config_changes) {
    request.config_changes = [{ search: trimmedQuery }];
  }

  if (enabledSearchTypes.playbooks) {
    request.playbooks = [{ name: nameQuery }];
  }

  if (enabledSearchTypes.connections) {
    request.connections = [{ name: nameQuery }];
  }

  return request;
}

function getResourceHref(type: SearchResourceType, item: SearchableResource) {
  switch (type) {
    case "configs":
      return `/catalog/${item.id}`;
    case "canaries":
    case "checks":
      return `/health?checkId=${encodeURIComponent(item.id)}&timeRange=1h`;
    case "config_changes": {
      const configID = item.config_id || item.id;
      return `/catalog/changes?id=${encodeURIComponent(configID)}`;
    }
    case "playbooks":
      return `/playbooks/runs?playbook=${encodeURIComponent(item.id)}`;
    case "connections":
      return `/settings/connections?id=${encodeURIComponent(item.id)}`;
    default:
      return "/";
  }
}

function getResourceTitle(type: SearchResourceType, item: SearchableResource) {
  if (type === "config_changes") {
    return item.summary || item.name || item.id;
  }
  return item.name || item.id;
}

function getResourceDescription(
  type: SearchResourceType,
  item: SearchableResource
): string {
  if (type === "config_changes") {
    return [item.change_type || item.type, item.name]
      .filter(Boolean)
      .join(" • ");
  }

  return [item.namespace, item.type].filter(Boolean).join(" • ");
}

function getShortcutHint() {
  if (typeof navigator === "undefined") {
    return "⌘K";
  }

  return /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? "⌘K" : "Ctrl+K";
}

function hasSearchPayloadError(value: unknown): value is { error: string } {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as { error?: unknown }).error === "string";
}

export function SearchLayoutGlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [enabledSearchTypes, setEnabledSearchTypes] =
    useState<EnabledSearchTypeState>({
      configs: true,
      canaries: true,
      checks: false,
      config_changes: false,
      playbooks: false,
      connections: false
    });

  const shortcutHint = useMemo(() => getShortcutHint(), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (open) {
      return;
    }

    setQuery("");
    setDebouncedQuery("");
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeTypeCount = useMemo(
    () => Object.values(enabledSearchTypes).filter(Boolean).length,
    [enabledSearchTypes]
  );

  const searchRequest = useMemo(
    () => buildSearchRequest(debouncedQuery, enabledSearchTypes),
    [debouncedQuery, enabledSearchTypes]
  );

  const {
    data: results,
    isFetching,
    error: searchError
  } = useQuery({
    queryKey: ["global-search", searchRequest],
    queryFn: async () => {
      const response = await searchResources(searchRequest!);

      if (hasSearchPayloadError(response)) {
        throw response;
      }

      return response;
    },
    enabled: open && searchRequest != null,
    keepPreviousData: true
  });

  const flattenedResults = useMemo<FlattenedSearchResult[]>(() => {
    if (searchError || !searchRequest || !results) {
      return [];
    }

    const entries: FlattenedSearchResult[] = [];

    for (const searchTypeOption of SEARCH_TYPE_OPTIONS) {
      const searchType = searchTypeOption.key;
      if (!enabledSearchTypes[searchType]) {
        continue;
      }

      const resources = (results[searchType] ?? []) as SearchableResource[];
      resources.forEach((item, index) => {
        const title = getResourceTitle(searchType, item);
        const description = getResourceDescription(searchType, item);

        entries.push({
          key: `${searchType}-${item.id}-${index}`,
          value: `${searchType}-${item.id}-${title}-${description}`,
          href: getResourceHref(searchType, item),
          title,
          description,
          resourceType: searchType,
          icon: searchTypeOption.icon
        });
      });
    }

    return entries;
  }, [enabledSearchTypes, results, searchError, searchRequest]);

  const emptyMessage = useMemo(() => {
    if (activeTypeCount === 0) {
      return "Select at least one resource type to search.";
    }

    if (debouncedQuery.trim().length < 2) {
      return "Type at least 2 characters to search.";
    }

    return "No matching resources found.";
  }, [activeTypeCount, debouncedQuery]);

  const openResultInNewTab = (href: string) => {
    const absoluteURL = new URL(href, window.location.origin).toString();
    window.open(absoluteURL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <button
        type="button"
        className="hidden h-8 w-64 items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-500 hover:bg-gray-50 lg:flex"
        title="Global search"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" aria-hidden />
          <span>Search...</span>
        </span>
        <span className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs text-gray-500">
          {shortcutHint}
        </span>
      </button>

      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 lg:hidden"
        title="Global search"
        aria-label="Open global search"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl overflow-hidden p-0 [&>button]:right-7 [&>button]:top-8 [&>button]:inline-flex [&>button]:h-5 [&>button]:w-5 [&>button]:-translate-y-1/2 [&>button]:items-center [&>button]:justify-center [&>button]:p-0">
          <Command
            shouldFilter={false}
            className="[&_[cmdk-input-wrapper]]:mx-4 [&_[cmdk-input-wrapper]]:my-2 [&_[cmdk-input-wrapper]]:rounded-md [&_[cmdk-input-wrapper]]:border [&_[cmdk-input-wrapper]]:border-gray-300 [&_[cmdk-input-wrapper]]:px-3 [&_[cmdk-input-wrapper]]:py-1 [&_[cmdk-input-wrapper]]:focus-within:border-gray-300 [&_[cmdk-input-wrapper]]:focus-within:ring-0"
          >
            <CommandInput
              autoFocus
              placeholder="Search resources..."
              value={query}
              onValueChange={setQuery}
              className="!border-0 bg-transparent shadow-none outline-none ring-0 focus:border-0 focus:ring-0 focus-visible:ring-0"
            />

            <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
              {SEARCH_TYPE_OPTIONS.map((searchTypeOption) => (
                <label
                  key={searchTypeOption.key}
                  className="inline-flex cursor-pointer items-center gap-2 text-xs text-gray-600"
                >
                  <Checkbox
                    checked={enabledSearchTypes[searchTypeOption.key]}
                    onCheckedChange={(checked) => {
                      setEnabledSearchTypes((prev) => ({
                        ...prev,
                        [searchTypeOption.key]: checked === true
                      }));
                    }}
                  />
                  <span>{searchTypeOption.label}</span>
                </label>
              ))}
            </div>

            <CommandList className="max-h-[60vh] p-2">
              {isFetching && (
                <div className="flex items-center gap-2 px-2 py-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching…</span>
                </div>
              )}

              {!isFetching && !!searchError && (
                <div className="px-2 py-2">
                  <ErrorViewer error={searchError} />
                </div>
              )}

              {!searchError &&
                flattenedResults.map((result) => {
                  const ResultIcon = result.icon;
                  const searchTypeLabel =
                    SEARCH_TYPE_OPTIONS.find(
                      (item) => item.key === result.resourceType
                    )?.label ?? result.resourceType;

                  return (
                    <CommandItem
                      key={result.key}
                      value={result.value}
                      className="mb-1 flex items-center gap-3 rounded-md px-3 py-2"
                      onSelect={() => {
                        openResultInNewTab(result.href);
                        setOpen(false);
                      }}
                    >
                      <ResultIcon className="h-4 w-4 flex-shrink-0 text-gray-500" />

                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-gray-900">
                          {result.title}
                        </span>
                        <p className="truncate text-xs text-gray-500">
                          {result.description || "No additional details"}
                        </p>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-2 self-center">
                        <Badge
                          variant="secondary"
                          className="whitespace-nowrap px-1.5 py-0 text-[10px] uppercase"
                        >
                          {searchTypeLabel}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CommandItem>
                  );
                })}

              {!isFetching && !searchError && (
                <CommandEmpty className="py-10 text-center text-sm text-gray-500">
                  {emptyMessage}
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
