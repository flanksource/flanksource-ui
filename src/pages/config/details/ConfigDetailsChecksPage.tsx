import useConfigChecksQuery from "@flanksource-ui/api/query-hooks/useConfigChecksQuery";
import { ChecksTable } from "@flanksource-ui/components/Canary/CanaryTable";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { useParams } from "react-router-dom";

export function ConfigDetailsChecksPage() {
  const { id } = useParams();

  const { data: configChecks, isLoading, refetch } = useConfigChecksQuery(id);

  console.log(configChecks);

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Config Checks"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Checks"
    >
      <div className={`flex flex-col flex-1 h-full gap-2 overflow-y-auto`}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <ChecksTable
            data={configChecks ?? []}
            onHealthCheckClick={(e) => console.log(e)}
            hasGrouping={false}
          />
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
