import clsx from "clsx";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { BsCardList, BsShareFill } from "react-icons/bs";
import { Incident, IncidentPriority } from "../../../api/types/incident";
import { Age } from "../../../ui/Age";
import CollapsiblePanel from "../../../ui/CollapsiblePanel/CollapsiblePanel";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";
import Title from "../../Title/title";
import IncidentTypeDropdown from "../IncidentTypeDropdown";
import { incidentStatusItems, typeItems } from "../data";
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

  const { control, watch, handleSubmit, getValues } = useForm({
    mode: "onBlur",
    defaultValues: {
      title: incident.title,
      created_at: incident.created_at,
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

  const formValues = getValues();

  const formattedCreatedAt = useMemo(
    () => <Age from={watchCreatedAt} />,
    [watchCreatedAt]
  );
  const formattedDuration = useMemo(
    () => <Age from={watchCreatedAt} />,
    [watchCreatedAt]
  );

  // we need to debounce this function because it's called on every key press in
  // the form and this can cause a lot of unnecessary requests to the server
  // when editing the title
  const onSubmit = debounce(({ priority, type, title }: typeof formValues) => {
    updateIncidentHandler({
      severity: priority,
      type
    });
  }, 500);

  useEffect(() => {
    const subscription = watch(handleSubmit(onSubmit) as any);
    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, onSubmit]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <Title title="Details" icon={<BsCardList className="h-6 w-6" />} />
      }
      className={clsx(className)}
      {...props}
    >
      <div className="flex flex-col space-y-2">
        <div className="hidden border-b border-gray-200 py-4">
          <div className="flex justify-between">
            <h2 className="mt-0.5 text-2xl font-medium leading-7 text-dark-gray">
              Details
            </h2>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <BsShareFill className="mr-1 h-3 w-3" /> Share
            </button>
          </div>
        </div>
        <IncidentDetailsRow
          title="Id"
          className="h-8"
          value={
            <span className="font-medium text-gray-500">
              {incident.incident_id}
            </span>
          }
        />
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
            <div className="text-sm text-gray-500">{formattedCreatedAt}</div>
          }
        />
        <IncidentDetailsRow
          title="Duration"
          className=""
          value={
            <div className="text-sm text-gray-500">{formattedDuration}</div>
          }
        />
      </div>
    </CollapsiblePanel>
  );
}
