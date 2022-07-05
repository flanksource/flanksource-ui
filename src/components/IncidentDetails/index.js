import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { IncidentDetailsRow } from "./IncidentDetailsRow";
import { Select } from "../Select";
import { IncidentPriority } from "../../constants/incident-priority";
import {
  IncidentCommandersOption,
  IncidentCommandersSingleValue,
  IncidentPriorityOption,
  IncidentPrioritySingleValue
} from "./select-components";
import { priorities } from "./data";
import {
  AddResponder,
  ResponderPropsKeyToLabelMap,
  ResponderTypeOptions
} from "./AddResponder";
import {
  deleteResponder,
  getRespondersForTheIncident
} from "../../api/services/responder";
import { MdDelete } from "react-icons/md";
import { toastError } from "../Toast/toast";

export const IncidentDetails = ({
  incident,
  updateStatusHandler,
  updateIncidentHandler,
  textButton
}) => {
  const [responders, setResponders] = useState([]);

  // Temporary mock, in the future you need to replace it with an array of real users received from the api
  const commandersArray = useMemo(
    () => [
      {
        label: incident.commander_id.name,
        value: incident.commander_id.id,
        avatar: incident.commander_id.avatar
      }
    ],
    [incident]
  );

  const {
    control,
    // getValues,
    watch
  } = useForm({
    defaultValues: {
      tracking: "123456",
      created_at: incident.created_at,
      chartRoomTitle: "#Slack",
      chartRoom: "https://google.com.ua",
      statusPageTitle: "StatusPage.io",
      statusPage: "https://www.atlassian.com/software/statuspage",
      priority: incident.severity ?? IncidentPriority.High,
      commanders: incident.commander_id.id
    }
  });
  watch();
  const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
  const formatDate = ({ date, format = DATE_FORMAT, fallback = "-" }) =>
    date ? dayjs(date).format(format) : fallback;
  const dateToDuration = ({ date, withoutSuffix = true, fallback = "-" }) =>
    date ? dayjs(date).fromNow(withoutSuffix) : fallback;

  const watchCreatedAt = watch("created_at");

  const formattedCreatedAt = useMemo(
    () => formatDate({ date: watchCreatedAt }),
    [watchCreatedAt]
  );
  const formattedDuration = useMemo(
    () => dateToDuration({ date: watchCreatedAt }),
    [watchCreatedAt]
  );

  useEffect(() => {
    const subscription = watch(({ priority }) => {
      updateIncidentHandler({ severity: priority });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateIncidentHandler]);

  const getResponderTitle = (properties) => {
    if (properties.responderType === "Email") {
      return properties.to;
    } else if (properties.responderType === "AWS AMS Service Request") {
      return properties.category;
    } else if (properties.responderType === "AWS Support") {
      return properties.category;
    } else if (properties.responderType === "ServiceNow") {
      return properties.category;
    } else if (properties.responderType === "CA") {
      return properties.category;
    } else if (properties.responderType === "Redhat") {
      return properties.product;
    } else if (properties.responderType === "Oracle") {
      return properties.product;
    } else if (properties.responderType === "Microsoft") {
      return properties.product;
    } else if (properties.responderType === "VMWare") {
      return properties.product;
    } else if (properties.responderType === "Person") {
      return properties.person;
    } else if (properties.responderType === "Jira") {
      return properties.project;
    }
  };

  async function fetchResponders() {
    try {
      const result = await getRespondersForTheIncident(incident.id);
      const data = (result?.data || []).map((item) => {
        return {
          name: getResponderTitle(item.properties),
          icon: ResponderTypeOptions.find(
            (option) => option.label === item.properties.responderType
          )?.icon,
          properties: Object.keys(item.properties)
            .map((key) => {
              if (key !== "responderType") {
                return {
                  label: ResponderPropsKeyToLabelMap[key],
                  value: item.properties[key]
                };
              }
            })
            .filter((v) => v),
          json: item
        };
      });
      setResponders(data);
    } catch (ex) {}
  }

  async function initiateDeleteResponder(id) {
    try {
      const result = await deleteResponder(id);
      if (!result?.error) {
        fetchResponders();
      } else {
        toastError("Responder delete failed");
      }
    } catch (ex) {
      toastError("Responder delete failed");
    }
  }

  useEffect(() => {
    if (!incident?.id) {
      return;
    }
    fetchResponders();
  }, [incident]);

  return (
    <div className="px-6 pt-3.5">
      <div className="flex justify-between mb-7">
        <h2 className="mt-0.5 text-2xl font-medium leading-7 text-dark-gray">
          Details
        </h2>
        <button
          type="button"
          className="btn-secondary btn-secondary-sm text-dark-blue"
        >
          Share
        </button>
      </div>
      {/* <IncidentDetailsRow
        title="Chart Room"
        value={
          <a
            href={getValues("chartRoom")}
            className="underline text-dark-blue text-sm font-normal"
          >
            {getValues("chartRoomTitle")}
          </a>
        }
      />
      <IncidentDetailsRow
        title="Status Page"
        className="mt-2.5"
        value={
          <a
            href={getValues("statusPage")}
            className="underline text-dark-blue text-sm font-normal"
          >
            {getValues("statusPageTitle")}
          </a>
        }
      /> */}
      <div className="mt-1">
        {Boolean(responders.length) && (
          <h2 className="text-dark-gray text-sm font-medium">Responders</h2>
        )}
        {responders.map((responder) => {
          return (
            <div className="mt-1 cursor-pointer" key={responder.json.id}>
              <div className="relative py-2 flex items-center space-x-3">
                {responder.icon && (
                  <div className="flex-shrink-0">
                    {<responder.icon className="inline-block" />}
                  </div>
                )}
                <div className="flex-1 min-w-0 group">
                  <div className="text-dark-gray text-sm font-medium inline-block">
                    {responder.name}
                  </div>
                  <div
                    className="inline-block ml-10 cursor-pointer"
                    onClick={(e) => initiateDeleteResponder(responder.json.id)}
                  >
                    <MdDelete className="hidden group-hover:inline-block text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <AddResponder className="py-2" onSuccess={() => fetchResponders()} />
      </div>
      <IncidentDetailsRow
        title="Commanders"
        className="mt-4"
        value={
          <Select
            name="commanders"
            isClearable
            control={control}
            hideSelectedOptions={false}
            components={{
              SingleValue: IncidentCommandersSingleValue,
              Option: IncidentCommandersOption,
              IndicatorSeparator: () => null
            }}
            options={commandersArray}
          />
        }
      />
      {/* <IncidentDetailsRow
        title="Tracking"
        className="mt-3"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {getValues("tracking")}
          </span>
        }
      /> */}
      <IncidentDetailsRow
        title="Started"
        className="mt-2.5"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {formattedCreatedAt}
          </span>
        }
      />
      <IncidentDetailsRow
        title="Duration"
        className="mt-2.5"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {formattedDuration}
          </span>
        }
      />
      <IncidentDetailsRow
        title="Priority"
        className="mt-3"
        value={
          <Select
            name="priority"
            control={control}
            components={{
              SingleValue: IncidentPrioritySingleValue,
              Option: IncidentPriorityOption,
              IndicatorSeparator: () => null
            }}
            options={priorities}
            isSearchable={false}
          />
        }
      />
      <button
        type="button"
        className="btn-primary mt-6 w-full mb-10"
        onClick={updateStatusHandler}
      >
        {textButton}
      </button>
    </div>
  );
};
