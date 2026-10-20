/**
 * Hook that reviews the actions without a resource for the selected subject.
 */
import {
  reviewSubjectAccess,
  SubjectAccessReviewAction
} from "@flanksource-ui/api/services/rbac";
import {
  EffectiveState,
  GLOBAL_ACTIONS
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import { useQuery } from "@tanstack/react-query";

export default function useGlobalSubjectAccess(
  subjectId: string,
  enabled: boolean
) {
  const {
    data = {},
    isFetching,
    isLoading
  } = useQuery({
    queryKey: ["permissions-subjects", "global-access", subjectId],
    enabled,
    queryFn: async () => {
      const entries = await Promise.all(
        GLOBAL_ACTIONS.map(async ({ action }) => {
          try {
            const response = await reviewSubjectAccess({
              resource: {},
              action,
              subjects: [subjectId]
            });
            const result = response.results?.[0];
            const state: EffectiveState =
              !result || result.error
                ? "unknown"
                : result.allowed
                  ? "allowed"
                  : "denied";
            return [action, state] as const;
          } catch {
            return [action, "unknown" as EffectiveState] as const;
          }
        })
      );
      return Object.fromEntries(entries) as Partial<
        Record<SubjectAccessReviewAction, EffectiveState>
      >;
    }
  });

  return {
    globalAccess: data,
    isCheckingGlobalAccess: isFetching,
    isLoadingGlobalAccess: isLoading
  };
}
