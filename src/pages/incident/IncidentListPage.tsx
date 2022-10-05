import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillPlusCircle } from "react-icons/ai/";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getIncidentsWithParams } from "../../api/services/incident";
import { getPersons } from "../../api/services/users";
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

const removeNullValues = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_k, v]) => v !== null && v !== undefined)
  );

const toPostgresqlSearchParam = ({ severity, status, owner, type }) => {
  const params = Object.entries({
    severity,
    status,
    type,
    created_by: owner
  })
    .filter(([_k, v]) => v && v !== "all")
    .map(([k, v]) => [k, `eq.${v}`]);

  return Object.fromEntries(params);
};

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
        searchParams.get("type") || Object.values(defaultSelections)[0].value
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

  useEffect(() => {
    getPersons().then((res) => {
      const owners = res.data.map(({ name, id }) => [
        id,
        { name, value: id, description: name }
      ]);
      setIncidentState((state: IncidentState) => {
        return {
          ...state,
          ownerSelections: Object.fromEntries(owners)
        };
      });
    });
  }, []);

  async function fetchIncidents(params): void {
    try {
      const res = await getIncidentsWithParams(params);
      const data = res.data.map((x) => {
        const responders = [];

        const commentsSet = new Map(
          x?.comments.map((x) => [x?.created_by?.id, x?.created_by])
        );
        responders.forEach((x) => commentsSet.delete(x.id));
        return {
          ...x,
          responders,
          involved: responders.concat(Array.from(commentsSet.values()))
        };
      });
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
    debounce((params) => {
      // TODO: integrate labels
      setIsLoading(true);

      fetchIncidents(toPostgresqlSearchParam(params));
    }, 100)
  ).current;

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const saveQueryParams = () => {
    const labelsArray = selectedLabels.map((o) => o.value);
    const encodedLabels = encodeURIComponent(JSON.stringify(labelsArray));
    const paramsList = { ...getValues(), labels: encodedLabels };

    setSearchParams(removeNullValues(paramsList));
  };

  useEffect(() => {
    saveQueryParams();
    loadIncidents({
      severity: watchSeverity,
      status: watchStatus,
      owner: watchOwner,
      type: watchType,
      labels: selectedLabels
    });
  }, [watchSeverity, watchStatus, watchOwner, watchType, selectedLabels]);

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
            labels: selectedLabels
          });
        }}
        extra={
          <div className="flex">
            <div className="flex items-center mr-4">
              <div className="mr-3 text-gray-500 text-sm">Severity</div>
              <ReactSelectDropdown
                control={control}
                name="severity"
                className="w-36 mr-2 flex-shrink-0"
                value={watchSeverity}
                items={{ ...defaultSelections, ...severityItems }}
              />
            </div>
            <div className="flex items-center mr-4">
              <div className="mr-3 text-gray-500 text-sm">Status</div>
              <ReactSelectDropdown
                control={control}
                name="status"
                className="w-36 mr-2 flex-shrink-0"
                value={watchStatus}
                items={{ ...defaultSelections, ...statusItems }}
              />
            </div>
            <div className="flex items-center mr-4">
              <div className="mr-3 text-gray-500 text-sm">Owner</div>
              <ReactSelectDropdown
                control={control}
                name="owner"
                className="w-36 mr-2 flex-shrink-0"
                value={watchOwner}
                items={{ ...defaultSelections, ...ownerSelections }}
              />
            </div>
            <div className="flex items-center">
              <div className="mr-3 text-gray-500 text-sm">Type</div>
              <ReactSelectDropdown
                control={control}
                label=""
                name="type"
                className="w-56"
                value={watchType}
                items={{ ...defaultSelections, ...typeItems }}
              />
              {/* <MultiSelectDropdown
                styles={labelDropdownStyles}
                className="w-full"
                options={mockLabels} // TODO: change this to actual labels fetched from API
                onChange={(labels: string[]) => setSelectedLabels(labels)}
                value={selectedLabels}
              /> */}
            </div>
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
        <IncidentCreate
          callback={(response: any) => {
            if (!response) {
              loadIncidents({
                severity: watchSeverity,
                status: watchStatus,
                owner: watchOwner,
                type: watchType,
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
