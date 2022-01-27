import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { MinimalLayout } from "../../components/Layout";

export function IncidentCreatePage() {
  return (
    <MinimalLayout title="Create Incident">
      <IncidentCreate />
    </MinimalLayout>
  );
}
