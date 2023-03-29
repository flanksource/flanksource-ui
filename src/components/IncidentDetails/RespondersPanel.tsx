import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { MdOutlineQuickreply } from "react-icons/md";
import { useIncidentRespondersQuery } from "../../api/query-hooks/useIncidentRespondersQuery";
import { Incident } from "../../api/services/incident";
import { deleteResponder } from "../../api/services/responder";
import { Badge } from "../Badge";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";
import CollapsiblePanel from "../CollapsiblePanel";
import { ConfirmationPromptDialog } from "../Dialogs/ConfirmationPromptDialog";
import { IconButton } from "../IconButton";
import Title from "../Title/title";
import { toastSuccess, toastError } from "../Toast/toast";
import { AddResponder } from "./AddResponder";
import { ResponderDetailsDialog } from "./ResponderDetailsDialog";
import { ResponderDetailsToolTip } from "./ResponderDetailsToolTip";

type RespondersPanelProps = React.HTMLProps<HTMLDivElement> & {
  incident: Incident;
};

export function RespondersPanel({ incident }: RespondersPanelProps) {
  const { data: responders = [], refetch } = useIncidentRespondersQuery(
    incident.id
  );
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [deletedResponder, setDeletedResponder] =
    useState<Record<string, any>>();
  const [openResponderDetailsDialog, setOpenResponderDetailsDialog] =
    useState(false);
  const [selectedResponder, setSelectedResponder] =
    useState<Record<string, any>>();

  async function initiateDeleteResponder() {
    const id = deletedResponder?.id;
    try {
      const result = await deleteResponder(id);
      if (!result?.error) {
        refetch();
        toastSuccess("Responder deleted successfully");
      } else {
        toastError("Responder delete failed");
      }
    } catch (ex: any) {
      toastError(ex.message);
    }
    setOpenDeleteConfirmDialog(false);
  }

  return (
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
          <div className="flex items-center bg-white rounded-md group">
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
                onSuccess={() => refetch()}
                incident={incident}
              />
            </span>
          </div>
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
  );
}
