import {
  fetchSettingsManagedSubjectPermissions,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import SubjectPermissionsHeader from "@flanksource-ui/components/Permissions/SubjectPermissions/SubjectPermissionsHeader";
import SubjectPermissionsMatrixContent from "@flanksource-ui/components/Permissions/SubjectPermissions/SubjectPermissionsMatrixContent";
import {
  PermissionResource,
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

export default function SubjectPermissionsWorkbench({
  selectedSubject
}: {
  selectedSubject: PermissionSubject;
}) {
  const [search, setSearch] = useState("");
  const [selectedResource, setSelectedResource] =
    useState<PermissionResource | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { resources: allResources, isLoading: isLoadingResources } =
    usePermissionResources();

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
      allResources.flatMap((resource) =>
        resource.actions.map((action) => [
          getResourceActionKey(resource, action),
          getDirectAccessState(permissions, selectedSubject, resource, action)
        ])
      )
    );
  }, [allResources, permissions, selectedSubject]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredResources = useMemo(() => {
    return allResources.filter((resource) => {
      if (!normalizedSearch) {
        return true;
      }

      return `${resource.displayName} ${resource.name} ${resource.namespace || ""}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [allResources, normalizedSearch]);

  const groupedResources = useMemo(
    () => groupResourcesByType(filteredResources),
    [filteredResources]
  );

  const { effectiveAccessByAction, isCheckingEffectiveAccess } =
    useEffectiveSubjectAccess({
      selectedSubjectId: selectedSubject.id,
      resources: filteredResources
    });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedResource(null);
  }, [selectedSubject.id]);

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
