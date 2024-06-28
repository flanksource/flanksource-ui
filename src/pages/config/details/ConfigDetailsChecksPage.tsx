import useConfigChecksQuery from "@flanksource-ui/api/query-hooks/useConfigChecksQuery";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import { ChecksDetailsModal } from "@flanksource-ui/components/Canary/CanaryPopup/ChecksDetailsModal";
import { ChecksTable } from "@flanksource-ui/components/Canary/CanaryTable";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function ConfigDetailsChecksPage() {
  const { id } = useParams();
  const [selectedCheck, setSelectedCheck] = useState<HealthCheck>();

  const { data: configChecks, isLoading, refetch } = useConfigChecksQuery(id);

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Config Checks"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Checks"
    >
      <div className={`flex flex-col flex-1 h-full gap-2 overflow-y-auto`}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-col border-t border-gray-200">
            <ChecksTable
              data={configChecks ?? []}
              onHealthCheckClick={(check) => setSelectedCheck(check)}
              hasGrouping={false}
              isLoading={isLoading}
            />
            <ChecksDetailsModal
              isOpen={!!selectedCheck}
              onClose={() => setSelectedCheck(undefined)}
              checkId={selectedCheck?.id}
            />
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
