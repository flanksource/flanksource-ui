import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillPlusCircle } from "react-icons/ai/";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getIncidentsWithParams } from "../../api/services/incident";
import { getPersons } from "../../api/services/users";
import FilterIncidentsByComponents from "../../components/FilterIncidents/FilterIncidentsByComponents";
import {
  severityItems,
  statusItems,
  typeItems
} from "../../components/Incidents/data";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { IncidentList } from "../../components/Incidents/IncidentList";
import { SearchLayout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { Modal } from "../../components/Modal";
import { ReactSelectDropdown } from "../../components/ReactSelectDropdown";
import {
  IncidentState,
  useIncidentPageContext
} from "../../context/IncidentPageContext";

const defaultSelections = {
  all: {
    description: "All",
    value: "all",
    order: -1
  }
};

const removeNullValues = (obj: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_k, v]) => v !== null && v !== undefined)
  );

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
  const [searchParams, setSearchParams] = useSearchParams();
  const { control, getValues, watch } = useForm({
    defaultValues: {
      severity:
        searchParams.get("severity") ||
        Object.values(defaultSelections)[0].value,
      status:
        searchParams.get("status") || Object.values(defaultSelections)[0].value,
      owner:
        searchParams.get("owner") || Object.values(defaultSelections)[0].value,
      type:
        searchParams.get("type") || Object.values(defaultSelections)[0].value,
      component:
        searchParams.get("component") ||
        Object.values(defaultSelections)[0].value
    }
  });
  const [selectedLabels, setSelectedLabels] = useState([]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const {
    incidentState: { incidents, ownerSelections },
    setIncidentState
  } = useIncidentPageContext();
  // const [incidents, setIncidents] = useState([]);
  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);
  // const [ownerSelections, setOwnerSelections] = useState([]);

  const watchSeverity = watch("severity");
  const watchStatus = watch("status");
  const watchOwner = watch("owner");
  const watchType = watch("type");
  const watchComponent = watch("component");

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

  const saveQueryParams = useCallback(() => {
    // NOTE: I have no idea what this does, discuss with the team, the array is
    // a state variable, whose setter is never called, so it's always empty
    const labelsArray = selectedLabels.map((o: any) => o.value);
    const encodedLabels = encodeURIComponent(JSON.stringify(labelsArray));
    const paramsList = { ...getValues(), labels: encodedLabels };

    setSearchParams(removeNullValues(paramsList));
  }, [getValues, selectedLabels, setSearchParams]);

  useEffect(() => {
    saveQueryParams();
    loadIncidents({
      severity: watchSeverity,
      status: watchStatus,
      owner: watchOwner,
      type: watchType,
      component: watchComponent,
      // @ts-expect-error
      labels: selectedLabels
    });
  }, [
    watchSeverity,
    watchStatus,
    watchOwner,
    watchType,
    selectedLabels,
    watchComponent,
    saveQueryParams,
    loadIncidents
  ]);

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
        onRefresh={() => {
          loadIncidents({
            severity: watchSeverity,
            status: watchStatus,
            owner: watchOwner,
            type: watchType,
            // @ts-expect-error
            labels: selectedLabels
          });
        }}
        extra={
          <div className="flex flex-row space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-gray-500 text-sm">Severity</div>
              <ReactSelectDropdown
                control={control}
                name="severity"
                className="w-auto max-w-[400px] mr-2 flex-shrink-0"
                dropDownClassNames="w-auto max-w-[400px] right-0"
                value={watchSeverity}
                // @ts-expect-error
                items={{ ...defaultSelections, ...severityItems }}
                hideControlBorder
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-gray-500 text-sm">Status</div>
              <ReactSelectDropdown
                control={control}
                name="status"
                className="w-auto max-w-[400px] mr-2 flex-shrink-0"
                dropDownClassNames="w-auto max-w-[400px] right-0"
                value={watchStatus}
                items={{ ...defaultSelections, ...statusItems }}
                hideControlBorder
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className=" text-gray-500 text-sm">Owner</div>
              <ReactSelectDropdown
                control={control}
                name="owner"
                className="w-auto max-w-[400px] mr-2 flex-shrink-0"
                dropDownClassNames="w-auto max-w-[400px] right-0"
                value={watchOwner}
                // @ts-expect-error
                items={{ ...defaultSelections, ...ownerSelections }}
                hideControlBorder
              />
            </div>
            <div className="space-x-3 flex items-center">
              <div className="text-gray-500 text-sm">Type</div>
              <ReactSelectDropdown
                control={control}
                label=""
                name="type"
                className="w-auto max-w-[400px]"
                dropDownClassNames="w-auto max-w-[400px] right-0"
                value={watchType}
                items={{ ...defaultSelections, ...typeItems }}
                hideControlBorder
              />
              {/* <MultiSelectDropdown
                styles={labelDropdownStyles}
                className="w-full"
                options={mockLabels} // TODO: change this to actual labels fetched from API
                onChange={(labels: string[]) => setSelectedLabels(labels)}
                value={selectedLabels}
              /> */}
            </div>
            <FilterIncidentsByComponents
              control={control}
              value={watchComponent}
            />
          </div>
        }
      >
        <div className="leading-1.21rel">
          <div className="flex-none flex-wrap space-x-2 space-y-2">
            <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
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
              loadIncidents({
                severity: watchSeverity,
                status: watchStatus,
                owner: watchOwner,
                type: watchType,
                // @ts-expect-error
                labels: selectedLabels
              });
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
