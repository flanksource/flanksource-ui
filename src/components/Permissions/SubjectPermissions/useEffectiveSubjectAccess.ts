/**
 * Hook that batches effective-access checks for the selected subject across all
 * visible resources and actions, returning a lookup keyed by resource/action.
 */
import {
  fetchEffectiveSubjectResourceAccess,
  SubjectAccessReviewTarget
} from "@flanksource-ui/api/services/rbac";
import {
  EffectiveAccessMap,
  PermissionResource,
  ResourceKind,
  TARGET_ACTIONS
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";

type UseEffectiveSubjectAccessProps = {
  selectedSubjectId: string;
  resources: PermissionResource[];
  // The resource the actions that take a target are checked on, if any.
  target?: SubjectAccessReviewTarget;
};

export default function useEffectiveSubjectAccess({
  selectedSubjectId,
  resources,
  target
}: UseEffectiveSubjectAccessProps) {
  const scopeKey = useMemo(
    () =>
      resources
        .map(
          (resource) =>
            `${resource.kind}:${resource.id}:${resource.actions.join(",")}`
        )
        .join("|"),
    [resources]
  );

  const { data: effectiveAccessByAction = {}, isFetching } =
    useQuery<EffectiveAccessMap>({
      queryKey: [
        "permissions-subjects",
        "effective-access",
        selectedSubjectId,
        scopeKey,
        target ?? null
      ],
      enabled: resources.length > 0,
      queryFn: async () => {
        const byAction = new Map<
          string,
          Array<{ id: string; type: ResourceKind; displayAction: string }>
        >();

        for (const resource of resources) {
          for (const action of resource.actions) {
            const list = byAction.get(action) ?? [];
            list.push({
              id: resource.id,
              type: resource.kind,
              displayAction: action
            });
            byAction.set(action, list);
          }
        }

        const next: EffectiveAccessMap = {};
        let hasEffectiveAccessFetchFailure = false;

        await Promise.all(
          Array.from(byAction.entries()).map(
            async ([permissionAction, actionResources]) => {
              try {
                const response = await fetchEffectiveSubjectResourceAccess({
                  subject: selectedSubjectId,
                  action: permissionAction as any,
                  resources: actionResources.map(({ id, type }) => ({
                    id,
                    type
                  })),
                  target: TARGET_ACTIONS.includes(permissionAction)
                    ? target
                    : undefined
                });

                for (const result of response.results ?? []) {
                  next[
                    `${result.resourceType}:${result.resourceId}:${
                      actionResources.find(
                        (resource) => resource.id === result.resourceId
                      )?.displayAction ?? permissionAction
                    }`
                  ] = result.allowed ? "allowed" : "denied";
                }
              } catch {
                hasEffectiveAccessFetchFailure = true;
                for (const resource of actionResources) {
                  next[
                    `${resource.type}:${resource.id}:${resource.displayAction}`
                  ] = "unknown";
                }
              }
            }
          )
        );

        if (hasEffectiveAccessFetchFailure) {
          toast.error(
            "Failed to check effective access. Showing unknown state.",
            { id: "subject-permissions-effective-access-failed" }
          );
        }

        return next;
      },
      keepPreviousData: true
    });

  return {
    effectiveAccessByAction,
    isCheckingEffectiveAccess: isFetching
  };
}
