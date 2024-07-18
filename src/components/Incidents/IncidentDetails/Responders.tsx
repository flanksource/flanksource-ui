import { useIncidentRespondersQuery } from "@flanksource-ui/api/query-hooks/useIncidentRespondersQuery";
import { deleteResponder } from "@flanksource-ui/api/services/responder";
import { Incident } from "@flanksource-ui/api/types/incident";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { ClickableSvg } from "@flanksource-ui/ui/ClickableSvg/ClickableSvg";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import { IconButton } from "../../../ui/Buttons/IconButton";
import { toastError, toastSuccess } from "../../Toast/toast";
import { AddResponder } from "./AddResponders/AddResponder";
import { IncidentDetailsRow } from "./IncidentDetailsRow";
import { ResponderDetailsDialog } from "./ResponderDetailsDialog";
import { ResponderDetailsToolTip } from "./ResponderDetailsToolTip";

type RespondersProps = React.HTMLProps<HTMLDivElement> & {
  incident: Incident;
};

export function Responders({ incident, className, ...props }: RespondersProps) {
  const { data: responders = [], refetch } = useIncidentRespondersQuery(
    incident.id
  );
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openResponderDetailsDialog, setOpenResponderDetailsDialog] =
    useState(false);
  const [selectedResponder, setSelectedResponder] =
    useState<Record<string, any>>();
  const [deletedResponder, setDeletedResponder] =
    useState<Record<string, any>>();

  const { mutate: deleteResponderFN, isLoading } = useMutation({
    mutationFn: (id: string) => deleteResponder(id),
    onError: (error: any) => {
      toastError(error.message);
    },
    onSuccess: () => {
      refetch();
      toastSuccess("Responder deleted successfully");
    },
    onSettled: () => {
      setOpenDeleteConfirmDialog(false);
    }
  });

  return (
    <div className={clsx(className)} {...props}>
      <IncidentDetailsRow
        title="Responders"
        className=""
        value={
          <div className="relative flex flex-col items-center">
            <div className="flex w-full flex-col">
              {responders.length > 0 && (
                <div className="flex flex-col gap-2 py-4">
                  {responders.map((responder) => {
                    return (
                      <div
                        key={responder.json.id}
                        className="relative mt-1 flex items-center rounded"
                      >
                        <div className="flex w-full min-w-0 flex-col">
                          <ResponderDetailsToolTip
                            className="w-full"
                            responder={responder}
                            data={responder?.json?.properties as any}
                            element={
                              <div className="group relative flex w-full flex-1 flex-row overflow-hidden truncate text-sm font-medium text-dark-gray">
                                <div className="flex flex-1 flex-row gap-1 overflow-hidden">
                                  {responder.icon && <responder.icon />}
                                  <div
                                    className="flex h-full flex-1 items-center justify-center pl-1 align-middle"
                                    onClick={() => {
                                      setOpenResponderDetailsDialog(true);
                                      setSelectedResponder(responder);
                                    }}
                                  >
                                    <div className="inline-block max-w-32 flex-1 align-middle">
                                      <div
                                        className="cursor-pointer truncate hover:underline"
                                        title={responder?.name}
                                      >
                                        {responder?.name}
                                      </div>
                                    </div>
                                    <div className="inline-block flex-1 align-middle">
                                      {responder.external_id && (
                                        <a
                                          href={
                                            responder?.links?.external_id_link
                                          }
                                          target="_blank"
                                          className="inline-block pl-1 align-middle text-blue-600 underline visited:text-blue-600 hover:text-blue-800"
                                          onClick={(e) => e.stopPropagation()}
                                          rel="noreferrer"
                                          title={responder.external_id}
                                        >
                                          (
                                          <span className="inline-block max-w-32 truncate align-middle">
                                            {responder.external_id}
                                          </span>
                                          )
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="absolute right-0 top-1 ml-10">
                                  <IconButton
                                    className="z-5 hidden bg-transparent group-hover:inline-block"
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
                                        {!isLoading ? (
                                          <BsTrash
                                            className="border-l-1 border-0 border-gray-200 text-gray-600"
                                            size={18}
                                          />
                                        ) : (
                                          <FaSpinner
                                            className="animate-spin"
                                            size={18}
                                          />
                                        )}
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
            </div>

            <AddResponder
              className="flex w-full flex-1 flex-col justify-end"
              onSuccess={() => refetch()}
              incident={incident}
            />
          </div>
        }
      />

      <ConfirmationPromptDialog
        isOpen={openDeleteConfirmDialog}
        title="Delete Responder ?"
        description="Are you sure you want to delete the responder ?"
        onClose={() => setOpenDeleteConfirmDialog(false)}
        onConfirm={() => deleteResponderFN(deletedResponder?.id)}
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
  );
}
