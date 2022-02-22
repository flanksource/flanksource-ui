import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { IncidentDetailsRow } from "./IncidentDetailsRow";
import { Select } from "../Select";
import { IncidentPriority } from "../../constants/incident-priority";
import {
  IncidentCommandersOption,
  IncidentCommandersSingleValue,
  IncidentPriorityOption,
  IncidentPrioritySingleValue,
  IncidentRespondentsMultiValueLabel,
  IncidentRespondentsOption
} from "./select-components";
import { personRespondents, priorities } from "./data";

export const IncidentDetails = ({
  incident,
  node,
  updateStatusHandler,
  textButton
}) => {
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

  const { control, getValues, watch } = useForm({
    defaultValues: {
      tracking: "123456",
      started: incident.created_at,
      duration: incident.created_at,
      chartRoomTitle: "#Slack",
      chartRoom: "https://google.com.ua",
      statusPageTitle: "StatusPage.io",
      statusPage: "https://www.atlassian.com/software/statuspage",
      priority: incident.severity || IncidentPriority.High,
      commanders: incident.commander_id.id,
      respondents: personRespondents[0].value || null
    }
  });
  watch();
  const formatDate = (date, fallback = "-") => {
    const getDate = date ? dayjs(date).format("DD.MM.YYYY") : fallback;
    const getDuration = date ? dayjs(incident.created_at).fromNow() : fallback;
    return { getDate, getDuration };
  };
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
      <IncidentDetailsRow
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
        value={
          <a
            href={getValues("statusPage")}
            className="underline text-dark-blue text-sm font-normal"
          >
            {getValues("statusPageTitle")}
          </a>
        }
      />
      <IncidentDetailsRow
        title="Respondents"
        value={
          <Select
            name="respondents"
            control={control}
            hideSelectedOptions={false}
            components={{
              MultiValueLabel: IncidentRespondentsMultiValueLabel,
              Option: IncidentRespondentsOption,
              IndicatorSeparator: () => null,
              MultiValueRemove: () => null,
              ClearIndicator: () => null
            }}
            styles={{
              multiValue: () => ({
                marginLeft: -4
              })
            }}
            options={personRespondents}
            isMulti
          />
        }
      />
      <IncidentDetailsRow
        title="Commanders"
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
      <IncidentDetailsRow
        title="Tracking"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {getValues("tracking")}
          </span>
        }
      />
      <IncidentDetailsRow
        title="Started"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {formatDate(getValues("started")).getDate}
          </span>
        }
      />
      <IncidentDetailsRow
        title="Duration"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {formatDate(getValues("duration")).getDuration}
          </span>
        }
      />
      <IncidentDetailsRow
        title="Priority"
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
        className="btn-primary mt-0.5 w-full mb-10"
        onClick={updateStatusHandler}
      >
        {textButton}
      </button>
    </div>
  );
};
