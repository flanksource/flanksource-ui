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
import clsx from "clsx";
import { useField } from "formik";
import { debounce } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { IoMdClose } from "react-icons/io";

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
  // the last query the user explicitly committed via the query option
  const [committedQuery, setCommittedQuery] = useState(
    initialSelector.search ?? ""
  );
  const [selected, setSelected] = useState<SearchedResource[]>(() =>
    initialIds.map((id) => ({ id }) as SearchedResource)
  );
  const [isTouched, setIsTouched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
    setIsOpen(true);
  };

  const toggle = (config: SearchedResource) => {
    setSelected((current) =>
      current.some((item) => item.id === config.id)
        ? current.filter((item) => item.id !== config.id)
        : [...current, config]
    );
    // checking an item discards any committed query, so the text does not
    // survive the next close
    setCommittedQuery("");
  };

  // Running against the raw query and running against checked items are
  // mutually exclusive, so choosing the query drops the checked items.
  const chooseQueryOption = () => {
    const trimmed = query.trim();
    setCommittedQuery(trimmed);
    setQuery(trimmed);
    setSelected([]);
    setIsOpen(false);
  };

  // Typed text is only kept if it was committed through the query option,
  // otherwise closing restores whatever the field was last committed to.
  const close = () => {
    handleSearchDebounced.cancel();
    setQuery(committedQuery);
    setSearchText(committedQuery);
    setIsOpen(false);
    setIsTouched(true);
  };

  // The results stay open while focus moves within the field, so clicking a
  // checkbox does not collapse the list.
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) {
      return;
    }
    close();
  };

  const hasQueryOption = query.trim().length > 0;
  const optionCount = results.length + (hasQueryOption ? 1 : 0);
  const queryOptionIndex = hasQueryOption ? results.length : -1;

  // Keep the highlight on a valid row as results come and go.
  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  const activeRowRef = useRef<HTMLElement>(null);
  useEffect(() => {
    activeRowRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (isOpen) {
        // the results own this Escape, the surrounding modal must not close
        e.stopPropagation();
        close();
      }
      return;
    }
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
      }
      return;
    }
    if (optionCount === 0) {
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % optionCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + optionCount) % optionCount);
    } else if (e.key === "Enter") {
      // the field lives inside a form, so Enter must not submit the run
      e.preventDefault();
      if (activeIndex === queryOptionIndex) {
        chooseQueryOption();
      } else if (results[activeIndex]) {
        toggle(results[activeIndex]);
      }
    }
  };

  return (
    <div className={className}>
      {label && <label className="form-label">{label}</label>}
      <div
        className="flex flex-col gap-2"
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
      >
        <input
          type="text"
          name={name}
          value={query}
          placeholder="Search catalog e.g. type=Kubernetes::Deployment grafana"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          // the input can already hold focus while the results are closed, so
          // a click has to reopen them on its own
          onClick={() => setIsOpen(true)}
        />
        {/* The area below the input is sized by whatever it holds, so the run
            modal grows with the results and shrinks back once they close. */}
        <div className="flex flex-col">
          {isOpen ? (
            // Rows are not focusable, so without suppressing the default
            // mousedown the input would blur and tear the list down before the
            // click lands.
            <div
              className="flex flex-col overflow-hidden rounded-md border border-gray-200"
              onMouseDown={(e) => e.preventDefault()}
            >
              {/* ~10 rows tall, then scroll */}
              <div className="flex max-h-[20rem] flex-col overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    {isFetching ? "Searching…" : "No catalog items found"}
                  </div>
                ) : (
                  results.map((config, index) => (
                    <label
                      key={config.id}
                      ref={
                        index === activeIndex
                          ? (activeRowRef as React.RefObject<HTMLLabelElement>)
                          : undefined
                      }
                      className={clsx(
                        "flex cursor-pointer flex-row items-center gap-2 px-2 py-1 text-sm hover:bg-gray-100",
                        index === activeIndex && "bg-blue-50"
                      )}
                    >
                      <ConfigIcon config={config as any} />
                      <span className="flex-1 truncate">
                        {config.name ?? config.id}
                      </span>
                      {config.type && (
                        <Tag title={config.type}>
                          {config.type.split("::").at(-1)?.toLocaleLowerCase()}
                        </Tag>
                      )}
                      <input
                        type="checkbox"
                        className="ml-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selected.some((item) => item.id === config.id)}
                        onChange={() => toggle(config)}
                      />
                    </label>
                  ))
                )}
              </div>
              {hasQueryOption && (
                // pinned below the scroll area so it stays reachable
                <button
                  type="button"
                  ref={
                    activeIndex === queryOptionIndex
                      ? (activeRowRef as React.RefObject<HTMLButtonElement>)
                      : undefined
                  }
                  className={clsx(
                    "flex shrink-0 flex-row items-center gap-1 border-t border-gray-200 px-2 py-2 text-left text-sm hover:bg-gray-100",
                    activeIndex === queryOptionIndex && "bg-blue-50"
                  )}
                  onClick={chooseQueryOption}
                >
                  <span className="text-gray-500">Use query</span>
                  <span className="truncate font-medium">{query.trim()}</span>
                </button>
              )}
            </div>
          ) : (
            selected.length > 0 && (
              <div className="flex flex-row flex-wrap items-start gap-1">
                {selected.map((config) => (
                  <span
                    key={config.id}
                    className="inline-flex max-w-full flex-row items-center gap-1 rounded-md border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs"
                  >
                    <ConfigIcon config={config as any} className="h-4 w-auto" />
                    <span className="truncate">{config.name ?? config.id}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${config.name ?? config.id}`}
                      className="text-gray-400 hover:text-gray-700"
                      onClick={() => toggle(config)}
                    >
                      <IoMdClose />
                    </button>
                  </span>
                ))}
              </div>
            )
          )}
        </div>
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
