import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { template } from "lodash";
import { useForm } from "react-hook-form";
import { BsCardList, BsShareFill, BsTrash } from "react-icons/bs";
import { ConfirmationPromptDialog } from "../Dialogs/ConfirmationPromptDialog";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { toastError, toastSuccess } from "../Toast/toast";
import { AddResponder, ResponderPropsKeyToLabelMap } from "./AddResponder";
import { IncidentDetailsRow } from "./IncidentDetailsRow";
import { ResponderDetailsDialog } from "./ResponderDetailsDialog";
import { ResponderDetailsToolTip } from "./ResponderDetailsToolTip";
import {
  severityItems,
  incidentStatusItems,
  typeItems
} from "../Incidents/data";
import { IncidentPriority } from "../../constants/incidentPriority";
import { Incident, IncidentStatus } from "../../api/services/incident";
import {
  deleteResponder,
  getRespondersForTheIncident
} from "../../api/services/responder";
import { relativeDateTime } from "../../utils/date";
import { IncidentsDefinitionOfDone } from "./DefinitionOfDone/IncidentsDefinitionOfDone";
import IncidentTypeDropdown from "../Incidents/IncidentTypeDropdown";
import { IncidentWorkflow } from "./IncidentWorkflow";
import CollapsiblePanel from "../CollapsiblePanel";
import Title from "../Title/title";
import { IncidentChangelog } from "../Changelog/IncidentChangelog";
import SlidingSideBar from "../SlidingSideBar";
import { MdOutlineQuickreply } from "react-icons/md";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";
import { Badge } from "../Badge";

export const priorities = Object.entries(severityItems).map(([key, value]) => ({
  label: value.name,
  value: key as keyof typeof IncidentPriority,
  icon: value.icon
}));

type IncidentSidebarProps = React.HTMLProps<HTMLDivElement> & {
  incident: Incident;
  updateStatusHandler: (status: IncidentStatus) => void;
  updateIncidentHandler: (newDataIncident: Partial<Incident>) => void;
  textButton: string;
};

export const IncidentSidebar = ({
  incident,
  updateIncidentHandler
}: IncidentSidebarProps) => {
  const [responders, setResponders] = useState<Record<string, any>[]>([]);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [deletedResponder, setDeletedResponder] =
    useState<Record<string, any>>();
  const [openResponderDetailsDialog, setOpenResponderDetailsDialog] =
    useState(false);
  const [selectedResponder, setSelectedResponder] =
    useState<Record<string, any>>();

  // Temporary mock, in the future you need to replace it with an array of real users received from the api
  const commandersArray = useMemo(
    () => [
      {
        label: incident.commander.name,
        value: incident.commander.id,
        avatar: incident.commander.avatar
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
      type: typeItems[incident.type as keyof typeof typeItems]
        ? incident.type
        : undefined,
      commanders: incident.commander.id,
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

  async function fetchResponders() {
    try {
      const result = await getRespondersForTheIncident(incident.id);
      const data = (result?.data || []).map((item: any) => {
        item.properties.external_id = item.external_id || "NA";
        item.links = {};
        if (item.external_id) {
          item.links.external_id_link =
            item?.team_id?.spec?.responder_clients?.[
              item?.properties?.responderType
            ]?.linkUrl;
          if (item.links.external_id_link) {
            try {
              item.links.external_id_link = template(
                item.links.external_id_link
              )({
                ID: item.external_id
              });
            } catch (ex) {}
          }
        }
        return {
          name: item.team_id?.name,
          type: item.properties.responderType,
          external_id: item.external_id,
          links: item.links,
          icon:
            item.team_id?.icon &&
            (() => (
              <Icon
                className="inline-block mr-1 h-5"
                name={item.team_id.icon}
              />
            )),
          properties: Object.keys(item.properties)
            .map((key) => {
              if (!["responderType"].includes(key)) {
                return ResponderPropsKeyToLabelMap[
                  key as keyof typeof ResponderPropsKeyToLabelMap
                ]
                  ? {
                      label:
                        ResponderPropsKeyToLabelMap[
                          key as keyof typeof ResponderPropsKeyToLabelMap
                        ],
                      value: item.properties[key],
                      link: item.links[`${key}_link`]
                        ? {
                            label: item.properties[key],
                            value: item.links[`${key}_link`]
                          }
                        : null
                    }
                  : undefined;
              }
            })
            .filter((v) => v),
          id: item.id,
          json: item
        };
      });
      setResponders(data);
    } catch (ex) {
      console.error(ex);
    }
  }

  async function initiateDeleteResponder() {
    const id = deletedResponder?.id;
    try {
      const result = await deleteResponder(id);
      if (!result?.error) {
        fetchResponders();
        toastSuccess("Responder deleted successfully");
      } else {
        toastError("Responder delete failed");
      }
    } catch (ex: any) {
      toastError(ex.message);
    }
    setOpenDeleteConfirmDialog(false);
  }

  useEffect(() => {
    if (!incident?.id) {
      return;
    }
    fetchResponders();
  }, [incident]);

  return (
    <SlidingSideBar hideToggle={true}>
      <CollapsiblePanel
        Header={
          <Title title="Details" icon={<BsCardList className="w-6 h-6" />} />
        }
      >
        <div className="flex flex-col">
          <div className="py-4 border-b border-gray-200 hidden">
            <div className="flex justify-between px-4">
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
            title="Commanders"
            className="mt-4 px-4"
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
          <IncidentDetailsRow
            title="Started"
            className="mt-2.5 px-4"
            value={
              <span className="text-gray-500 font-medium">
                {formattedCreatedAt}
              </span>
            }
          />
          <IncidentDetailsRow
            title="Duration"
            className="mt-2.5 px-4"
            value={
              <span className="text-gray-500 font-medium">
                {formattedDuration}
              </span>
            }
          />
          <IncidentDetailsRow
            title="Type"
            className="mt-3 px-4"
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
            className="mt-3 px-4"
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
            className="mt-3 px-4"
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
        </div>
      </CollapsiblePanel>
      <CollapsiblePanel
        Header={
          <div className="flex flex-row w-full items-center space-x-2">
            <Title
              title="Responders"
              icon={<MdOutlineQuickreply className="w-6 h-6" />}
            />
            <Badge
              className="w-5 h-5 flex items-center justify-center"
              roundedClass="rounded-full"
              text={responders?.length ?? 0}
            />
          </div>
        }
      >
        <div className="flex flex-col">
          {Boolean(responders.length) && (
            <div className="px-4">
              {responders.map((responder) => {
                return (
                  <div
                    key={responder.json.id}
                    className="relative flex items-center py-2 mt-1 rounded"
                  >
                    <div className="flex-1 w-full min-w-0">
                      <ResponderDetailsToolTip
                        className="w-full"
                        responder={responder}
                        data={responder?.json?.properties}
                        element={
                          <div className="relative w-full overflow-hidden text-sm font-medium truncate text-dark-gray group">
                            <div className=" overflow-hidden">
                              {responder.icon && (
                                <responder.icon className="h-6" />
                              )}
                              <div
                                className="inline-block pl-1 align-middle"
                                onClick={() => {
                                  setOpenResponderDetailsDialog(true);
                                  setSelectedResponder(responder);
                                }}
                              >
                                <div className="flex-1 inline-block align-middle max-w-32">
                                  <div
                                    className="truncate cursor-pointer hover:underline"
                                    title={responder?.name}
                                  >
                                    {responder?.name}
                                  </div>
                                </div>
                                <div className="flex-1 inline-block align-middle">
                                  {responder.external_id && (
                                    <a
                                      href={responder?.links?.external_id_link}
                                      target="_blank"
                                      className="inline-block pl-1 text-blue-600 underline align-middle hover:text-blue-800 visited:text-blue-600"
                                      onClick={(e) => e.stopPropagation()}
                                      rel="noreferrer"
                                      title={responder.external_id}
                                    >
                                      (
                                      <span className="inline-block truncate align-middle max-w-32">
                                        {responder.external_id}
                                      </span>
                                      )
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="absolute right-0 ml-10 top-1">
                              <IconButton
                                className="hidden bg-transparent group-hover:inline-block z-5"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setOpenDeleteConfirmDialog(true);
                                  setDeletedResponder(responder);
                                }}
                                ovalProps={{
                                  stroke: "blue",
                                  height: "18px",
                                  width: "18px",
                                  fill: "transparent"
                                }}
                                icon={
                                  <ClickableSvg styleFill={false}>
                                    <BsTrash
                                      className="text-gray-600 border-0 border-gray-200 border-l-1"
                                      size={18}
                                    />
                                  </ClickableSvg>
                                }
                              />
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="relative flex items-center py-2 px-4">
            <button
              type="button"
              className="flex items-center bg-white rounded-md group"
            >
              <span className="flex items-center justify-center w-5 h-5 text-gray-400 border-2 border-gray-300 border-dashed rounded-full">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm font-medium text-blue-600 group-hover:text-blue-500">
                <AddResponder
                  className="flex justify-end flex-1 w-full"
                  onSuccess={() => fetchResponders()}
                  incident={incident}
                />
              </span>
            </button>
          </div>
          <ConfirmationPromptDialog
            isOpen={openDeleteConfirmDialog}
            title="Delete Responder ?"
            description="Are you sure you want to delete the responder ?"
            onClose={() => setOpenDeleteConfirmDialog(false)}
            onConfirm={() => {
              initiateDeleteResponder();
            }}
          />
          <ResponderDetailsDialog
            size="medium"
            open={openResponderDetailsDialog}
            responder={selectedResponder}
            data={selectedResponder?.json?.properties}
            onClose={() => {
              setOpenResponderDetailsDialog(false);
            }}
          />
        </div>
      </CollapsiblePanel>
      <IncidentsDefinitionOfDone incidentId={incident.id} />
      <IncidentChangelog
        incidentId={incident.id}
        className="flex flex-col bg-white"
      />
    </SlidingSideBar>
  );
};
