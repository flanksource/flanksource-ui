import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai/";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { getIncidentsWithParams } from "../../api/services/incident";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { IncidentList } from "../../components/Incidents/IncidentList";
import { Modal } from "../../components/Modal";
import { SearchLayout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { Dropdown } from "../../components/Dropdown";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown";
import { severityItems, statusItems } from "../../components/Incidents/data";
import { getPersons } from "../../api/services/users";

const defaultSelections = {
  all: {
    description: "All",
    value: "all",
    order: 0
  }
};

// to be removed after integrating with API
const mockLabels = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "banana", label: "Banana" },
  { value: "grape", label: "Grape" },
  { value: "pear", label: "Pear" }
];

const labelDropdownStyles = {
  valueContainer: (provided) => ({
    ...provided
  }),
  option: (provided) => ({
    ...provided,
    fontSize: "14px"
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: "12px"
  }),
  container: (provided) => ({
    ...provided,
    minWidth: "300px"
  })
};

const removeNullValues = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_k, v]) => v !== null && v !== undefined)
  );

const toPostgresqlSearchParam = ({ severity, status, owner }) => {
  const params = Object.entries({
    severity,
    status,
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
        searchParams.get("owner") || Object.values(defaultSelections)[0].value
    }
  });
  const [selectedLabels, setSelectedLabels] = useState([]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);
  const [ownerSelections, setOwnerSelections] = useState([]);

  const watchSeverity = watch("severity");
  const watchStatus = watch("status");
  const watchOwner = watch("owner");

  useEffect(() => {
    getPersons().then((res) => {
      const owners = res.data.map(({ name, id }) => [
        id,
        { name, value: id, description: name }
      ]);
      setOwnerSelections(Object.fromEntries(owners));
    });
  }, []);

  async function fetchIncidents(params): void {
    try {
      const res = await getIncidentsWithParams(params);
      const data = res.data.map((x) => {
        const responders =
          x.commander_id.id === x.communicator_id.id
            ? [x.commander_id]
            : [x.communicator_id, x.commander_id];

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

      setIncidents(data);
      setIsLoading(false);
    } catch (ex) {
      setIncidents([]);
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
      labels: selectedLabels
    });
  }, [watchSeverity, watchStatus, watchOwner, selectedLabels]);

  return (
    <>
      <SearchLayout
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
        onRefresh={loadIncidents}
        extra={
          <div className="flex">
            <div className="flex items-center mr-4">
              <div className="mr-3 text-gray-500 text-sm">Severity</div>
              <Dropdown
                control={control}
                name="severity"
                className="w-36 mr-2 flex-shrink-0"
                items={{ ...defaultSelections, ...severityItems }}
              />
            </div>
            <div className="flex items-center mr-4">
              <div className="mr-3 text-gray-500 text-sm">Status</div>
              <Dropdown
                control={control}
                name="status"
                className="w-36 mr-2 flex-shrink-0"
                items={{ ...defaultSelections, ...statusItems }}
              />
            </div>
            <div className="flex items-center mr-4">
              <div className="mr-3 text-gray-500 text-sm">Owner</div>
              <Dropdown
                control={control}
                name="owner"
                className="w-36 mr-2 flex-shrink-0"
                items={{ ...defaultSelections, ...ownerSelections }}
              />
            </div>
            <div className="flex items-center">
              <div className="mr-3 text-gray-500 text-sm">Labels</div>
              <MultiSelectDropdown
                styles={labelDropdownStyles}
                className="w-full"
                options={mockLabels} // TODO: change this to actual labels fetched from API
                onChange={(labels: string[]) => setSelectedLabels(labels)}
                value={selectedLabels}
              />
            </div>
          </div>
        }
      >
        <div className="leading-1.21rel">
          <div className="flex-none flex-wrap space-x-2 space-y-2">
            <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
              {!isLoading ? (
                <IncidentList list={incidents || []} />
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
          callback={(response) => {
            navigate(`/incidents/${response.id}`, { replace: true });
          }}
        />
      </Modal>
    </>
  );
}
