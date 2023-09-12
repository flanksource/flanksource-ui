import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import ReactTooltip from "react-tooltip";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { useGetConfigChangesByConfigChangeIdQuery } from "../../api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigItem } from "../../api/services/configs";
import { EvidenceType } from "../../api/services/evidence";
import { User } from "../../api/services/users";
import { ViewType } from "../../types";
import { formatISODate } from "../../utils/date";
import AttachAsEvidenceButton from "../AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import { Avatar } from "../Avatar";
import { ConfigTypeChanges } from "../ConfigChanges";
import ConfigLink from "../ConfigLink/ConfigLink";
import { DescriptionCard } from "../DescriptionCard";
import { DiffRenderer } from "../DiffRenderer/DiffRenderer";
import EmptyState from "../EmptyState";
import { Icon } from "../Icon";
import { JSONViewer } from "../JSONViewer";
import { Modal } from "../Modal";

type ConfigDetailsChangesProps = {
  id: string;
  configId: string;
  viewType?: ViewType;
  data?: ConfigTypeChanges;
  showConfigLogo?: boolean;
};

export function ConfigDetailsChanges({
  configId,
  id,
  viewType = ViewType.summary,
  showConfigLogo,
  data
}: ConfigDetailsChangesProps) {
  const { data: historyData, isLoading } =
    useGetConfigChangesByConfigChangeIdQuery(id, configId!, {
      enabled: !data
    });
  const { data: config } = useGetConfigByIdQuery(configId);
  const [open, setOpen] = useState(false);
  const [changeDetails, setChangeDetails] = useState<ConfigTypeChanges>();
  const properties = useMemo(() => {
    if (!changeDetails) {
      return [];
    }
    return [
      {
        label: "Source",
        value: changeDetails.source! || ""
      },
      {
        label: "Date",
        value: formatISODate(changeDetails.created_at!)
      },
      {
        label: "Created By",
        value: <Avatar user={changeDetails.created_by! as unknown as User} />
      }
    ];
  }, [changeDetails]);

  useEffect(() => {
    setChangeDetails(historyData?.data?.[0] || data);
  }, [historyData, id, data]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (!changeDetails && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden bg-white cursor-pointer">
      <ConfigDetailChangeModal
        open={open}
        setOpen={setOpen}
        config={config}
        changeDetails={changeDetails}
      />
      {viewType === ViewType.detailed && (
        <div className="px-4 py-5">
          <DescriptionCard items={properties} labelStyle="top" columns={3} />
          {changeDetails?.details && (
            <DescriptionCard
              className="mt-2"
              items={[
                {
                  label: "Details",
                  value: (
                    <div
                      className={clsx(
                        "w-full max-h-56 overflow-y-auto overflow-x-auto border border-gray-200 rounded text-sm",
                        changeDetails?.details ? "" : "h-16"
                      )}
                    >
                      <JSONViewer
                        code={JSON.stringify(changeDetails?.details, null, 2)}
                        format="yaml"
                        convertToYaml
                      />
                    </div>
                  )
                }
              ]}
              labelStyle="top"
            />
          )}
          {changeDetails?.patches && !changeDetails?.diff && (
            <DescriptionCard
              className="mt-4"
              items={[
                {
                  label: "Change",
                  value: (
                    <div className="w-full max-h-96 overflow-y-auto overflow-x-auto border border-gray-200 rounded text-sm">
                      <JSONViewer
                        code={JSON.stringify(changeDetails?.patches, null, 2)}
                        format="yaml"
                        convertToYaml
                      />
                    </div>
                  )
                }
              ]}
              labelStyle="top"
            />
          )}
          {changeDetails?.diff && (
            <DescriptionCard
              className="mt-4"
              items={[
                {
                  label: "Change",
                  value: (
                    <div className="w-full max-h-96 overflow-y-auto overflow-x-auto border border-gray-200 rounded pr-2 text-sm">
                      <DiffRenderer diffText={changeDetails.diff} />
                    </div>
                  )
                }
              ]}
              labelStyle="top"
            />
          )}
        </div>
      )}
      {viewType === ViewType.summary && (
        <div
          className="overflow-hidden truncate text-sm"
          onClick={(e) => {
            setOpen(true);
          }}
        >
          {showConfigLogo && (
            <>
              <Icon
                name={config?.type}
                secondary={config?.config_class}
                className="w-5 mr-1"
              />
              <span>{config?.name}</span>
              &nbsp;/&nbsp;
            </>
          )}
          <Icon
            name={changeDetails?.change_type}
            secondary="diff"
            className="w-5 h-auto pr-1"
          />
          {changeDetails?.change_type}
        </div>
      )}
    </div>
  );
}

type ConfigDetailChangeModalProps = {
  open: boolean;
  setOpen: (val: boolean) => void;
  config?: ConfigItem;
  changeDetails?: Pick<
    ConfigTypeChanges,
    "change_type" | "id" | "config_id" | "config"
  >;
};

export function ConfigDetailChangeModal({
  open,
  setOpen,
  config,
  changeDetails
}: ConfigDetailChangeModalProps) {
  return (
    <Modal
      title={
        config && (
          <div className="flex flex-row gap-1">
            <ConfigLink
              className="text-blue-600 text-xl font-semibold whitespace-nowrap mr-1"
              configId={config.id}
              configName={config.name}
              configType={config.type}
              configTypeSecondary={config.config_class}
            />
            /
            <Icon
              name={changeDetails?.change_type}
              secondary="diff"
              className="w-5 h-auto pr-1"
            />
            {changeDetails?.change_type}
          </div>
        )
      }
      open={open}
      onClose={(e) => {
        // this is added to fix modal not being closed issue when we open a modal on top of another modal
        e?.stopPropagation();
        setOpen(false);
      }}
      size="full"
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
            viewType={ViewType.detailed}
          />
        )}
      </div>
      <div className="flex items-center justify-end py-4 px-5 rounded-lg bg-gray-100">
        <AttachAsEvidenceButton
          config_change_id={changeDetails?.id}
          config_id={changeDetails?.config_id}
          evidence={{}}
          type={EvidenceType.ConfigChange}
        />
      </div>
    </Modal>
  );
}
