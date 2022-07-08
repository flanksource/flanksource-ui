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
import { toastError, toastSuccess } from "../Toast/toast";
import { IconButton } from "../IconButton";
import { BsTrash } from "react-icons/bs";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { ResponderDetailsToolTip } from "./ResponderDetailsToolTip";
import { ResponderDetailsDialog } from "./ResponderDetailsDialog";

export const IncidentDetails = ({
  incident,
  updateStatusHandler,
  updateIncidentHandler,
  textButton
}) => {
  const [responders, setResponders] = useState([]);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [deletedResponder, setDeletedResponder] = useState();
  const [openResponderDetailsDialog, setOpenResponderDetailsDialog] =
    useState(false);
  const [selectedResponder, setSelectedResponder] = useState();

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
    return (
      properties.id ||
      properties.title ||
      properties.to ||
      properties.description ||
      properties.person
    );
  };

  async function fetchResponders() {
    try {
      const result = await getRespondersForTheIncident(incident.id);
      const data = (result?.data || []).map((item) => {
        return {
          name: getResponderTitle(item.properties),
          type: item.properties.responderType,
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
          id: item.id,
          json: item
        };
      });
      setResponders(data);
    } catch (ex) {}
  }

  async function initiateDeleteResponder() {
    const id = deletedResponder.id;
    try {
      const result = await deleteResponder(id);
      if (!result?.error) {
        fetchResponders();
        toastSuccess("Responder deleted successfully");
      } else {
        toastError("Responder delete failed");
      }
    } catch (ex) {
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
      <div className="grid grid-cols-1-to-2 gap-6 mt-4">
        <h2 className="text-dark-gray text-sm font-medium">Responders</h2>
        {!responders.length && (
          <AddResponder onSuccess={() => fetchResponders()} />
        )}
        {Boolean(responders.length) && (
          <div>
            {responders.map((responder) => {
              return (
                <div
                  className="cursor-pointer"
                  key={responder.json.id}
                  onClick={(e) => {
                    setOpenResponderDetailsDialog(true);
                    setSelectedResponder(responder);
                  }}
                >
                  <div className="relative flex hover:bg-gray-100 p-1 items-center rounded">
                    {responder.icon && <responder.icon className="w-6 h-6" />}
                    <div className="flex-1 min-w-0 w-full">
                      <ResponderDetailsToolTip
                        className="w-full"
                        responder={responder}
                        data={responder?.json?.properties}
                        element={
                          <div className="text-dark-gray group text-sm font-medium relative w-full overflow-hidden truncate pr-4 pl-2">
                            {responder.name}
                            <div className="ml-10 cursor-pointer absolute right-0 top-1">
                              <IconButton
                                className="bg-transparent hidden group-hover:inline-block z-5"
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
                                  <BsTrash
                                    className="text-gray-600 border-0 border-l-1 border-gray-200"
                                    size={18}
                                  />
                                }
                              />
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {Boolean(responders.length) && (
        <div className="grid grid-cols-1-to-2 gap-6 items-center">
          <div></div>
          <AddResponder onSuccess={() => fetchResponders()} />
        </div>
      )}
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
      <DeleteConfirmDialog
        isOpen={openDeleteConfirmDialog}
        title="Delete Responder ?"
        description="Are you sure you want to delete the responder ?"
        onClose={() => setOpenDeleteConfirmDialog(false)}
        onDelete={() => {
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
