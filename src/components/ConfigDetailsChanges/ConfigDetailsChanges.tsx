import { InfoMessage } from "../../components/InfoMessage";
import { useGetConfigChangesQueryById } from "../../api/query-hooks";
import { useEffect, useState } from "react";
import { ConfigTypeChanges } from "../ConfigChanges";
import { formatISODate, formatLongDate } from "../../utils/date";
import { JSONViewer } from "../JSONViewer";
import { Icon } from "../Icon";
import { Avatar } from "../Avatar";
import clsx from "clsx";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { Modal } from "../Modal";
import { EvidenceType } from "../../api/services/evidence";
import { Description } from "../Description/description";

export function ConfigDetailsChanges({
  configId,
  id,
  viewType = "detailed"
}: {
  id: string;
  configId: string;
  viewType?: "detailed" | "summary";
}) {
  const {
    data: historyData,
    isLoading,
    error
  } = useGetConfigChangesQueryById(configId!);
  const [open, setOpen] = useState(false);
  const [attachEvidence, setAttachEvidence] = useState(false);
  const [changeDetails, setChangeDetails] = useState<ConfigTypeChanges>();

  useEffect(() => {
    setChangeDetails(historyData?.find((item) => item.id === id));
  }, [historyData, id]);

  if (error || (!changeDetails && !isLoading)) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : error?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <div
      className="overflow-hidden bg-white cursor-pointer"
      onClick={(e) => {
        setOpen(true);
      }}
    >
      <Modal
        title={
          <>
            <Icon
              name={changeDetails?.change_type}
              secondary="diff"
              className="w-5 h-auto pr-1"
            />
            {changeDetails?.change_type}
          </>
        }
        open={open}
        onClose={(e) => {
          e?.stopPropagation();
          setOpen(false);
        }}
        size="large"
        bodyClass=""
      >
        <div
          className="flex flex-col h-full"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          {changeDetails?.config_id && (
            <ConfigDetailsChanges
              configId={changeDetails.config_id}
              id={changeDetails.id}
            />
          )}
        </div>
        <div className="flex items-center justify-end py-4 px-5 rounded-lg bg-gray-100">
          <button
            type="button"
            onClick={() => {
              setAttachEvidence(true);
            }}
            className="btn-primary"
          >
            Attach as Evidence
          </button>
        </div>
        <AttachEvidenceDialog
          key={`attach-evidence-dialog`}
          isOpen={attachEvidence}
          onClose={() => setAttachEvidence(false)}
          config_change_id={changeDetails?.id}
          config_id={changeDetails?.config_id}
          evidence={{}}
          type={EvidenceType.ConfigChange}
          callback={(success: boolean) => {
            if (success) {
              setAttachEvidence(false);
            }
          }}
        />
      </Modal>
      {viewType === "detailed" && (
        <div className="px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <Description
                label="Name"
                value={
                  <>
                    <Icon
                      name={changeDetails?.change_type}
                      secondary="diff"
                      className="w-5 h-auto pr-1"
                    />
                    {changeDetails?.change_type}
                  </>
                }
              />
            </div>
            <div className="sm:col-span-1">
              <Description
                label="Date"
                value={formatISODate(changeDetails?.created_at!)}
              />
            </div>
            <div className="sm:col-span-1">
              <Description
                label="Source"
                value={changeDetails?.source! || "NA"}
              />
            </div>
            <div className="sm:col-span-1">
              <Description
                label="Created By"
                value={<Avatar user={changeDetails?.created_by!} />}
              />
            </div>
          </div>
          <div className="py-1">
            <dt className="text-sm font-medium text-gray-500">Details</dt>
            <dd
              className={clsx(
                "mt-1 text-sm text-gray-900 max-h-56 overflow-y-auto overflow-x-auto border-gray-300 border border-gray-200 rounded",
                changeDetails?.details ? "" : "h-16"
              )}
            >
              <JSONViewer
                code={JSON.stringify(changeDetails?.details, null, 2)}
                format="json"
              />
            </dd>
          </div>
          <div className="py-1">
            <dt className="font-medium text-gray-500">Change</dt>
            <dd className="mt-1 text-sm text-gray-900 max-h-56 overflow-y-auto overflow-x-auto border-gray-300 border border-gray-200 rounded">
              <JSONViewer
                code={JSON.stringify(changeDetails?.patches, null, 2)}
                format="json"
              />
            </dd>
          </div>
        </div>
      )}
      {viewType === "summary" && (
        <div className="px-2 text-sm">
          <div className="grid grid-cols-1 space-y-1">
            <div className="flex flex-row items-center">
              <div className="overflow-hidden truncate text-gray-500">
                <Icon
                  name={changeDetails?.change_type}
                  secondary="diff"
                  className="w-5 h-auto pr-1"
                />
                {changeDetails?.change_type}
              </div>
            </div>
            <div className="flex flex-row items-center">
              <dd className="text-gray-700 font-light text-left break-all overflow-hidden truncate">
                changes made at {formatLongDate(changeDetails?.created_at!)}
              </dd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
