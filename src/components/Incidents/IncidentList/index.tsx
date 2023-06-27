import { useNavigate } from "react-router-dom";
import { IncidentSummary } from "../../../api/services/incident";
import { useCallback, useMemo } from "react";
import { incidentListColumns } from "./IncidentListColumns";
import { DataTable } from "../../DataTable";

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
    <div className="flex flex-col overflow-y-auto flex-1  w-full">
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
