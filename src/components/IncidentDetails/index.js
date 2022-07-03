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
import { AddResponder } from "./AddResponder";
import { AvatarGroup } from "../AvatarGroup";

export const IncidentDetails = ({
  incident,
  updateStatusHandler,
  updateIncidentHandler,
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

  const respondersArray = useMemo(
    () =>
      incident.responder.map((item, index) => ({
        label: item.created_by.name,
        value: `${index}`,
        avatar: item.created_by.avatar
      })),
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
      commanders: incident.commander_id.id,
      respondents: respondersArray?.[0]?.value || null
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
      <AddResponder />
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
        <h2 className="text-base font-medium">Responders</h2>
        <div className="max-h-48 overflow-y-scroll shadow sm:rounded-lg p-2">
          {respondersArray.map((responder) => {
            return (
              <div className="mt-1" key={responder.id}>
                <div className="relative rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <AvatarGroup
                      users={[{ ...responder, name: responder.label }]}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href="#" className="focus:outline-none">
                      <span
                        className="absolute inset-0"
                        aria-hidden="true"
                      ></span>
                      <p className="text-sm font-medium text-gray-900">
                        {responder.label}
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
