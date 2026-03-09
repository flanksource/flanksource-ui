import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useState
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Cable,
  ChevronRight,
  Database,
  GitCompareArrows,
  HeartPulse,
  History,
  ListChecks,
  Loader2,
  Search,
  Workflow,
  X,
  type LucideIcon
} from "lucide-react";

import {
  getConfigChangeConfigMappings,
  searchResources,
  SearchResourcesRequest,
  SearchedResource
} from "@flanksource-ui/api/services/search";
import { getConfigsByIDs } from "@flanksource-ui/api/services/configs";
import {
  isLocalAgent,
  getAgentByIDs
} from "@flanksource-ui/api/services/agents";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import { Badge } from "@flanksource-ui/components/ui/badge";
import { Checkbox } from "@flanksource-ui/components/ui/checkbox";
import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import { Icon, findByName } from "@flanksource-ui/ui/Icons/Icon";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from "@flanksource-ui/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";

const SEARCH_RESULT_LIMIT = 25;

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

type FlattenedSearchResult = {
  key: string;
  value: string;
  href: string;
  title: string;
  description: string;
  resourceType: SearchResourceType;
  fallbackIcon: LucideIcon;
  resource: SearchedResource;
  indentLevel?: number;
};

const SEARCH_TYPE_OPTIONS: SearchTypeOption[] = [
  { key: "configs", label: "Config", icon: Database },
  { key: "canaries", label: "Canary", icon: HeartPulse },
  { key: "checks", label: "Check", icon: ListChecks },
  { key: "config_changes", label: "Change", icon: GitCompareArrows },
  { key: "playbooks", label: "Playbook", icon: BookOpen },
  { key: "connections", label: "Connection", icon: Cable }
];

const SEARCH_DIRECTIVE_RESOURCE_TYPE_MAP: Record<string, SearchResourceType> = {
  config: "configs",
  configs: "configs",
  canary: "canaries",
  canaries: "canaries",
  check: "checks",
  checks: "checks",
  change: "config_changes",
  changes: "config_changes",
  config_change: "config_changes",
  config_changes: "config_changes",
  "config-change": "config_changes",
  "config-changes": "config_changes",
  playbook: "playbooks",
  playbooks: "playbooks",
  connection: "connections",
  connections: "connections"
};

const SUGGESTED_SEARCH_QUERIES = [
  "type=ingress #config",
  "change_type=OOMKilled #change",
  "prometheus #config,change,connections",
  "labels.app=cert-manager #config",
  "health=unhealthy,warning #config",
  "alertmanager @order=-created_at #change ",
  "type=postgres #connection"
] as const;

const SEARCH_HISTORY_STORAGE_KEY = "globalSearchHistory";
const SEARCH_ENABLED_TYPES_STORAGE_KEY = "globalSearchEnabledTypes";
const SEARCH_HISTORY_LIMIT = 5;

type ParsedSearchQuery = {
  queryWithoutDirectives: string;
  directiveSearchTypes: SearchResourceType[];
};

function createDisabledSearchTypesState(): EnabledSearchTypeState {
  return Object.fromEntries(
    SEARCH_TYPE_OPTIONS.map(({ key }) => [key, false])
  ) as EnabledSearchTypeState;
}

function parseSearchQuery(query: string): ParsedSearchQuery {
  const directiveSearchTypes = new Set<SearchResourceType>();

  const queryWithoutDirectives = query
    .replace(
      /(^|\s)#([^\s]+)/g,
      (_, prefix: string, directiveValue: string) => {
        directiveValue.split(",").forEach((rawDirectiveToken) => {
          const normalizedDirectiveToken = rawDirectiveToken
            .trim()
            .toLowerCase();

          if (!normalizedDirectiveToken) {
            return;
          }

          const resourceType =
            SEARCH_DIRECTIVE_RESOURCE_TYPE_MAP[normalizedDirectiveToken];

          if (resourceType) {
            directiveSearchTypes.add(resourceType);
          }
        });

        return prefix;
      }
    )
    .replace(/\s+/g, " ")
    .trim();

  return {
    queryWithoutDirectives,
    directiveSearchTypes: Array.from(directiveSearchTypes)
  };
}

function getEnabledSearchTypesFromDirective(
  directiveSearchTypes: SearchResourceType[]
): EnabledSearchTypeState {
  const nextEnabledSearchTypes = createDisabledSearchTypesState();

  directiveSearchTypes.forEach((resourceType) => {
    nextEnabledSearchTypes[resourceType] = true;
  });

  return nextEnabledSearchTypes;
}

function isEnabledSearchTypeStateEqual(
  left: EnabledSearchTypeState,
  right: EnabledSearchTypeState
) {
  return SEARCH_TYPE_OPTIONS.every(({ key }) => left[key] === right[key]);
}

function getDefaultEnabledSearchTypes(): EnabledSearchTypeState {
  return {
    configs: true,
    canaries: true,
    checks: false,
    config_changes: false,
    playbooks: false,
    connections: false
  };
}

function getStoredSearchHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawHistory = window.localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);

    if (!rawHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(rawHistory);

    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    return parsedHistory
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, SEARCH_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

function persistSearchHistory(query: string) {
  if (typeof window === "undefined") {
    return [];
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return getStoredSearchHistory();
  }

  const normalizedQuery = trimmedQuery.toLowerCase();
  const existingHistory = getStoredSearchHistory();

  const updatedHistory = [
    trimmedQuery,
    ...existingHistory.filter(
      (historyItem) => historyItem.toLowerCase() !== normalizedQuery
    )
  ].slice(0, SEARCH_HISTORY_LIMIT);

  window.localStorage.setItem(
    SEARCH_HISTORY_STORAGE_KEY,
    JSON.stringify(updatedHistory)
  );

  return updatedHistory;
}

function removeSearchHistoryItem(queryToRemove: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const normalizedQuery = queryToRemove.trim().toLowerCase();
  const existingHistory = getStoredSearchHistory();
  const updatedHistory = existingHistory.filter(
    (item) => item.toLowerCase() !== normalizedQuery
  );

  window.localStorage.setItem(
    SEARCH_HISTORY_STORAGE_KEY,
    JSON.stringify(updatedHistory)
  );

  return updatedHistory;
}

function getStoredEnabledSearchTypes(): EnabledSearchTypeState {
  if (typeof window === "undefined") {
    return getDefaultEnabledSearchTypes();
  }

  const defaultEnabledSearchTypes = getDefaultEnabledSearchTypes();

  try {
    const rawPreference = window.localStorage.getItem(
      SEARCH_ENABLED_TYPES_STORAGE_KEY
    );

    if (!rawPreference) {
      return defaultEnabledSearchTypes;
    }

    const parsedPreference = JSON.parse(rawPreference);

    if (!parsedPreference || typeof parsedPreference !== "object") {
      return defaultEnabledSearchTypes;
    }

    for (const { key } of SEARCH_TYPE_OPTIONS) {
      const storedValue = (parsedPreference as Record<string, unknown>)[key];

      if (typeof storedValue === "boolean") {
        defaultEnabledSearchTypes[key] = storedValue;
      }
    }

    return defaultEnabledSearchTypes;
  } catch {
    return defaultEnabledSearchTypes;
  }
}

function persistEnabledSearchTypes(enabledSearchTypes: EnabledSearchTypeState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      SEARCH_ENABLED_TYPES_STORAGE_KEY,
      JSON.stringify(enabledSearchTypes)
    );
  } catch {
    // Ignore storage write failures.
  }
}

function buildSearchRequest(
  queryWithoutDirectives: string,
  enabledSearchTypes: EnabledSearchTypeState
): SearchResourcesRequest | null {
  const trimmedQuery = queryWithoutDirectives.trim();
  const hasEnabledType = Object.values(enabledSearchTypes).some(Boolean);

  if (trimmedQuery.length < 2 || !hasEnabledType) {
    return null;
  }

  const request: SearchResourcesRequest = {
    limit: SEARCH_RESULT_LIMIT
  };

  if (enabledSearchTypes.configs) {
    request.configs = [{ search: trimmedQuery, agent: "all" }];
  }

  if (enabledSearchTypes.canaries) {
    request.canaries = [{ search: trimmedQuery, agent: "all" }];
  }

  if (enabledSearchTypes.checks) {
    request.checks = [{ search: trimmedQuery, agent: "all" }];
  }

  if (enabledSearchTypes.config_changes) {
    request.config_changes = [{ search: trimmedQuery }];
  }

  if (enabledSearchTypes.playbooks) {
    request.playbooks = [{ search: trimmedQuery }];
  }

  if (enabledSearchTypes.connections) {
    request.connections = [{ search: trimmedQuery }];
  }

  return request;
}

function getResourceHref(type: SearchResourceType, item: SearchedResource) {
  switch (type) {
    case "configs":
      return `/catalog/${item.id}`;
    case "canaries":
      return `/settings/canaries/${encodeURIComponent(item.id)}`;
    case "checks":
      return `/health?checkId=${encodeURIComponent(item.id)}&timeRange=1h`;
    case "config_changes":
      return `/catalog/changes?changeId=${encodeURIComponent(item.id)}`;
    case "playbooks":
      return `/playbooks/runs?playbook=${encodeURIComponent(item.id)}`;
    case "connections":
      return `/settings/connections?id=${encodeURIComponent(item.id)}`;
    default:
      return "/";
  }
}

function getResourceTitle(type: SearchResourceType, item: SearchedResource) {
  if (type === "config_changes") {
    return item.summary || item.name || item.id;
  }
  return item.name || item.id;
}

function sortTagEntries(entries: [string, string][]): [string, string][] {
  const priority: Record<string, number> = {
    cluster: 0,
    account: 1,
    region: 2,
    namespace: 3,
    zone: 4
  };

  return entries.sort(([a], [b]) => {
    const pa = priority[a.toLowerCase()] ?? Number.MAX_SAFE_INTEGER;
    const pb = priority[b.toLowerCase()] ?? Number.MAX_SAFE_INTEGER;

    if (pa !== pb) {
      return pa - pb;
    }

    return a.localeCompare(b);
  });
}

function getConfigTagEntries(item: SearchedResource): [string, string][] {
  if (!item.tags || typeof item.tags !== "object") {
    return [];
  }

  return sortTagEntries(
    Object.entries(item.tags).filter(([key]) => key !== "toString")
  );
}

function getResourceDescription(
  type: SearchResourceType,
  item: SearchedResource
): string {
  if (type === "config_changes") {
    return item.change_type || item.type || "";
  }

  if (type === "configs") {
    const parts: string[] = [item.type].filter(Boolean);
    const tagEntries = getConfigTagEntries(item);

    if (tagEntries.length > 0) {
      tagEntries.forEach(([key, value]) => {
        parts.push(`${key}=${value}`);
      });
    } else if (item.namespace) {
      parts.unshift(item.namespace);
    }

    return parts.join(" · ");
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

function getFirstSupportedIconName(...candidates: (string | undefined)[]) {
  return candidates.find((candidate) => candidate && findByName(candidate));
}

function renderResultIcon(result: FlattenedSearchResult) {
  switch (result.resourceType) {
    case "configs":
    case "config_changes":
      return findByName(result.resource.type) ? (
        <ConfigIcon
          config={{ type: result.resource.type }}
          className="h-4 w-4 text-gray-500"
        />
      ) : (
        <Database className="h-4 w-4 text-gray-500" />
      );
    case "connections": {
      const connectionIcon = getFirstSupportedIconName(
        result.resource.icon,
        result.resource.type,
        result.resource.type?.replaceAll("_", "-"),
        result.resource.type?.replaceAll("_", "")
      );

      return connectionIcon ? (
        <Icon name={connectionIcon} className="h-4 w-4 text-gray-500" />
      ) : (
        <Cable className="h-4 w-4 text-gray-500" />
      );
    }
    case "playbooks": {
      const playbookIcon = getFirstSupportedIconName(result.resource.icon);

      return playbookIcon ? (
        <Icon name={playbookIcon} className="h-4 w-4 text-gray-500" />
      ) : (
        <Workflow className="h-4 w-4 text-gray-500" />
      );
    }
    default: {
      const FallbackIcon = result.fallbackIcon;
      return <FallbackIcon className="h-4 w-4 text-gray-500" />;
    }
  }
}

function getSearchTypeBadgeClass(searchType: SearchResourceType) {
  switch (searchType) {
    case "configs":
      return "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100";
    case "canaries":
      return "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100";
    case "checks":
      return "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
    case "config_changes":
      return "border-pink-100 bg-pink-50 text-pink-700 hover:bg-pink-100";
    case "playbooks":
      return "border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100";
    case "connections":
      return "border-cyan-100 bg-cyan-50 text-cyan-700 hover:bg-cyan-100";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100";
  }
}

export function SearchLayoutGlobalSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [enabledSearchTypes, setEnabledSearchTypes] =
    useState<EnabledSearchTypeState>(() => getStoredEnabledSearchTypes());
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedResultValue, setSelectedResultValue] = useState("");

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
    setSelectedResultValue("");
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSearchHistory(getStoredSearchHistory());
  }, [open]);

  useEffect(() => {
    persistEnabledSearchTypes(enabledSearchTypes);
  }, [enabledSearchTypes]);

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

  const parsedQuery = useMemo(() => parseSearchQuery(query), [query]);
  const parsedDebouncedQuery = useMemo(
    () => parseSearchQuery(debouncedQuery),
    [debouncedQuery]
  );

  const applyDirectiveSearchTypes = (inputQuery: string) => {
    const { directiveSearchTypes } = parseSearchQuery(inputQuery);

    if (directiveSearchTypes.length === 0) {
      return;
    }

    const directiveEnabledSearchTypes =
      getEnabledSearchTypesFromDirective(directiveSearchTypes);

    setEnabledSearchTypes((previousSearchTypes) => {
      if (
        isEnabledSearchTypeStateEqual(
          previousSearchTypes,
          directiveEnabledSearchTypes
        )
      ) {
        return previousSearchTypes;
      }

      return directiveEnabledSearchTypes;
    });
  };

  const searchRequest = useMemo(
    () =>
      buildSearchRequest(
        parsedDebouncedQuery.queryWithoutDirectives,
        enabledSearchTypes
      ),
    [enabledSearchTypes, parsedDebouncedQuery.queryWithoutDirectives]
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

  const configChangeIds = useMemo(
    () =>
      (results?.config_changes ?? [])
        .map((configChange) => configChange.id)
        .filter(Boolean),
    [results?.config_changes]
  );

  const { data: configChangeConfigMappings = [] } = useQuery({
    queryKey: ["global-search", "config-change-mappings", configChangeIds],
    queryFn: async () => {
      try {
        return await getConfigChangeConfigMappings(configChangeIds);
      } catch {
        return [];
      }
    },
    enabled: open && configChangeIds.length > 0,
    keepPreviousData: true
  });

  const configIdByChangeId = useMemo(() => {
    const entries = (results?.config_changes ?? []).map((change) => [
      change.id,
      change.config_id
    ]) as [string, string | undefined][];

    configChangeConfigMappings.forEach((mapping) => {
      if (mapping.config_id) {
        entries.push([mapping.id, mapping.config_id]);
      }
    });

    return new Map(
      entries.filter((entry): entry is [string, string] => Boolean(entry[1]))
    );
  }, [configChangeConfigMappings, results?.config_changes]);

  const configIds = useMemo(
    () => Array.from(new Set(Array.from(configIdByChangeId.values()))),
    [configIdByChangeId]
  );

  const { data: configsByChange = [] } = useQuery({
    queryKey: ["global-search", "config-change-configs", configIds],
    queryFn: async () => {
      try {
        return await getConfigsByIDs(configIds);
      } catch {
        return [];
      }
    },
    enabled: open && configIds.length > 0,
    keepPreviousData: true
  });

  const configById = useMemo(
    () => new Map(configsByChange.map((config) => [config.id, config])),
    [configsByChange]
  );

  const nonLocalAgentIds = useMemo(() => {
    if (!results) {
      return [];
    }

    const agentIds = new Set<string>();

    for (const searchTypeOption of SEARCH_TYPE_OPTIONS) {
      const resources = results[searchTypeOption.key] ?? [];

      resources.forEach((item) => {
        if (!isLocalAgent(item.agent)) {
          agentIds.add(item.agent);
        }
      });
    }

    return Array.from(agentIds);
  }, [results]);

  const { data: agentNamesMap = new Map<string, string>() } = useQuery({
    queryKey: ["global-search", "agents", nonLocalAgentIds],
    queryFn: async () => {
      const agents = await getAgentByIDs(nonLocalAgentIds);
      return new Map(agents.map((agent) => [agent.id, agent.name]));
    },
    enabled: open && nonLocalAgentIds.length > 0,
    keepPreviousData: true
  });

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!results || trimmedQuery.length < 2) {
      return;
    }

    setSearchHistory(persistSearchHistory(trimmedQuery));
  }, [debouncedQuery, results]);

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

      const resources = results[searchType] ?? [];

      if (searchType !== "config_changes") {
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
            fallbackIcon: searchTypeOption.icon,
            resource: item
          });
        });

        continue;
      }

      const changesByConfig = new Map<string, SearchedResource[]>();
      const ungroupedChanges: SearchedResource[] = [];

      resources.forEach((change) => {
        const configId = change.config_id || configIdByChangeId.get(change.id);

        if (!configId) {
          ungroupedChanges.push(change);
          return;
        }

        const changesForConfig = changesByConfig.get(configId) ?? [];
        changesForConfig.push({
          ...change,
          config_id: configId
        });
        changesByConfig.set(configId, changesForConfig);
      });

      changesByConfig.forEach((changesForConfig, configId) => {
        const config = configById.get(configId);
        const configResource: SearchedResource = {
          id: configId,
          name: config?.name || configId,
          type: config?.type || "",
          namespace: "",
          agent: "",
          labels: {}
        };

        const configTitle = getResourceTitle("configs", configResource);
        const configDescription = getResourceDescription(
          "configs",
          configResource
        );

        entries.push({
          key: `config-change-group-${configId}`,
          value: `config-change-group-${configId}-${configTitle}`,
          href: getResourceHref("configs", configResource),
          title: configTitle,
          description: configDescription,
          resourceType: "configs",
          fallbackIcon: Database,
          resource: configResource
        });

        changesForConfig.forEach((change, index) => {
          const title = getResourceTitle(searchType, change);
          const description = getResourceDescription(searchType, change);

          entries.push({
            key: `${searchType}-${configId}-${change.id}-${index}`,
            value: `${searchType}-${configId}-${change.id}-${title}-${description}`,
            href: getResourceHref(searchType, change),
            title,
            description,
            resourceType: searchType,
            fallbackIcon: searchTypeOption.icon,
            resource: change,
            indentLevel: 1
          });
        });
      });

      ungroupedChanges.forEach((item, index) => {
        const title = getResourceTitle(searchType, item);
        const description = getResourceDescription(searchType, item);

        entries.push({
          key: `${searchType}-ungrouped-${item.id}-${index}`,
          value: `${searchType}-ungrouped-${item.id}-${title}-${description}`,
          href: getResourceHref(searchType, item),
          title,
          description,
          resourceType: searchType,
          fallbackIcon: searchTypeOption.icon,
          resource: item
        });
      });
    }

    return entries;
  }, [
    configById,
    configIdByChangeId,
    enabledSearchTypes,
    results,
    searchError,
    searchRequest
  ]);

  const showSuggestions =
    parsedDebouncedQuery.queryWithoutDirectives.length < 2;

  const emptyMessage = "No matching resources found.";

  const handleQueryChange = (nextQuery: string) => {
    applyDirectiveSearchTypes(nextQuery);
    setQuery(nextQuery);
  };

  const selectSearchQuery = (selectedQuery: string) => {
    applyDirectiveSearchTypes(selectedQuery);
    setQuery(selectedQuery);
    setDebouncedQuery(selectedQuery);
  };

  const navigateToResult = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const handleCommandKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || showSuggestions || !!searchError) {
      return;
    }

    const selectedResult =
      flattenedResults.find((result) => result.value === selectedResultValue) ??
      flattenedResults[0];

    if (!selectedResult) {
      return;
    }

    event.preventDefault();
    navigateToResult(selectedResult.href);
  };

  const handleResultLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="flex h-full w-8 items-center justify-center text-gray-400 hover:text-gray-500"
        title={`Global search (${shortcutHint})`}
        aria-label="Open global search"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[20%] max-w-3xl translate-y-0 overflow-hidden p-0 data-[state=closed]:slide-out-to-top-[20%] data-[state=open]:slide-in-from-top-[20%]">
          <DialogTitle className="sr-only">Global search</DialogTitle>
          <DialogDescription className="sr-only">
            Search across configs, canaries, checks, changes, playbooks, and
            connections.
          </DialogDescription>
          <Command
            shouldFilter={false}
            onValueChange={setSelectedResultValue}
            onKeyDown={handleCommandKeyDown}
            className="[&_[cmdk-input-wrapper]]:mx-4 [&_[cmdk-input-wrapper]]:my-2 [&_[cmdk-input-wrapper]]:rounded-md [&_[cmdk-input-wrapper]]:border [&_[cmdk-input-wrapper]]:border-gray-300 [&_[cmdk-input-wrapper]]:px-3 [&_[cmdk-input-wrapper]]:py-1 [&_[cmdk-input-wrapper]]:focus-within:border-gray-300 [&_[cmdk-input-wrapper]]:focus-within:ring-0"
          >
            <CommandInput
              autoFocus
              placeholder="Search resources..."
              value={query}
              onValueChange={handleQueryChange}
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

              {!searchError && showSuggestions && (
                <>
                  {parsedQuery.queryWithoutDirectives.length === 0 &&
                    searchHistory.length > 0 && (
                      <>
                        <div className="px-3 pb-1 pt-2 text-xs font-medium text-gray-500">
                          Recent searches
                        </div>
                        {searchHistory.map((historyQuery) => (
                          <CommandItem
                            key={`history-${historyQuery}`}
                            value={`history-${historyQuery}`}
                            className="group mb-1 flex items-center gap-2 rounded-md px-3 py-2"
                            onSelect={() => selectSearchQuery(historyQuery)}
                          >
                            <History className="h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span className="min-w-0 flex-1 truncate text-sm text-gray-500">
                              {historyQuery}
                            </span>
                            <button
                              type="button"
                              className="flex-shrink-0 rounded p-0.5 text-gray-400 opacity-0 hover:bg-gray-200 hover:text-gray-600 group-hover:opacity-100 group-data-[selected=true]:opacity-100"
                              title="Remove from history"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchHistory(
                                  removeSearchHistoryItem(historyQuery)
                                );
                              }}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </CommandItem>
                        ))}
                      </>
                    )}

                  <div className="px-3 pb-1 pt-2 text-xs font-medium text-gray-500">
                    Suggestions
                  </div>
                  {SUGGESTED_SEARCH_QUERIES.map((suggestionQuery) => (
                    <CommandItem
                      key={suggestionQuery}
                      value={`suggestion-${suggestionQuery}`}
                      className="mb-1 flex items-center gap-2 rounded-md px-3 py-2"
                      onSelect={() => selectSearchQuery(suggestionQuery)}
                    >
                      <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span className="truncate text-sm text-gray-500">
                        {suggestionQuery}
                      </span>
                    </CommandItem>
                  ))}
                </>
              )}

              {!searchError &&
                !showSuggestions &&
                flattenedResults.map((result) => {
                  const searchTypeLabel =
                    SEARCH_TYPE_OPTIONS.find(
                      (item) => item.key === result.resourceType
                    )?.label ?? result.resourceType;

                  return (
                    <CommandItem
                      asChild
                      key={result.key}
                      value={result.value}
                      className={`mb-1 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 ${
                        result.indentLevel ? "pl-9" : ""
                      }`}
                    >
                      <Link
                        to={result.href}
                        className="w-full text-inherit no-underline"
                        onClick={handleResultLinkClick}
                      >
                        <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                          {renderResultIcon(result)}
                        </span>

                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-gray-900">
                            {result.title}
                          </span>
                          {result.resourceType === "configs" ? (
                            <div className="flex items-center gap-1 overflow-hidden">
                              {result.resource.type && (
                                <span className="flex-shrink-0 truncate text-xs text-gray-500">
                                  {result.resource.type}
                                </span>
                              )}
                              {getConfigTagEntries(result.resource).map(
                                ([key, value]) => (
                                  <span
                                    key={key}
                                    className="flex-shrink-0 rounded-md bg-gray-100 px-1 py-0.5 text-[10px] text-gray-600"
                                  >
                                    {key}: {value}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="truncate text-xs text-gray-500">
                              {result.description || "No additional details"}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-2 self-center">
                          {!isLocalAgent(result.resource.agent) &&
                            agentNamesMap.get(result.resource.agent) && (
                              <Badge
                                variant="outline"
                                className="whitespace-nowrap border-orange-200 bg-orange-50 px-1.5 py-0 text-[10px] text-orange-700"
                              >
                                {agentNamesMap.get(result.resource.agent)}
                              </Badge>
                            )}
                          <Badge
                            variant="outline"
                            className={`whitespace-nowrap px-1.5 py-0 text-[10px] uppercase ${getSearchTypeBadgeClass(result.resourceType)}`}
                          >
                            {searchTypeLabel}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </Link>
                    </CommandItem>
                  );
                })}

              {!isFetching && !searchError && !showSuggestions && (
                <CommandEmpty className="py-10 text-center text-sm text-gray-500">
                  {emptyMessage}
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
          <div className="flex items-center gap-4 border-t px-4 py-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
                Esc
              </kbd>
              <span>to close</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
                {shortcutHint}
              </kbd>
              <span>to open search</span>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
