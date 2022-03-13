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
import { priorities } from "./data";

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

  const respondersArray = useMemo(() =>
    incident.responder.map(
      (item, index) => ({
        label: item.created_by.name,
        value: `${index}`,
        avatar: item.created_by.avatar
      }),
      [incident]
    )
  );

  const { control, getValues, watch } = useForm({
    defaultValues: {
      tracking: "123456",
      created_at: incident.created_at,
      chartRoomTitle: "#Slack",
      chartRoom: "https://google.com.ua",
      statusPageTitle: "StatusPage.io",
      statusPage: "https://www.atlassian.com/software/statuspage",
      priority: incident.severity || IncidentPriority.High,
      commanders: incident.commander_id.id,
      respondents: respondersArray?.[0]?.value || null
    }
  });
  watch();
  const DATE_FORMAT = "DD.MM.YYYY";
  const formatDate = ({ date, format = DATE_FORMAT, fallback = "-" }) =>
    date ? dayjs(date).format(format) : fallback;
  const dateToDuration = ({ date, withoutSuffix = false, fallback = "-" }) =>
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
        className="mt-2.5"
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
        className="mt-2.5"
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
            options={respondersArray}
            isMulti
          />
        }
      />
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
      <IncidentDetailsRow
        title="Tracking"
        className="mt-3"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {getValues("tracking")}
          </span>
        }
      />
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
