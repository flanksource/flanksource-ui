// ABOUTME: React Query hooks for the getting-started checklist's completed touchpoints.
// ABOUTME: useCompletedTouchpoints reads the user's keys; useRecordTouchpoint records one on use.
import { useUser } from "@flanksource-ui/context";
import {
  fetchPersonTouchpoints,
  recordPersonTouchpoint
} from "@flanksource-ui/api/services/touchpoints";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

const touchpointsKey = (personId?: string) => ["person_touchpoints", personId];

/** Guards against concurrent duplicate writes of the same key across components. */
const inFlight = new Set<string>();

/**
 * The set of touchpoint keys the current user has completed.
 */
export function useCompletedTouchpoints() {
  const { user } = useUser();
  const personId = user?.id;
  return useQuery({
    queryKey: touchpointsKey(personId),
    enabled: !!personId,
    queryFn: async () => {
      const { data } = await fetchPersonTouchpoints(personId!);
      return new Set((data ?? []).map((row) => row.key));
    }
  });
}

/**
 * Returns a stable `record(key)` callback that marks a touchpoint complete for
 * the current user. Recording is best-effort and never surfaces an error; it
 * skips keys already known complete or in flight to avoid redundant writes.
 */
export function useRecordTouchpoint() {
  const { user } = useUser();
  const personId = user?.id;
  const queryClient = useQueryClient();

  return useCallback(
    (key: string) => {
      if (!personId) {
        return;
      }
      const known = queryClient.getQueryData<Set<string>>(
        touchpointsKey(personId)
      );
      const guard = `${personId}:${key}`;
      if (known?.has(key) || inFlight.has(guard)) {
        return;
      }
      inFlight.add(guard);
      recordPersonTouchpoint(personId, key)
        .then(() => {
          queryClient.setQueryData<Set<string>>(
            touchpointsKey(personId),
            (prev) => new Set(prev).add(key)
          );
        })
        .catch(() => {})
        .finally(() => inFlight.delete(guard));
    },
    [personId, queryClient]
  );
}

/**
 * Records a touchpoint once when the component mounts (or when `enabled`
 * becomes true). Use for "viewed X" touchpoints tied to a page/panel.
 */
export function useRecordTouchpointOnMount(key: string, enabled = true) {
  const record = useRecordTouchpoint();
  useEffect(() => {
    if (enabled) {
      record(key);
    }
  }, [key, enabled, record]);
}
