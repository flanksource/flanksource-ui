import { useState, useMemo } from "react";
import type {
  ScrapeResult,
  ConfigChange,
  UIRelationship,
  ConfigMeta,
  ExternalConfigAccess,
  ExternalConfigAccessLog,
  ExternalUser,
  ExternalGroup,
  ExternalRole
} from "../types";
import { healthIcon, healthColor, type Lookups, resolve } from "../utils";
import { JsonView } from "./JsonView";
import { AliasList } from "./AliasList";

type EntityKind = "users" | "groups" | "roles";

interface Props {
  item: ScrapeResult | null;
  changes?: ConfigChange[];
  relationships?: UIRelationship[];
  configMeta?: Record<string, ConfigMeta>;
  access?: ExternalConfigAccess[];
  accessLogs?: ExternalConfigAccessLog[];
  allUsers?: ExternalUser[];
  allGroups?: ExternalGroup[];
  allRoles?: ExternalRole[];
  lookups: Lookups;
  // Optional navigate callback. When provided, entity badges become clickable
  // links that navigate to /users/{id}, /groups/{id}, /roles/{id} via the
  // SPA router. When omitted, badges fall back to plain spans.
  onNavigate?: (kind: EntityKind, id: string) => void;
}

function LabelBadges({
  labels,
  color
}: {
  labels?: Record<string, string>;
  color: string;
}) {
  if (!labels) return null;
  const entries = Object.entries(labels);
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {entries.map(([k, v]) => (
        <span key={k} className={`rounded px-1.5 py-0.5 text-xs ${color}`}>
          {k}={v}
        </span>
      ))}
    </div>
  );
}

// matchesConfig decides whether a config_access (or access_log) row belongs
// to a given config item. Some scrapers populate the nested
// external_config_id struct (most ADO scrapers), others populate the
// sibling top-level config_id field directly (e.g. AAD enterprise apps).
// Some scrapers normalize IDs into a path form while others use a UUID
// form. We check every plausible identifier shape so the match is
// resilient to any of these patterns.
function matchesConfig(
  a: { external_config_id?: any; config_id?: string },
  item: { id: string; aliases?: string[] }
): boolean {
  const itemKeys = new Set<string>();
  itemKeys.add(item.id);
  for (const alias of item.aliases || []) itemKeys.add(alias);

  const ext = a.external_config_id;
  if (ext) {
    if (typeof ext === "string") {
      if (itemKeys.has(ext)) return true;
    } else if (typeof ext === "object") {
      if (ext.external_id && itemKeys.has(ext.external_id)) return true;
      if (ext.config_id && itemKeys.has(ext.config_id)) return true;
    }
  }
  if (a.config_id && itemKeys.has(a.config_id)) return true;
  return false;
}

function Expandable({
  summary,
  data,
  color
}: {
  summary: any;
  data: any;
  color: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded border ${color}`}>
      <div
        className="flex cursor-pointer items-center gap-1.5 px-2 py-1.5 text-xs"
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-400">{open ? "▼" : "▶"}</span>
        <div className="flex-1">{summary}</div>
      </div>
      {open && (
        <div className="border-t px-2 pb-2">
          <JsonView data={data} />
        </div>
      )}
    </div>
  );
}

// resolveEntityID maps an alias-or-id back to the canonical entity .id by
// scanning the entity list. The badges in the Access section receive an
// alias from the access row (which may differ from the entity's primary id),
// so we resolve it before building the navigation URL — otherwise the
// /users/{id} route wouldn't match anything in the entity tab.
function resolveEntityID<T extends { id: string; aliases?: string[] }>(
  entities: T[] | undefined,
  aliasOrId: string
): string {
  if (!entities || !aliasOrId) return aliasOrId;
  for (const e of entities) {
    if (e.id === aliasOrId) return e.id;
    if (e.aliases?.includes(aliasOrId)) return e.id;
  }
  return aliasOrId;
}

interface EntityBadgeProps {
  kind: EntityKind;
  prefix: string;
  aliasOrId: string;
  display: string;
  colorClass: string;
  entities?: { id: string; aliases?: string[] }[];
  onNavigate?: (kind: EntityKind, id: string) => void;
}

function EntityBadge({
  kind,
  prefix,
  aliasOrId,
  display,
  colorClass,
  entities,
  onNavigate
}: EntityBadgeProps) {
  const canonicalId = resolveEntityID(entities, aliasOrId);
  const href = `/${kind}/${encodeURIComponent(canonicalId)}`;
  if (!onNavigate) {
    return (
      <span className={`rounded px-1.5 py-0.5 ${colorClass}`}>
        {prefix}
        {display}
      </span>
    );
  }
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onNavigate(kind, canonicalId);
      }}
      className={`rounded px-1.5 py-0.5 ${colorClass} cursor-pointer no-underline hover:brightness-95`}
    >
      {prefix}
      {display}
    </a>
  );
}

function Section({
  title,
  count,
  children,
  defaultOpen = true
}: {
  title: string;
  count?: number;
  children: any;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <h3
        className="mb-2 flex cursor-pointer select-none items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs text-gray-400">{open ? "▼" : "▶"}</span>
        {title}
        {count !== undefined && ` (${count})`}
      </h3>
      {open && children}
    </div>
  );
}

export function DetailPanel({
  item,
  changes,
  relationships,
  configMeta,
  access,
  accessLogs,
  allUsers,
  allGroups,
  allRoles,
  lookups,
  onNavigate
}: Props) {
  const itemChanges = useMemo(() => {
    if (!item || !changes) return [];
    return changes.filter((ch) => ch.source?.includes(item.id));
  }, [item, changes]);

  const itemRelationships = useMemo(() => {
    if (!item || !relationships) return [];
    return relationships.filter(
      (r) => r.config_id === item.id || r.related_id === item.id
    );
  }, [item, relationships]);

  const itemAccess = useMemo(() => {
    if (!item || !access) return [];
    return access.filter((a) => matchesConfig(a, item));
  }, [item, access]);

  const itemAccessLogs = useMemo(() => {
    if (!item || !accessLogs) return [];
    return accessLogs.filter((a) => matchesConfig(a, item));
  }, [item, accessLogs]);

  if (!item) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Select a config item to view details
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <iconify-icon
          icon={healthIcon(item.health)}
          className={`text-xl ${healthColor(item.health)}`}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {item.name || item.id}
            </h2>
            <button
              className="text-gray-300 transition-colors hover:text-blue-500"
              title="Copy link to this config"
              onClick={() => {
                const url = new URL(window.location.href);
                url.hash = `tab=configs&id=${encodeURIComponent(item.id)}`;
                navigator.clipboard.writeText(url.toString());
              }}
            >
              <iconify-icon icon="codicon:link" className="text-sm" />
            </button>
            <a
              className="text-gray-300 transition-colors hover:text-blue-500"
              title="Download JSON for this config"
              href={`/api/config/${encodeURIComponent(item.id)}`}
              download
            >
              <iconify-icon icon="codicon:cloud-download" className="text-sm" />
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{item.config_type}</span>
            {item.config_class && <span>({item.config_class})</span>}
            {item.status && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                {item.status}
              </span>
            )}
            {(item.Action === "inserted" ||
              (!item.Action && item.created_at)) && (
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                New
              </span>
            )}
            {item.Action === "updated" && (
              <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700">
                Updated
              </span>
            )}
            {item.deleted_at && (
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">
                Deleted{item.delete_reason ? `: ${item.delete_reason}` : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="break-all font-mono text-xs text-gray-400">
        ID: {item.id}
      </div>

      {/* Metadata: parents, location, timestamps */}
      <div className="space-y-1 text-xs text-gray-500">
        {configMeta?.[item.id]?.parents &&
          configMeta[item.id].parents!.length > 0 && (
            <div className="flex items-center gap-1">
              <iconify-icon
                icon="codicon:type-hierarchy"
                className="text-gray-400"
              />
              <span>{configMeta[item.id].parents!.join(" → ")}</span>
            </div>
          )}
        {(configMeta?.[item.id]?.location ||
          (item.locations && item.locations.length > 0)) && (
          <div className="flex items-center gap-1">
            <iconify-icon icon="codicon:location" className="text-gray-400" />
            <span>
              {configMeta?.[item.id]?.location || item.locations!.join(", ")}
            </span>
          </div>
        )}
        {(item.created_at || item.last_modified) && (
          <div className="flex items-center gap-2">
            {item.created_at && <span>Created: {item.created_at}</span>}
            {item.last_modified &&
              item.last_modified !== "0001-01-01T00:00:00Z" && (
                <span>Modified: {item.last_modified}</span>
              )}
            {item.deleted_at && (
              <span className="text-red-500">Deleted: {item.deleted_at}</span>
            )}
          </div>
        )}
      </div>

      <LabelBadges labels={item.labels} color="bg-blue-50 text-blue-600" />
      <LabelBadges labels={item.tags} color="bg-gray-100 text-gray-600" />

      {item.aliases && item.aliases.length > 0 && (
        <Section title="Aliases" count={item.aliases.length}>
          <AliasList aliases={item.aliases} />
        </Section>
      )}

      {item.analysis && (
        <div className="rounded border border-indigo-200 bg-indigo-50 p-3 text-sm">
          <div className="font-medium text-indigo-800">Analysis</div>
          <JsonView data={item.analysis} />
        </div>
      )}

      {/* Relationships */}
      {itemRelationships.length > 0 && (
        <Section title="Relationships" count={itemRelationships.length}>
          <div className="space-y-1">
            {itemRelationships.map((rel, i) => {
              const isOutgoing = rel.config_id === item.id;
              const targetId = isOutgoing ? rel.related_id : rel.config_id;
              const targetName = isOutgoing
                ? rel.related_name || lookups.configs.get(targetId) || targetId
                : rel.config_name || lookups.configs.get(targetId) || targetId;
              const resolvedLabel = lookups.configs.get(targetId);
              const targetType = resolvedLabel?.match(/\(([^)]+)\)$/)?.[1];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded border border-teal-200 bg-teal-50 px-2 py-1.5 text-xs"
                >
                  <iconify-icon
                    icon={
                      isOutgoing ? "codicon:arrow-right" : "codicon:arrow-left"
                    }
                    className="shrink-0 text-teal-500"
                  />
                  {(targetType || rel.relation) && (
                    <span className="font-medium text-teal-700">
                      {targetType || rel.relation}
                    </span>
                  )}
                  <span className="truncate text-gray-600">{targetName}</span>
                  <span className="ml-auto shrink-0 text-gray-400">
                    {isOutgoing ? "outgoing" : "incoming"}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Changes */}
      {itemChanges.length > 0 && (
        <Section title="Changes" count={itemChanges.length}>
          <div className="space-y-1">
            {itemChanges.map((ch, i) => (
              <Expandable
                key={i}
                color="bg-purple-50 border-purple-200"
                data={ch}
                summary={
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-purple-800">
                      {ch.change_type}
                    </span>
                    {(ch.resolved?.action || ch.action) && (
                      <span className="rounded bg-orange-100 px-1 py-0.5 text-orange-700">
                        {ch.resolved?.action || ch.action}
                      </span>
                    )}
                    {ch.severity && (
                      <span className="text-purple-500">{ch.severity}</span>
                    )}
                    {ch.summary && (
                      <span className="truncate text-gray-600">
                        {ch.summary}
                      </span>
                    )}
                    {ch.created_at && (
                      <span className="ml-auto shrink-0 text-gray-400">
                        {ch.created_at}
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </Section>
      )}

      {/* Config Access */}
      {itemAccess.length > 0 && (
        <Section title="Access" count={itemAccess.length}>
          <div className="space-y-1">
            {itemAccess.map((a, i) => (
              <Expandable
                key={i}
                color="bg-amber-50 border-amber-200"
                data={a}
                summary={
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(a.external_user_aliases?.length
                      ? a.external_user_aliases
                      : a.external_user_id
                        ? [a.external_user_id]
                        : []
                    ).map((u, j) => (
                      <EntityBadge
                        key={`u-${j}`}
                        kind="users"
                        prefix="user: "
                        aliasOrId={u}
                        display={resolve(lookups.users, u)}
                        colorClass="bg-blue-100 text-blue-700"
                        entities={allUsers}
                        onNavigate={onNavigate}
                      />
                    ))}
                    {(a.external_role_aliases?.length
                      ? a.external_role_aliases
                      : a.external_role_id
                        ? [a.external_role_id]
                        : []
                    ).map((r, j) => (
                      <EntityBadge
                        key={`r-${j}`}
                        kind="roles"
                        prefix="role: "
                        aliasOrId={r}
                        display={resolve(lookups.roles, r)}
                        colorClass="bg-purple-100 text-purple-700"
                        entities={allRoles}
                        onNavigate={onNavigate}
                      />
                    ))}
                    {(a.external_group_aliases?.length
                      ? a.external_group_aliases
                      : a.external_group_id
                        ? [a.external_group_id]
                        : []
                    ).map((g, j) => (
                      <EntityBadge
                        key={`g-${j}`}
                        kind="groups"
                        prefix="group: "
                        aliasOrId={g}
                        display={resolve(lookups.groups, g)}
                        colorClass="bg-green-100 text-green-700"
                        entities={allGroups}
                        onNavigate={onNavigate}
                      />
                    ))}
                    {a.created_at && (
                      <span className="ml-auto text-gray-400">
                        {a.created_at}
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </Section>
      )}

      {/* Access Logs */}
      {itemAccessLogs.length > 0 && (
        <Section title="Access Logs" count={itemAccessLogs.length}>
          <div className="space-y-1">
            {itemAccessLogs.map((a, i) => (
              <Expandable
                key={i}
                color="bg-gray-50 border-gray-200"
                data={a}
                summary={
                  <div className="flex items-center gap-2">
                    {a.external_user_aliases?.map((u, j) => (
                      <EntityBadge
                        key={`u-${j}`}
                        kind="users"
                        prefix=""
                        aliasOrId={u}
                        display={resolve(lookups.users, u)}
                        colorClass="bg-blue-100 text-blue-700"
                        entities={allUsers}
                        onNavigate={onNavigate}
                      />
                    ))}
                    {a.mfa !== undefined && (
                      <span
                        className={a.mfa ? "text-green-600" : "text-red-500"}
                      >
                        MFA: {a.mfa ? "Yes" : "No"}
                      </span>
                    )}
                    {a.count != null && (
                      <span className="text-gray-500">x{a.count}</span>
                    )}
                    {a.created_at && (
                      <span className="ml-auto text-gray-400">
                        {a.created_at}
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </Section>
      )}

      {/* Config JSON */}
      {item.config && (
        <Section title="Configuration">
          <div className="max-h-96 overflow-x-auto overflow-y-auto rounded border bg-gray-50 p-3">
            {typeof item.config === "string" ? (
              <pre className="whitespace-pre-wrap font-mono text-xs">
                {item.config}
              </pre>
            ) : (
              <JsonView data={item.config} />
            )}
          </div>
        </Section>
      )}
    </div>
  );
}
