import {
  fetchSettingsManagedSubjectPermissions,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import SubjectPermissionsHeader from "@flanksource-ui/components/Permissions/SubjectPermissions/SubjectPermissionsHeader";
import SubjectPermissionsMatrixContent from "@flanksource-ui/components/Permissions/SubjectPermissions/SubjectPermissionsMatrixContent";
import {
  PermissionResource,
  RESOURCE_KIND_ORDER,
  ResourceKind,
  getDirectAccessState,
  getResourceActionKey,
  groupResourcesByType,
  isSamePermissionResource
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import useEffectiveSubjectAccess from "@flanksource-ui/components/Permissions/SubjectPermissions/useEffectiveSubjectAccess";
import usePermissionResources from "@flanksource-ui/components/Permissions/SubjectPermissions/usePermissionResources";
import useSubjectPermissionAccess from "@flanksource-ui/components/Permissions/SubjectPermissions/useSubjectPermissionAccess";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Some permissions (actions) do not make sense for some subjects.
// This map contains the list of applicable permissions when the subject
// is a playbook.
const PLAYBOOK_ALLOWED_ACTIONS: Record<ResourceKind, string[]> = {
  playbook: ["read", "playbook:run"],
  view: ["read"],
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
  const [selectedResource, setSelectedResource] =
    useState<PermissionResource | null>(null);
  const [activeResourceKind, setActiveResourceKind] =
    useState<ResourceKind>("playbook");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { resources: allResources, isLoading: isLoadingResources } =
    usePermissionResources();

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

  const {
    data: permissions = [],
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions
  } = useQuery({
    queryKey: [
      "permissions-subjects",
      "subject-managed-permissions",
      selectedSubject.id
    ],
    queryFn: () => fetchSettingsManagedSubjectPermissions(selectedSubject.id),
    keepPreviousData: true
  });

  const { isSubmitting, setPermissionAccess } = useSubjectPermissionAccess({
    selectedSubject,
    onPermissionsUpdated: refetchPermissions
  });

  const directAccessByResourceAction = useMemo(() => {
    return Object.fromEntries(
      resources.flatMap((resource) =>
        resource.actions.map((action) => [
          getResourceActionKey(resource, action),
          getDirectAccessState(permissions, selectedSubject, resource, action)
        ])
      )
    );
  }, [permissions, resources, selectedSubject]);

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
    [activeResourceKind, filteredResources]
  );

  const groupedResources = useMemo(
    () =>
      groupResourcesByType(activeResources).map((group) => ({
        ...group,
        actions: getVisibleActionsForSubject(
          group.kind,
          group.actions,
          isPlaybookSubject
        )
      })),
    [activeResources, isPlaybookSubject]
  );

  const { effectiveAccessByAction, isCheckingEffectiveAccess } =
    useEffectiveSubjectAccess({
      selectedSubjectId: selectedSubject.id,
      resources: activeResources
    });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedResource(null);
  }, [selectedSubject.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedResource(null);
  }, [activeResourceKind]);

  useEffect(() => {
    if (
      selectedResource &&
      !filteredResources.some((resource) =>
        isSamePermissionResource(selectedResource, resource)
      )
    ) {
      setSelectedResource(null);
    }
  }, [filteredResources, selectedResource]);

  const handleToggleResource = useCallback((resource: PermissionResource) => {
    setSelectedResource((current) =>
      isSamePermissionResource(current, resource) ? null : resource
    );
  }, []);

  const handlePermissionAccessChange = useCallback(
    (
      resource: PermissionResource,
      action: string,
      access: "allow" | "deny" | "default"
    ) => {
      void setPermissionAccess(resource, action, access);
    },
    [setPermissionAccess]
  );

  const loading = isLoadingResources || isLoadingPermissions;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <SubjectPermissionsHeader
        selectedSubject={selectedSubject}
        search={search}
        onSearchChange={setSearch}
      />

      <SubjectPermissionsMatrixContent
        loading={loading}
        groupedResources={groupedResources}
        activeResourceKind={activeResourceKind}
        resourceKindCounts={resourceKindCounts}
        onSelectResourceKind={setActiveResourceKind}
        selectedResource={selectedResource}
        directAccessByResourceAction={directAccessByResourceAction}
        effectiveAccessByAction={effectiveAccessByAction}
        isCheckingEffectiveAccess={isCheckingEffectiveAccess}
        isSubmitting={isSubmitting}
        scrollRef={scrollRef}
        onToggleResource={handleToggleResource}
        onPermissionAccessChange={handlePermissionAccessChange}
      />
    </div>
  );
}
