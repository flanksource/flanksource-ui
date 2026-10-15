import { PermissionSubject } from "@flanksource-ui/api/services/permissions";
import SubjectPermissionsHeader from "@flanksource-ui/components/Permissions/SubjectPermissions/SubjectPermissionsHeader";
import SubjectPermissionsMatrixContent from "@flanksource-ui/components/Permissions/SubjectPermissions/SubjectPermissionsMatrixContent";
import {
  RESOURCE_KIND_ORDER,
  ResourceKind,
  groupResourcesByType
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import useEffectiveSubjectAccess from "@flanksource-ui/components/Permissions/SubjectPermissions/useEffectiveSubjectAccess";
import usePermissionResources from "@flanksource-ui/components/Permissions/SubjectPermissions/usePermissionResources";
import { useEffect, useMemo, useRef, useState } from "react";

// Some actions do not make sense for some subjects.
// This map contains the list of applicable actions when the subject
// is a playbook.
const PLAYBOOK_ALLOWED_ACTIONS: Record<ResourceKind, string[]> = {
  playbook: ["read", "playbook:run"],
  connection: ["read"]
};

function getVisibleActionsForSubject(
  resourceKind: ResourceKind,
  actions: string[],
  isPlaybookSubject: boolean
) {
  if (!isPlaybookSubject) {
    return actions;
  }

  return actions.filter((action) =>
    PLAYBOOK_ALLOWED_ACTIONS[resourceKind].includes(action)
  );
}

export default function SubjectPermissionsWorkbench({
  selectedSubject
}: {
  selectedSubject: PermissionSubject;
}) {
  const [search, setSearch] = useState("");
  const [activeResourceKind, setActiveResourceKind] =
    useState<ResourceKind>("playbook");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { resources: allResources, isLoading } = usePermissionResources();

  const isPlaybookSubject = selectedSubject.type === "playbook";
  const resources = useMemo(
    () =>
      allResources.map((resource) => ({
        ...resource,
        actions: getVisibleActionsForSubject(
          resource.kind,
          resource.actions,
          isPlaybookSubject
        )
      })),
    [allResources, isPlaybookSubject]
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (!normalizedSearch) {
        return true;
      }

      return `${resource.displayName} ${resource.name} ${resource.namespace || ""}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [normalizedSearch, resources]);

  const resourceKindCounts = useMemo(() => {
    return Object.fromEntries(
      RESOURCE_KIND_ORDER.map((kind) => [
        kind,
        filteredResources.filter((resource) => resource.kind === kind).length
      ])
    ) as Record<ResourceKind, number>;
  }, [filteredResources]);

  const activeResources = useMemo(
    () =>
      filteredResources.filter(
        (resource) => resource.kind === activeResourceKind
      ),
    [filteredResources, activeResourceKind]
  );

  const groupedResources = useMemo(
    () => groupResourcesByType(activeResources),
    [activeResources]
  );

  const { effectiveAccessByAction, isCheckingEffectiveAccess } =
    useEffectiveSubjectAccess({
      selectedSubjectId: selectedSubject.id,
      resources: activeResources
    });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedSubject.id, activeResourceKind]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <SubjectPermissionsHeader
        selectedSubject={selectedSubject}
        search={search}
        onSearchChange={setSearch}
      />

      <SubjectPermissionsMatrixContent
        loading={isLoading}
        groupedResources={groupedResources}
        activeResourceKind={activeResourceKind}
        visibleResourceKinds={RESOURCE_KIND_ORDER}
        resourceKindCounts={resourceKindCounts}
        onSelectResourceKind={setActiveResourceKind}
        effectiveAccessByAction={effectiveAccessByAction}
        isCheckingEffectiveAccess={isCheckingEffectiveAccess}
        scrollRef={scrollRef}
      />
    </div>
  );
}
