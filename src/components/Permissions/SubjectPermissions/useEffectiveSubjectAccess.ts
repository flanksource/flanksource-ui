import { fetchEffectiveSubjectResourceAccess } from "@flanksource-ui/api/services/rbac";
import {
  EffectiveAccessMap,
  PermissionResource,
  ResourceKind
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";

type UseEffectiveSubjectAccessProps = {
  selectedSubjectId: string;
  resources: PermissionResource[];
};

export default function useEffectiveSubjectAccess({
  selectedSubjectId,
  resources
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
        scopeKey
      ],
      enabled: resources.length > 0,
      queryFn: async () => {
        const byAction = new Map<
          string,
          Array<{ id: string; type: ResourceKind }>
        >();

        for (const resource of resources) {
          for (const action of resource.actions) {
            const list = byAction.get(action) ?? [];
            list.push({
              id: resource.id,
              type: resource.kind
            });
            byAction.set(action, list);
          }
        }

        const next: EffectiveAccessMap = {};
        let hasEffectiveAccessFetchFailure = false;

        await Promise.all(
          Array.from(byAction.entries()).map(
            async ([action, actionResources]) => {
              try {
                const response = await fetchEffectiveSubjectResourceAccess({
                  subject: selectedSubjectId,
                  action: action as any,
                  resources: actionResources
                });

                for (const result of response.results ?? []) {
                  next[
                    `${result.resourceType}:${result.resourceId}:${action}`
                  ] = result.allowed ? "allowed" : "denied";
                }
              } catch {
                hasEffectiveAccessFetchFailure = true;
                for (const resource of actionResources) {
                  next[`${resource.type}:${resource.id}:${action}`] = "unknown";
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
