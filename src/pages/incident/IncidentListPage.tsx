import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai/";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getIncidentsWithParams } from "../../api/services/incident";
import FilterIncidents from "../../components/FilterIncidents/FilterIncidents";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { IncidentList } from "../../components/Incidents/IncidentList";
import { SearchLayout } from "../../components/Layout";
import { Modal } from "../../components/Modal";
import IncidentListSkeletonLoader from "../../components/SkeletonLoader/IncidentListSkeletonLoader";
import { Head } from "../../components/Head/Head";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import { useQuery } from "@tanstack/react-query";

type IncidentFilters = {
  severity?: string;
  status?: string;
  owner?: string;
  type?: string;
  component?: string;
  search?: string;
};

function toPostgresqlSearchParam({
  severity,
  status,
  owner,
  type,
  component,
  search
}: IncidentFilters): Record<string, string | undefined> {
  const params = Object.entries({
    severity,
    status,
    type,
    created_by: owner,
    "hypotheses.evidences.component_id": component,
    search
  })
    .filter(([_k, v]) => v && v !== "all")
    .map(([k, v]) => (k === "search" ? [k, v] : [k, `eq.${v}`]));
  return Object.fromEntries(params);
}

export function IncidentListPage() {
  const [searchParams] = useSearchParams();

  const severity = searchParams.get("severity");
  const status = searchParams.get("status");
  const owner = searchParams.get("owner");
  const type = searchParams.get("type");
  const component = searchParams.get("component");
  const search = searchParams.get("search");

  const {
    isLoading,
    data: incidents = [],
    refetch
  } = useQuery(
    ["incidents", { severity, status, owner, type, component, search }],
    async () => {
      const params = {
        severity: severity || undefined,
        status: status || undefined,
        owner: owner || undefined,
        type: type || undefined,
        component: component || undefined,
        search: search || undefined
      };
      const res = await getIncidentsWithParams(toPostgresqlSearchParam(params));
      return res.data ?? [];
    }
  );

  const navigate = useNavigate();

  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);

  return (
    <>
      <Head prefix="Incidents" />
      <SearchLayout
        loading={isLoading}
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/incidents">Incidents</BreadcrumbRoot>,
              <button
                type="button"
                className=""
                onClick={() => setIncidentModalIsOpen(true)}
              >
                <AiFillPlusCircle className="text-blue-600" size={32} />
              </button>
            ]}
          />
        }
        onRefresh={() => refetch()}
        contentClass="flex flex-col h-full"
      >
        <div className="flex flex-col h-full leading-1.21rel">
          <div className="flex-col flex-1 h-full space-x-2 space-y-2">
            <div className="relative max-w-screen-xl mx-auto h-full space-y-6 flex flex-col justify-center">
              {!isLoading || Boolean(incidents?.length) ? (
                <>
                  <FilterIncidents />
                  <IncidentList list={incidents || []} />
                  {!Boolean(incidents?.length) && (
                    <div className="absolute text-center text-base text-gray-500 w-full mt-2">
                      There are no incidents matching this criteria
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1">
                  <IncidentListSkeletonLoader />
                </div>
              )}
            </div>
          </div>
        </div>
      </SearchLayout>

      <Modal
        open={incidentModalIsOpen}
        onClose={() => setIncidentModalIsOpen(false)}
        size="small"
        title="Create New Incident"
        containerClassName=""
      >
        <IncidentCreate
          callback={(response) => {
            if (!response) {
              refetch();
              setIncidentModalIsOpen(false);
              return;
            }
            navigate(`/incidents/${response.id}`, { replace: true });
          }}
        />
      </Modal>
    </>
  );
}
