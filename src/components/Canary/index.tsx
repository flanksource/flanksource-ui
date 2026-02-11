import { HealthChecksResponse } from "@flanksource-ui/api/types/health";
import { isCanaryUI } from "@flanksource-ui/context/Environment";
import { useHealthPageContext } from "@flanksource-ui/context/HealthPageContext";
import { useUserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import HealthPageSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/HealthPageSkeletonLoader";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { VscDebugRerun } from "react-icons/vsc";
import { useSearchParams } from "react-router-dom";
import { Badge } from "..";
import useRefreshRateFromLocalStorage from "../../hooks/useRefreshRateFromLocalStorage";
import BulkCheckRunBar from "./BulkCheckRun/BulkCheckRunBar";
import BulkCheckRunContext from "./BulkCheckRun/BulkCheckRunContext";
import CanaryFiltersBar from "./CanaryFilters/TopBar/CanaryFiltersBar";
import { CanaryInterfaceMinimal } from "./CanaryInterface";
import CanarySidebar from "./Sidebar/CanarySidebar";
import { isHealthy } from "./filter";
import { decodeUrlSearchParams } from "./url";
import { useHealthUserSettings } from "./useHealthUserSettings";

const bulkRunAllowedRoles = ["admin", "editor", "responder", "commander"];

const getPassingCount = (checks: any) => {
  let count = 0;
  checks.forEach((check: any) => {
    if (isHealthy(check)) {
      count += 1;
    }
  });
  return count;
};

type CanaryProps = {
  url?: string;
  onLoading?: (loading: boolean) => void;
  /**
   * When this changes, refresh button has been clicked will be triggered immediately
   */
  triggerRefresh?: number;
};

export function Canary({
  url = "/api/canary/api/summary",
  triggerRefresh,
  onLoading = (_loading) => {}
}: CanaryProps) {
  const [searchParams] = useSearchParams();
  const timeRange = searchParams.get("timeRange");
  const { hidePassing } = useHealthUserSettings();

  const refreshInterval = useRefreshRateFromLocalStorage();
  const [isMenuItemOpen, setIsMenuItemOpen] = useState(false);

  const totalLabelsApplied = useMemo(() => {
    const labels =
      (decodeUrlSearchParams(searchParams.toString()).labels as Record<
        string,
        "1" | "0" | "-1"
      >) || {};
    const initialCount = hidePassing ? 1 : 0;
    const totalLabelsApplied = Object.entries(labels).reduce(
      (acc, [key, value]) => {
        if (value.toString() === "1" || value.toString() === "-1") {
          acc += 1;
        }

        return acc;
      },
      initialCount
    );
    return totalLabelsApplied || 0;
  }, [hidePassing, searchParams]);

  const [isLoading, setIsLoading] = useState(true);
  const [isBulkRunMode, setIsBulkRunMode] = useState(false);
  const [selectedCheckIds, setSelectedCheckIds] = useState<Set<string>>(
    new Set()
  );

  const { roles } = useUserAccessStateContext();
  const canRunChecks = roles.some((role) => bulkRunAllowedRoles.includes(role));

  const toggleCheck = useCallback((id: string) => {
    setSelectedCheckIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleChecks = useCallback((ids: string[], selected: boolean) => {
    setSelectedCheckIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => {
        if (selected) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  }, []);

  const exitBulkMode = useCallback(() => {
    setIsBulkRunMode(false);
    setSelectedCheckIds(new Set());
  }, []);

  const bulkRunContextValue = useMemo(
    () => ({
      isBulkRunMode,
      selectedCheckIds,
      toggleCheck,
      toggleChecks
    }),
    [isBulkRunMode, selectedCheckIds, toggleCheck, toggleChecks]
  );

  const {
    healthState: { checks, filteredChecks },
    setHealthState
  } = useHealthPageContext();

  const timerRef = useRef<NodeJS.Timer>();
  const abortController = useRef<AbortController>();

  const labelUpdateCallback = useCallback(
    (newLabels: any) => {
      setHealthState((state) => {
        return {
          ...state,
          filteredLabels: newLabels
        };
      });
    },
    [setHealthState]
  );

  useEffect(() => {
    setHealthState((state) => {
      return {
        ...state,
        passing: {
          ...state.passing,
          checks: getPassingCount(checks)
        }
      };
    });
  }, [checks, setHealthState]);

  useEffect(() => {
    setHealthState((state) => {
      return {
        ...state,
        passing: {
          ...state.passing,
          filtered: getPassingCount(filteredChecks)
        }
      };
    });
  }, [filteredChecks, setHealthState]);

  const updateFilteredChecks = useCallback(
    (newFilteredChecks: any[]) => {
      setHealthState((state) => {
        return {
          ...state,
          filteredChecks: newFilteredChecks || []
        };
      });
    },
    [setHealthState]
  );

  const handleFetch = useCallback(async () => {
    if (url == null) {
      return;
    }
    setIsLoading(true);
    onLoading(true);
    if (abortController.current) {
      abortController.current.abort();
    }
    const controller = new AbortController();
    abortController.current = controller;
    try {
      const result = await fetch(url, {
        signal: abortController.current?.signal
      });
      const data = (await result.json()) as HealthChecksResponse;
      setHealthState((state) => {
        return {
          ...state,
          checks: data?.checks_summary || []
        };
      });
    } catch (ex) {
      if (ex instanceof DOMException && ex.name === "AbortError") {
        return;
      }
    }
    setIsLoading(false);
    onLoading(false);
  }, [onLoading, setHealthState, url]);

  // Set refresh interval for re-fetching data
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (refreshInterval > 0) {
      timerRef.current = setInterval(() => handleFetch(), refreshInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval]);

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, triggerRefresh, url]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      abortController.current?.abort();
    };
  }, []);

  if (isLoading && !checks?.length) {
    return <HealthPageSkeletonLoader showSidebar />;
  }

  return (
    <BulkCheckRunContext.Provider value={bulkRunContextValue}>
      <div
        className={clsx(
          "flex w-full flex-row place-content-center",
          isCanaryUI
            ? "h-screen min-w-[800px] overflow-auto"
            : "h-full overflow-y-auto"
        )}
      >
        <CanarySidebar
          isMenuItemOpen={isMenuItemOpen}
          setIsMenuItemOpen={setIsMenuItemOpen}
        />

        <div className="flex h-full flex-1 flex-col overflow-y-auto p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <div
              role="button"
              title="Toggle filter menu"
              onClick={() => {
                setIsMenuItemOpen((prev) => !prev);
              }}
              className="relative flex cursor-pointer items-center gap-1 px-4 2xl:hidden"
            >
              <FaFilter />
              <Badge text={totalLabelsApplied} />
            </div>

            <CanaryFiltersBar checks={checks ?? []} />

            {canRunChecks && !isBulkRunMode && (
              <Button
                className="btn-white"
                size="sm"
                icon={<VscDebugRerun />}
                text="Bulk Run"
                onClick={() => setIsBulkRunMode(true)}
              />
            )}
          </div>

          {isBulkRunMode && (
            <div className="mb-2">
              <BulkCheckRunBar
                filteredChecks={filteredChecks}
                onExit={exitBulkMode}
              />
            </div>
          )}

          <div className="flex flex-1 flex-col pb-4">
            <CanaryInterfaceMinimal
              checks={checks ?? undefined}
              onLabelFiltersCallback={labelUpdateCallback}
              onFilterCallback={updateFilteredChecks}
            />
          </div>
        </div>
      </div>
    </BulkCheckRunContext.Provider>
  );
}
