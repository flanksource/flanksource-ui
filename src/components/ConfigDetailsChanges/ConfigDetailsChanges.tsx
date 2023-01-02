import { InfoMessage } from "../../components/InfoMessage";
import { useGetConfigChangesQueryById } from "../../api/query-hooks";
import { useEffect, useMemo, useState } from "react";
import { ConfigTypeChanges } from "../ConfigChanges";
import { formatISODate, formatLongDate } from "../../utils/date";
import { JSONViewer } from "../JSONViewer";
import { Icon } from "../Icon";
import { Avatar } from "../Avatar";
import clsx from "clsx";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { Modal } from "../Modal";
import { EvidenceType } from "../../api/services/evidence";
import { DescriptionCard } from "../DescriptionCard";

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
  const properties = useMemo(() => {
    if (!changeDetails) {
      return [];
    }
    return [
      {
        label: "Name",
        value: (
          <>
            <Icon
              name={changeDetails.change_type}
              secondary="diff"
              className="w-5 h-auto pr-1"
            />
            {changeDetails.change_type}
          </>
        )
      },
      {
        label: "Date",
        value: formatISODate(changeDetails.created_at!)
      },
      {
        label: "Source",
        value: changeDetails.source! || "NA"
      },
      {
        label: "Created By",
        value: <Avatar user={changeDetails.created_by!} />
      }
    ];
  }, [changeDetails]);

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
        <div className="px-4 py-5">
          <DescriptionCard items={properties} labelStyle="top" noOfCols={2} />
          <DescriptionCard
            className="mt-2"
            items={[
              {
                label: "Details",
                value: (
                  <div
                    className={clsx(
                      "w-full max-h-56 overflow-y-auto overflow-x-auto border border-gray-200 rounded",
                      changeDetails?.details ? "" : "h-16"
                    )}
                  >
                    <JSONViewer
                      code={JSON.stringify(changeDetails?.details, null, 2)}
                      format="json"
                    />
                  </div>
                )
              }
            ]}
            labelStyle="top"
          />
          <DescriptionCard
            className="mt-4"
            items={[
              {
                label: "Change",
                value: (
                  <div className="w-full max-h-56 overflow-y-auto overflow-x-auto border border-gray-200 rounded">
                    <JSONViewer
                      code={JSON.stringify(changeDetails?.patches, null, 2)}
                      format="json"
                    />
                  </div>
                )
              }
            ]}
            labelStyle="top"
          />
        </div>
      )}
      {viewType === "summary" && (
        <DescriptionCard
          className="px-2"
          items={[
            {
              label: (
                <div className="overflow-hidden truncate">
                  <Icon
                    name={changeDetails?.change_type}
                    secondary="diff"
                    className="w-5 h-auto pr-1"
                  />
                  {changeDetails?.change_type}
                </div>
              ),
              value: (
                <div className="break-all overflow-hidden truncate">
                  changes made at {formatLongDate(changeDetails?.created_at!)}
                </div>
              )
            }
          ]}
          labelStyle="top"
        />
      )}
    </div>
  );
}
