import BulkCheckRunContext from "@flanksource-ui/components/Canary/BulkCheckRun/BulkCheckRunContext";
import CanaryStatsCards from "@flanksource-ui/components/Canary/CanaryStatsCard";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { useHealthPageContext } from "@flanksource-ui/context/HealthPageContext";
import { useUserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useCallback, useMemo, useState } from "react";
import { VscDebugRerun } from "react-icons/vsc";
import { Canary } from "../components/Canary";
import RefreshDropdown, {
  HEALTH_PAGE_REFRESH_RATE_KEY
} from "../components/RefreshDropdown";
import { HealthRefreshDropdownRateContext } from "../components/RefreshDropdown/RefreshRateContext";
import AddSchemaResourceModal from "../components/SchemaResourcePage/AddSchemaResourceModal";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";
import { BreadcrumbNav, BreadcrumbRoot } from "../ui/BreadcrumbNav";
import { Head } from "../ui/Head";
import { SearchLayout } from "../ui/Layout/SearchLayout";

const bulkRunAllowedRoles = ["admin", "editor", "responder", "commander"];

type Props = {
  url: string;
};

export function HealthPage({ url }: Props) {
  const [loading, setLoading] = useState(true);

  const resourceInfo = schemaResourceTypes.find(
    (item) => item.name === "Health Check"
  );

  /**
   * Refresh page whenever clicked, increment state to trigger useEffect
   */
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [refreshRate, setRefreshRate] = useState(() => {
    const refreshRate = localStorage.getItem(HEALTH_PAGE_REFRESH_RATE_KEY);
    return refreshRate ?? "";
  });

  const {
    healthState: { passing, checks, filteredChecks }
  } = useHealthPageContext();

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

  const enterBulkMode = useCallback(() => {
    setIsBulkRunMode(true);
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
      toggleChecks,
      enterBulkMode,
      exitBulkMode
    }),
    [
      isBulkRunMode,
      selectedCheckIds,
      toggleCheck,
      toggleChecks,
      enterBulkMode,
      exitBulkMode
    ]
  );

  return (
    <>
      <Head prefix="Health" />
      <BulkCheckRunContext.Provider value={bulkRunContextValue}>
        <HealthRefreshDropdownRateContext.Provider
          value={{
            refreshRate,
            setRefreshRate
          }}
        >
          <SearchLayout
            title={
              <BreadcrumbNav
                list={[
                  <BreadcrumbRoot key={"health"} link="/health">
                    Health
                  </BreadcrumbRoot>,
                  <AuthorizationAccessCheck
                    resource={tables.canaries}
                    action="write"
                    key={"add-form"}
                  >
                    <AddSchemaResourceModal
                      onClose={() => setTriggerRefresh(triggerRefresh + 1)}
                      resourceInfo={resourceInfo!}
                    />
                  </AuthorizationAccessCheck>
                ]}
              />
            }
            extraClassName="w-full"
            extra={
              <div className="flex w-full flex-row items-center">
                <div className="flex flex-1 flex-row items-center justify-center gap-3">
                  <CanaryStatsCards
                    checks={checks ?? []}
                    passing={passing}
                    filteredChecks={filteredChecks}
                  />
                  {canRunChecks && !isBulkRunMode && (
                    <Button
                      className="btn-white rounded px-2 py-1 text-xs"
                      size="none"
                      icon={<VscDebugRerun />}
                      text="Bulk Run"
                      onClick={enterBulkMode}
                    />
                  )}
                </div>
                <RefreshDropdown
                  onClick={() => setTriggerRefresh(triggerRefresh + 1)}
                  isLoading={loading}
                />
              </div>
            }
            contentClass="flex flex-col h-full p-0"
          >
            <div className="flex h-full w-full flex-col">
              <div className="mx-auto flex w-full max-w-[100rem] flex-1 flex-row overflow-y-auto">
                <Canary
                  url={url}
                  onLoading={setLoading}
                  triggerRefresh={triggerRefresh}
                />
              </div>
            </div>
          </SearchLayout>
        </HealthRefreshDropdownRateContext.Provider>
      </BulkCheckRunContext.Provider>
    </>
  );
}
