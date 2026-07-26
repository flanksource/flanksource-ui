// Playbook parameter picker for selecting catalog items, either by a resource
// selector search query or by checking individual items from the results.
import {
  SearchedResource,
  searchResources
} from "@flanksource-ui/api/services/search";
import { PlaybookResourceSelector } from "@flanksource-ui/api/types/playbooks";
import HelpLink from "@flanksource-ui/ui/Buttons/HelpLink";
import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import { Tag } from "@flanksource-ui/ui/Tags/Tag";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ConfigsSelector = {
  search?: string;
  id?: string;
};

// Playbook parameters are stored as strings, so the selector travels as JSON.
function parseSelector(value?: string): ConfigsSelector {
  if (!value) {
    return {};
  }
  try {
    return JSON.parse(value);
  } catch {
    return { search: value };
  }
}

function selectorIds(selector: ConfigsSelector) {
  return (selector.id ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function serializeSelector(selected: SearchedResource[], search: string) {
  if (selected.length > 0) {
    return JSON.stringify({ id: selected.map((c) => c.id).join(",") });
  }
  const trimmed = search.trim();
  return trimmed ? JSON.stringify({ search: trimmed }) : undefined;
}

type FormikConfigsSelectorProps = {
  name: string;
  label?: string;
  required?: boolean;
  hintLink?: boolean;
  filter?: PlaybookResourceSelector[];
  className?: string;
};

export default function FormikConfigsSelector({
  name,
  label,
  required = false,
  hintLink = true,
  filter,
  className = "flex flex-col space-y-2 py-2"
}: FormikConfigsSelectorProps) {
  const [field, meta, helpers] = useField<string | undefined>({
    name,
    required,
    validate: useCallback(
      (value: string | undefined) => {
        if (required && !value) {
          return "This field is required";
        }
      },
      [required]
    )
  });

  // The initial value is the only source of pre-selection, so it is read once
  // and then owned by the local state below.
  const initialSelector = useRef(parseSelector(field.value)).current;
  const initialIds = useMemo(
    () => selectorIds(initialSelector),
    [initialSelector]
  );

  const [query, setQuery] = useState(initialSelector.search ?? "");
  const [searchText, setSearchText] = useState(initialSelector.search ?? "");
  const [selected, setSelected] = useState<SearchedResource[]>(() =>
    initialIds.map((id) => ({ id }) as SearchedResource)
  );
  const [isTouched, setIsTouched] = useState(false);

  const { setValue } = helpers;
  useEffect(() => {
    setValue(serializeSelector(selected, query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, query]);

  const selectors = useMemo(
    () => (filter?.length ? filter : [{} as PlaybookResourceSelector]),
    [filter]
  );

  const request = useMemo(
    () => ({
      configs: selectors.map((selector) => ({
        ...selector,
        search: [searchText, selector.search].filter(Boolean).join(" ").trim(),
        agent: selector.agent || "all"
      }))
    }),
    [selectors, searchText]
  );

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["searchResources", "configs", request],
    queryFn: () => searchResources(request),
    select: (data) => data?.configs ?? [],
    keepPreviousData: true
  });

  const { data: preselected } = useQuery({
    queryKey: ["searchResources", "configs", "byId", initialIds],
    queryFn: () =>
      searchResources({
        configs: [{ search: `id=${initialIds.join(",")}`, agent: "all" }]
      }),
    select: (data) => data?.configs ?? [],
    enabled: initialIds.length > 0
  });

  // Replace the id-only placeholders with the resolved catalog items so they
  // can be rendered with their name and type.
  useEffect(() => {
    if (!preselected?.length) {
      return;
    }
    setSelected((current) =>
      current.map(
        (config) =>
          preselected.find((resolved) => resolved.id === config.id) ?? config
      )
    );
  }, [preselected]);

  const handleSearchDebounced = useRef(
    debounce((value: string) => setSearchText(value), 300)
  ).current;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    handleSearchDebounced(value);
  };

  const toggle = (config: SearchedResource) => {
    setSelected((current) =>
      current.some((item) => item.id === config.id)
        ? current.filter((item) => item.id !== config.id)
        : [...current, config]
    );
  };

  // Checked items stay at the top of the list so they remain reachable when the
  // query no longer matches them.
  const rows = useMemo(() => {
    const selectedIds = new Set(selected.map((config) => config.id));
    return [...selected, ...results.filter((c) => !selectedIds.has(c.id))];
  }, [selected, results]);

  return (
    <div className={className}>
      {label && <label className="form-label">{label}</label>}
      <input
        type="text"
        name={name}
        value={query}
        placeholder="Search catalog e.g. type=Kubernetes::Deployment grafana"
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        onChange={(e) => handleQueryChange(e.target.value)}
        onBlur={() => setIsTouched(true)}
      />
      <div className="flex max-h-64 flex-col overflow-y-auto rounded-md border border-gray-200">
        {rows.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">
            {isFetching ? "Searching…" : "No catalog items found"}
          </div>
        ) : (
          rows.map((config) => (
            <label
              key={config.id}
              className="flex cursor-pointer flex-row items-center gap-2 px-2 py-1 text-sm hover:bg-gray-100"
            >
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selected.some((item) => item.id === config.id)}
                onChange={() => toggle(config)}
              />
              <ConfigIcon config={config as any} />
              <span className="flex-1 truncate">
                {config.name ?? config.id}
              </span>
              {config.type && (
                <Tag title={config.type}>
                  {config.type.split("::").at(-1)?.toLocaleLowerCase()}
                </Tag>
              )}
            </label>
          ))
        )}
      </div>
      <p className="text-sm text-gray-500">
        {selected.length > 0
          ? `Running against ${selected.length} selected catalog ${
              selected.length === 1 ? "item" : "items"
            }. Uncheck all to run against the search query instead.`
          : "Runs against every catalog item matching the query, e.g: name=grafana type=Kubernetes::Deployment or health=healthy,unhealthy"}
        {hintLink && (
          <HelpLink
            link="reference/resource-selector#search"
            title=""
            className="ml-1"
            iconID="help-resource-selector"
          />
        )}
      </p>
      {isTouched && meta.error ? (
        <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
