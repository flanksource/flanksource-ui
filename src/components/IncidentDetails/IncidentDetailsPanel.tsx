import clsx from "clsx";
import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsCardList, BsShareFill } from "react-icons/bs";
import { Incident } from "../../api/services/incident";
import { IncidentPriority } from "../../constants";
import { relativeDateTime } from "../../utils/date";
import CollapsiblePanel from "../CollapsiblePanel";
import { typeItems, incidentStatusItems } from "../Incidents/data";
import IncidentTypeDropdown from "../Incidents/IncidentTypeDropdown";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import Title from "../Title/title";
import { IncidentDetailsRow } from "./IncidentDetailsRow";
import { priorities } from "./IncidentSidebar";
import { IncidentWorkflow } from "./IncidentWorkflow";
import { Responders } from "./Responders";

type IncidentDetailsPanelProps = React.HTMLProps<HTMLDivElement> & {
  incident: Incident;
  updateIncidentHandler: (newDataIncident: Partial<Incident>) => void;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export function IncidentDetailsPanel({
  incident,
  updateIncidentHandler,
  isCollapsed,
  onCollapsedStateChange,
  className,
  ...props
}: IncidentDetailsPanelProps) {
  const commandersArray = useMemo(
    () => [
      {
        label: incident.commander?.name,
        value: incident.commander?.id,
        avatar: incident.commander?.avatar
      }
    ],
    [incident]
  );

  const { control, watch } = useForm({
    defaultValues: {
      tracking: "123456",
      created_at: incident.created_at,
      chartRoomTitle: "#Slack",
      chartRoom: "https://google.com.ua",
      statusPageTitle: "StatusPage.io",
      statusPage: "https://www.atlassian.com/software/statuspage",
      priority: incident.severity ?? IncidentPriority.High,
      type: typeItems[incident.type as keyof typeof typeItems]
        ? incident.type
        : undefined,
      commanders: incident.commander?.id,
      status: incidentStatusItems[
        incident.status as keyof typeof incidentStatusItems
      ]
        ? incident.status
        : undefined
    }
  });

  const watchCreatedAt = watch("created_at");
  const watchType = watch("type");
  const watchPriority = watch("priority");
  const watchCommanders = watch("commanders");
  const watchStatus = watch("status");

  const formattedCreatedAt = useMemo(
    () => relativeDateTime(watchCreatedAt),
    [watchCreatedAt]
  );
  const formattedDuration = useMemo(
    () => relativeDateTime(watchCreatedAt),
    [watchCreatedAt]
  );

  useEffect(() => {
    const subscription = watch(({ priority, type }) => {
      updateIncidentHandler({ severity: priority, type });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateIncidentHandler]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <Title title="Details" icon={<BsCardList className="w-6 h-6" />} />
      }
      className={clsx(className)}
      {...props}
    >
      <div className="flex flex-col space-y-2">
        <div className="py-4 border-b border-gray-200 hidden">
          <div className="flex justify-between">
            <h2 className="mt-0.5 text-2xl font-medium leading-7 text-dark-gray">
              Details
            </h2>
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <BsShareFill className="w-3 h-3 mr-1" /> Share
            </button>
          </div>
        </div>
        <IncidentDetailsRow
          title="Type"
          className=""
          value={
            <IncidentTypeDropdown
              control={control}
              label=""
              prefix=""
              name="type"
              className="w-full"
              dropDownClassNames="w-full"
              value={watchType}
            />
          }
        />
        <IncidentDetailsRow
          title="Status"
          className=""
          value={
            <IncidentWorkflow
              control={control}
              label=""
              name="status"
              className="w-full"
              value={watchStatus}
              incidentId={incident.id}
            />
          }
        />
        <IncidentDetailsRow
          title="Priority"
          className=""
          value={
            <ReactSelectDropdown
              control={control}
              label=""
              name="priority"
              className="w-full"
              items={priorities}
              value={watchPriority}
            />
          }
        />
        <IncidentDetailsRow
          title="Commanders"
          className=""
          value={
            <ReactSelectDropdown
              control={control}
              label=""
              name="commanders"
              className="w-full"
              items={commandersArray}
              value={watchCommanders}
            />
          }
        />
        <Responders className="py-3" incident={incident} />
        <IncidentDetailsRow
          title="Started"
          className=""
          value={
            <div className="text-gray-500 text-sm">{formattedCreatedAt}</div>
          }
        />
        <IncidentDetailsRow
          title="Duration"
          className=""
          value={
            <div className="text-gray-500 text-sm">{formattedDuration}</div>
          }
        />
      </div>
    </CollapsiblePanel>
  );
}
