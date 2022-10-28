import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai/";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getIncidentsWithParams } from "../../api/services/incident";
import { getPersons } from "../../api/services/users";
import FilterIncidents from "../../components/FilterIncidents/FilterIncidents";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { IncidentList } from "../../components/Incidents/IncidentList";
import { SearchLayout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { Modal } from "../../components/Modal";
import {
  IncidentState,
  useIncidentPageContext
} from "../../context/IncidentPageContext";

type IncidentFilters = {
  severity?: string;
  status?: string;
  owner?: string;
  type?: string;
  component?: string;
};

function toPostgresqlSearchParam({
  severity,
  status,
  owner,
  type,
  component
}: IncidentFilters): Record<string, string | undefined> {
  const params = Object.entries({
    severity,
    status,
    type,
    created_by: owner,
    "hypotheses.evidences.evidence->>id": component
  })
    .filter(([_k, v]) => v && v !== "all")
    .map(([k, v]) => [k, `eq.${v}`]);

  return Object.fromEntries(params);
}

export function IncidentListPage() {
  const [searchParams] = useSearchParams();

  const severity = searchParams.get("severity");
  const status = searchParams.get("status");
  const owner = searchParams.get("owner");
  const type = searchParams.get("type");
  const component = searchParams.get("component");

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const {
    incidentState: { incidents },
    setIncidentState
  } = useIncidentPageContext();

  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);

  useEffect(() => {
    getPersons().then((res) => {
      if (res.data) {
        const owners = res.data.map(({ name, id }) => [
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
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      component: component || undefined
    });
  }, [component, loadIncidents, owner, severity, status, type]);

  useEffect(() => {
    loadIncidents({
      severity: severity || undefined,
      status: status || undefined,
      owner: owner || undefined,
      type: type || undefined,
      component: component || undefined
    });
  }, [severity, status, owner, type, component, loadIncidents]);

  return (
    <>
      <SearchLayout
        loading={isLoading}
        title={
          <div className="flex items-center flex-shrink-0">
            <span className="text-xl font-semibold mr-4 whitespace-nowrap">
              Incidents /{" "}
            </span>
            <div className="flex">
              <button
                type="button"
                className=""
                onClick={() => setIncidentModalIsOpen(true)}
              >
                <AiFillPlusCircle size={36} color="#326CE5" />
              </button>
            </div>
          </div>
        }
        onRefresh={() => refreshIncidents()}
      >
        <div className="leading-1.21rel">
          <div className="flex-none flex-wrap space-x-2 space-y-2">
            <div className="max-w-screen-xl mx-auto space-y-6 flex flex-col justify-center">
              <FilterIncidents />

              {!isLoading || Boolean(incidents?.length) ? (
                <>
                  <IncidentList list={incidents || []} />
                  {!Boolean(incidents?.length) && (
                    <div className="text-center text-base text-gray-500 w-full mt-2">
                      There are no incidents matching this criteria
                    </div>
                  )}
                </>
              ) : (
                <Loading text="fetching incidents" />
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
      >
        {/* @ts-expect-error */}
        <IncidentCreate
          callback={(response: any) => {
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
