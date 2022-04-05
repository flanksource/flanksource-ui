import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { SearchLayout } from "../../components/Layout";

export function IncidentCreatePage() {
  return (
    <SearchLayout title="Create Incident">
      <IncidentCreate />
    </SearchLayout>
  );
}
