import { PermissionSubject } from "@flanksource-ui/api/services/permissions";
import {
  reviewSubjectAccess,
  SubjectAccessReviewAction
} from "@flanksource-ui/api/services/rbac";
import AccessExplanationSheet, {
  AccessCheck
} from "@flanksource-ui/components/Permissions/SubjectPermissions/AccessExplanationSheet";
import AccessTargetPicker from "@flanksource-ui/components/Permissions/SubjectPermissions/AccessTargetPicker";
import SubjectPermissionsHeader from "@flanksource-ui/components/Permissions/SubjectPermissions/SubjectPermissionsHeader";
import SubjectPermissionsMatrixContent from "@flanksource-ui/components/Permissions/SubjectPermissions/SubjectPermissionsMatrixContent";
import {
  AccessTab,
  AccessTarget,
  GLOBAL_ACTIONS,
  PermissionResource,
  RESOURCE_KIND_ORDER,
  TARGET_ACTIONS,
  actionsForSubject,
  groupResourcesByType,
  tabsForSubject,
  targetResource
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import useEffectiveSubjectAccess from "@flanksource-ui/components/Permissions/SubjectPermissions/useEffectiveSubjectAccess";
import useGlobalSubjectAccess from "@flanksource-ui/components/Permissions/SubjectPermissions/useGlobalSubjectAccess";
import usePermissionResources from "@flanksource-ui/components/Permissions/SubjectPermissions/usePermissionResources";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SubjectPermissionsWorkbench({
  selectedSubject
}: {
  selectedSubject: PermissionSubject;
}) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AccessTab>("playbook");
  const [target, setTarget] = useState<AccessTarget>();
  const [explaining, setExplaining] = useState<AccessCheck>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleTabs = useMemo(
    () => tabsForSubject(selectedSubject.type),
    [selectedSubject.type]
  );
  const visibleTab = visibleTabs.includes(activeTab)
    ? activeTab
    : visibleTabs[0];

  const { resources: allResources, isLoading } = usePermissionResources();

  const resources = useMemo(
    () =>
      allResources
        .map((resource) => ({
          ...resource,
          actions: actionsForSubject(
            selectedSubject.type,
            resource.kind,
            resource.actions
          )
        }))
        .filter((resource) => resource.actions.length > 0),
    [allResources, selectedSubject.type]
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

  const tabCounts = useMemo(() => {
    const counts: Partial<Record<AccessTab, number>> = {
      global: GLOBAL_ACTIONS.length
    };
    for (const kind of RESOURCE_KIND_ORDER) {
      counts[kind] = filteredResources.filter(
        (resource) => resource.kind === kind
      ).length;
    }
    return counts;
  }, [filteredResources]);

  const activeResources = useMemo(
    () => filteredResources.filter((resource) => resource.kind === visibleTab),
    [filteredResources, visibleTab]
  );

  const groupedResources = useMemo(
    () => groupResourcesByType(activeResources),
    [activeResources]
  );

  const { effectiveAccessByAction, isCheckingEffectiveAccess } =
    useEffectiveSubjectAccess({
      selectedSubjectId: selectedSubject.id,
      resources: activeResources,
      target: targetResource(target)
    });

  // Running, approving and cancelling on a target also need read on it, which search counts: say why they're refused
  const { data: canReadTarget } = useQuery({
    queryKey: [
      "permissions-subjects",
      "target-read",
      selectedSubject.id,
      target
    ],
    enabled: !!target,
    queryFn: async () => {
      const response = await reviewSubjectAccess({
        resource: targetResource(target)!,
        action: "read",
        subjects: [selectedSubject.id]
      });
      return response.results?.[0]?.allowed === true;
    }
  });

  const { globalAccess, isCheckingGlobalAccess, isLoadingGlobalAccess } =
    useGlobalSubjectAccess(selectedSubject.id, visibleTab === "global");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedSubject.id, visibleTab]);

  useEffect(() => {
    setExplaining(undefined);
  }, [selectedSubject.id]);

  const takesTarget = (action: string) => TARGET_ACTIONS.includes(action);
  const showsTargetActions =
    visibleTab === "playbook" &&
    groupedResources.some((group) => group.actions.some(takesTarget));

  const explainResource = (resource: PermissionResource, action: string) => {
    setExplaining({
      action: action as SubjectAccessReviewAction,
      resource: { [resource.kind]: resource.id },
      resourceLabel: resource.displayName,
      target: takesTarget(action) ? target : undefined
    });
  };

  const explainGlobal = (action: SubjectAccessReviewAction) => {
    setExplaining({ action, resource: {} });
  };

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
        activeTab={visibleTab}
        visibleTabs={visibleTabs}
        tabCounts={tabCounts}
        onSelectTab={setActiveTab}
        effectiveAccessByAction={effectiveAccessByAction}
        globalAccess={globalAccess}
        isLoadingGlobalAccess={isLoadingGlobalAccess}
        isCheckingEffectiveAccess={
          isCheckingEffectiveAccess || isCheckingGlobalAccess
        }
        scrollRef={scrollRef}
        toolbar={
          showsTargetActions ? (
            <AccessTargetPicker value={target} onChange={setTarget} />
          ) : null
        }
        footnote={
          showsTargetActions
            ? target
              ? `run, approve and cancel are checked on ${target.name}.${canReadTarget === false ? ` They can't read ${target.name}, which running, approving and cancelling on it also need.` : ""} Click a cell to see why.`
              : "run, approve and cancel are checked without a target, so rules that only allow them on some configs, components or checks don't count. Pick a target to check them on one. Click a cell to see why."
            : "Click a cell to see why."
        }
        onExplainResource={explainResource}
        onExplainGlobal={explainGlobal}
      />

      <AccessExplanationSheet
        subject={selectedSubject}
        check={explaining}
        onClose={() => setExplaining(undefined)}
      />
    </div>
  );
}
