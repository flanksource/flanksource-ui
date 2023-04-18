import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai/";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetPeopleQuery } from "../../api/query-hooks";
import {
  getIncidentsWithParams,
  searchIncident
} from "../../api/services/incident";
import FilterIncidents from "../../components/FilterIncidents/FilterIncidents";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { IncidentList } from "../../components/Incidents/IncidentList";
import { SearchLayout } from "../../components/Layout";
import { Modal } from "../../components/Modal";
import IncidentListSkeletonLoader from "../../components/SkeletonLoader/IncidentListSkeletonLoader";
import {
  IncidentState,
  useIncidentPageContext
} from "../../context/IncidentPageContext";
import { Head } from "../../components/Head/Head";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";

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

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const {
    incidentState: { incidents },
    setIncidentState
  } = useIncidentPageContext();

  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);
  const { data: users } = useGetPeopleQuery({});

  useEffect(() => {
    if (!users?.length) {
      return;
    }
    const owners = users.map(({ name, id }) => [
      id,
      { name, value: id, description: name }
    ]);
    // @ts-expect-error
    setIncidentState((state: IncidentState) => {
      return {
        ...state,
        ownerSelections: Object.fromEntries(owners)
      } as any;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  async function fetchIncidents(
    params: Record<string, string | undefined>
  ): Promise<void> {
    try {
      const res = await getIncidentsWithParams(params);
      const data = res.data.map((x: any) => {
        const responders: any[] = [];

        const commentsSet = new Map(
          x?.comments.map((x: any) => [x?.created_by?.id, x?.created_by])
        );
        responders.forEach((x) => commentsSet.delete(x.id));
        return {
          ...x,
          responders,
          involved: responders.concat(Array.from(commentsSet.values()))
        };
      });
      // @ts-expect-error
      setIncidentState((state: any) => {
        return {
          ...state,
          incidents: data
        };
      });
      // setIncidents(data);
      setIsLoading(false);
    } catch (ex) {
      console.error(ex);
      // setIncidents([]);
      // @ts-expect-error
      setIncidentState((state: any) => {
        return {
          ...state,
          incidents: []
        };
      });
      setIsLoading(false);
    }
  }

  const loadIncidents = useRef(
    debounce((params: Record<string, string | undefined>) => {
      // TODO: integrate labels
      setIsLoading(true);
      fetchIncidents(toPostgresqlSearchParam(params));
    }, 100)
  ).current;

  useEffect(() => {
    loadIncidents({});
  }, [loadIncidents]);

  const refreshIncidents = useCallback(() => {
    loadIncidents({
      severity: severity || undefined,
      status: status || undefined,
      owner: owner || undefined,
      type: type || undefined,
      component: component || undefined,
      search: search || undefined
    });
  }, [component, loadIncidents, owner, severity, status, type, search]);

  useEffect(() => {
    loadIncidents({
      severity: severity || undefined,
      status: status || undefined,
      owner: owner || undefined,
      type: type || undefined,
      component: component || undefined,
      search: search || undefined
    });
  }, [severity, status, owner, type, component, loadIncidents, search]);

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
        onRefresh={() => refreshIncidents()}
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
              refreshIncidents();
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
