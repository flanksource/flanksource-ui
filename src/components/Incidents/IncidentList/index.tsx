import { IncidentSummary } from "@flanksource-ui/api/types/incident";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { incidentListColumns } from "./IncidentListColumns";

type Props = {
  incidents: IncidentSummary[];
};

export function IncidentList({ incidents }: Props) {
  const navigate = useNavigate();

  const navigateToIncidentDetails = useCallback(
    (id: string) => {
      navigate(`/incidents/${id}`);
    },
    [navigate]
  );

  const columns = useMemo(() => incidentListColumns, []);

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto">
      <DataTable
        columns={columns}
        data={incidents}
        stickyHead
        handleRowClick={(row) => navigateToIncidentDetails(row.original.id)}
        tableStyle={{ borderSpacing: "0" }}
        className="max-w-full overflow-x-auto"
      />
    </div>
  );
}
