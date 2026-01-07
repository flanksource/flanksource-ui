import { useCallback, useEffect, useMemo, useState } from "react";
import YAML from "yaml";
import dynamic from "next/dynamic";
import { ChevronRightIcon } from "@heroicons/react/outline";

import {
  searchResources,
  SearchResourcesRequest,
  SelectedResources,
  SearchedResource
} from "@flanksource-ui/api/services/search";
import { CheckLink } from "@flanksource-ui/components/Canary/HealthChecks/CheckLink";
import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import ConnectionIcon from "@flanksource-ui/components/Connections/ConnectionIcon";
import { ConnectionValueType } from "@flanksource-ui/components/Connections/connectionTypes";
import { Modal } from "@flanksource-ui/ui/Modal";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { TagItem } from "@flanksource-ui/ui/Tags/TagList";
import { Link } from "react-router-dom";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";

const RESOURCE_TYPES = [
  { key: "configs", label: "Configs" },
  { key: "checks", label: "Checks" },
  { key: "connections", label: "Connections" },
  { key: "playbooks", label: "Playbooks" }
] as const;

type ResourceTypeKey = (typeof RESOURCE_TYPES)[number]["key"];
type ResourceTypeLabel = (typeof RESOURCE_TYPES)[number]["label"];

const MAX_RESULTS = 10;
const RESOURCE_SCHEMA_URL =
  "https://raw.githubusercontent.com/flanksource/duty/main/schema/openapi/resource_selectors.schema.json";

type SelectorInput = Record<string, any>;

const CodeEditor = dynamic(
  () => import("@flanksource-ui/ui/Code/CodeEditor").then((m) => m.CodeEditor),
  { ssr: false }
);

const selectorExamples: Record<
  ResourceTypeKey,
  { title: string; code: string }[]
> = {
  configs: [
    {
      title: "Config items of a type in a namespace",
      code: `- types:
  - Kubernetes::Deployment
  tagSelector: namespace=prod`
    },
    {
      title: "Config items with a label",
      code: `- labelSelector: team=platform`
    }
  ],
  checks: [
    {
      title: "Checks by name prefix",
      code: `- name: "http-*"`
    },
    {
      title: "Checks in a namespace",
      code: `- namespace: kube-system`
    }
  ],
  connections: [
    {
      title: "Connections by name prefix",
      code: `- name: "aws-*"`
    },
    {
      title: "Connections of a type",
      code: `- types:
  - postgres`
    }
  ],
  playbooks: [
    {
      title: "Playbooks by name prefix",
      code: `- name: "backup-*"`
    },
    {
      title: "Playbooks in a namespace",
      code: `- namespace: ops`
    }
  ]
};

function ExampleSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-sm text-gray-700 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left text-blue-700 hover:text-blue-800"
        onClick={() => setOpen((value) => !value)}
      >
        <ChevronRightIcon
          className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
        />
        <span className="font-medium">{title}</span>
      </button>
      {open && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
}

const getResourceKey = (label: ResourceTypeLabel): ResourceTypeKey => {
  return (
    RESOURCE_TYPES.find((resource) => resource.label === label)?.key ??
    RESOURCE_TYPES[0].key
  );
};

const normalizeSelectors = (selectors: SelectorInput[]) => {
  return selectors.map((selector) => {
    if (!selector || typeof selector !== "object") {
      return selector;
    }
    const limit =
      typeof selector.limit === "number"
        ? Math.min(selector.limit, MAX_RESULTS)
        : undefined;
    return limit === undefined ? selector : { ...selector, limit };
  });
};

const parseSelectors = (yamlText: string) => {
  const trimmed = yamlText?.trim();
  if (!trimmed) {
    return { error: "Provide at least one resource selector in YAML." };
  }

  try {
    const parsed = YAML.parse(trimmed);
    if (!parsed) {
      return { error: "YAML did not produce any selectors." };
    }
    if (Array.isArray(parsed)) {
      return { selectors: parsed as SelectorInput[] };
    }
    if (typeof parsed === "object") {
      return { selectors: [parsed as SelectorInput] };
    }
    return { error: "Selectors must be a YAML object or list of objects." };
  } catch (error) {
    return { error: "Invalid YAML format. Please fix and try again." };
  }
};

type ResourceSelectorSearchModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ResourceSelectorSearchModal({
  open,
  onClose
}: ResourceSelectorSearchModalProps) {
  const [resourceTypeLabel, setResourceTypeLabel] =
    useState<ResourceTypeLabel>("Configs");
  const [yamlText, setYamlText] = useState<string>("");
  const [error, setError] = useState<unknown>(null);
  const [results, setResults] = useState<SelectedResources | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const resourceKey = useMemo(
    () => getResourceKey(resourceTypeLabel),
    [resourceTypeLabel]
  );

  const resultItems = useMemo(() => {
    const key = resourceKey as keyof SelectedResources;
    return (results?.[key] ?? []) as SearchedResource[];
  }, [resourceKey, results]);

  useEffect(() => {
    if (!open) {
      setError(null);
      setResults(null);
      setIsSearching(false);
      setHasSearched(false);
    }
  }, [open]);

  useEffect(() => {
    setResults(null);
    setHasSearched(false);
    setError(null);
  }, [resourceKey]);

  const handleSearch = useCallback(async () => {
    setError(null);
    const parsed = parseSelectors(yamlText);
    if ("error" in parsed) {
      setError(parsed.error ?? "Invalid YAML format.");
      return;
    }

    const selectors = normalizeSelectors(parsed.selectors ?? []);
    if (!selectors.length) {
      setError("Provide at least one resource selector.");
      return;
    }

    const request: SearchResourcesRequest = {
      limit: MAX_RESULTS
    };
    (request as Record<ResourceTypeKey, SelectorInput[]>)[resourceKey] =
      selectors;

    setIsSearching(true);
    try {
      const response = await searchResources(request as SearchResourcesRequest);
      setResults(response);
      setHasSearched(true);
    } catch (searchError) {
      console.error(searchError);
      setError(searchError);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  }, [resourceKey, yamlText]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isSearching) return;
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleSearch();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSearch, isSearching, open]);

  const renderResourceLink = useCallback(
    (item: SearchedResource) => {
      switch (resourceKey) {
        case "configs":
          return (
            <ConfigLink
              config={{ id: item.id, name: item.name, type: item.type }}
            />
          );
        case "checks":
          return (
            <CheckLink
              check={{ id: item.id, name: item.name, type: item.type }}
              className="flex items-center gap-2 p-0 hover:bg-transparent"
              showHealthIndicator={false}
            />
          );
        case "connections":
          return (
            <Link
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-500"
              to="/settings/connections"
            >
              <ConnectionIcon
                connection={{
                  id: item.id,
                  name: item.name,
                  type: item.type as ConnectionValueType
                }}
                showLabel
              />
            </Link>
          );
        case "playbooks":
          return (
            <Link
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-500"
              to={`/playbooks/runs?playbook=${item.id}`}
            >
              <Icon name={item.icon ?? "playbook"} className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        default:
          return <span>{item.name}</span>;
      }
    },
    [resourceKey]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Resource Selector Search"
      size="large"
      bodyClass="flex w-full flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
    >
      <div className="space-y-2">
        <label className="form-label">Resource type</label>
        <Switch<ResourceTypeLabel>
          options={RESOURCE_TYPES.map((resource) => resource.label)}
          value={resourceTypeLabel}
          onChange={(value) => setResourceTypeLabel(value)}
          className="w-full flex-wrap"
        />
      </div>

      <div className="space-y-2">
        <label className="form-label">Selectors (YAML)</label>
        <CodeEditor
          language="yaml"
          jsonSchemaUrl={RESOURCE_SCHEMA_URL}
          value={yamlText}
          lines={12}
          onChange={(value) => setYamlText(value ?? "")}
        />
        <p className="text-sm text-gray-500">
          Press Ctrl + Enter to search. The search returns up to {MAX_RESULTS}{" "}
          results.
        </p>
        <ExampleSection title="Examples">
          {(selectorExamples[resourceKey] ?? []).map((example, index) => (
            <div
              key={`${example.title}-${index}`}
              className="overflow-hidden rounded-md"
            >
              <div className="py-2">
                <p className="text-sm font-medium text-gray-700">
                  {example.title}
                </p>
              </div>
              <code className="block overflow-x-auto whitespace-pre-wrap rounded border bg-gray-50 p-2 font-mono text-xs text-gray-800">
                {example.code}
              </code>
            </div>
          ))}
        </ExampleSection>
      </div>

      {error != null && <ErrorViewer error={error} />}

      <div className="flex items-center justify-end">
        <Button
          className="btn-primary"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {hasSearched && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Results</span>
            <span>{resultItems.length} found</span>
          </div>
          <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
            {resultItems.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No results found.</div>
            ) : (
              <table className="w-full table-auto text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 font-medium">Name</th>
                    {resourceKey !== "configs" &&
                      resourceKey !== "playbooks" && (
                        <th className="px-4 py-2 font-medium">Type</th>
                      )}
                    <th className="px-4 py-2 font-medium">Namespace</th>
                    {resourceKey === "configs" && (
                      <th className="px-4 py-2 font-medium">Tags</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {resultItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-100 text-gray-700"
                    >
                      <td className="px-4 py-2">{renderResourceLink(item)}</td>
                      {resourceKey !== "configs" &&
                        resourceKey !== "playbooks" && (
                          <td className="px-4 py-2">{item.type || "-"}</td>
                        )}
                      <td className="px-4 py-2">{item.namespace || "-"}</td>
                      {resourceKey === "configs" && (
                        <td className="px-4 py-2">
                          {item.tags && Object.keys(item.tags).length > 0 ? (
                            <div className="flex flex-wrap items-start gap-1">
                              {Object.entries(item.tags).map(([key, value]) => (
                                <TagItem
                                  key={`${item.id}-${key}`}
                                  tag={{ key, value }}
                                  className="bg-gray-100 text-gray-700"
                                />
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
