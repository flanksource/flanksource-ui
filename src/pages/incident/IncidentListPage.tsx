import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getIncidentsSummary } from "../../api/services/incident";
import FilterIncidents from "../../components/Incidents/FilterIncidents/FilterIncidents";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { IncidentList } from "../../components/Incidents/IncidentList";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import { Modal } from "../../ui/Modal";
import IncidentListSkeletonLoader from "../../ui/SkeletonLoader/IncidentListSkeletonLoader";

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
  const [searchParams] = useSearchParams({
    status: "open"
  });

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
      const res = await getIncidentsSummary(toPostgresqlSearchParam(params));
      return res;
    },
    {
      refetchOnMount: "always"
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
              <BreadcrumbRoot link="/incidents" key="/incidents">
                Incidents
              </BreadcrumbRoot>,
              <button
                type="button"
                key="incidents-add"
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
        <div className="flex h-full flex-col leading-1.21rel">
          <div className="h-full flex-1 flex-col space-x-2 space-y-2">
            <div className="relative mx-auto flex h-full max-w-screen-xl flex-col justify-center space-y-6">
              {!isLoading || Boolean(incidents?.length) ? (
                <>
                  <FilterIncidents />
                  <IncidentList incidents={incidents || []} />
                  {!Boolean(incidents?.length) && (
                    <div className="absolute mt-2 w-full text-center text-base text-gray-500">
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
        bodyClass="px-0"
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
