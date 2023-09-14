import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import ReactTooltip from "react-tooltip";
import { useGetConfigChangesByConfigChangeIdQuery } from "../../api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { EvidenceType } from "../../api/services/evidence";
import { User } from "../../api/services/users";
import { ViewType } from "../../types";
import { formatISODate } from "../../utils/date";
import AttachAsEvidenceButton from "../AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import { Avatar } from "../Avatar";
import { ConfigTypeChanges } from "../ConfigChanges";
import ConfigLink from "../ConfigLink/ConfigLink";
import { DiffRenderer } from "../DiffRenderer/DiffRenderer";
import EmptyState from "../EmptyState";
import { Icon } from "../Icon";
import { JSONViewer } from "../JSONViewer";
import { Modal } from "../Modal";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";
import ConfigChangeDetailSection from "./ConfigChangeDetailsSection";

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
  const [open, setOpen] = useState(false);

  const { data: change, isLoading } = useGetConfigChangesByConfigChangeIdQuery(
    id,
    configId!,
    {
      enabled: open
    }
  );

  const config = useMemo(() => change?.config, [change]);

  // if the change is not loaded, show the data from the props, otherwise show
  // the data from the API which is more detailed
  const changeDetails = useMemo(() => change ?? data, [change, data]);

  const properties = useMemo(() => {
    if (!changeDetails) {
      return [];
    }
    return [
      {
        label: "Date",
        value: formatISODate(changeDetails.created_at!)
      },
      {
        label: "Created By",
        value: (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {changeDetails.created_by ? (
              <Avatar
                user={
                  (changeDetails.created_by! as unknown as User) ??
                  changeDetails.external_created_by
                }
              />
            ) : (
              <span>{changeDetails.external_created_by}</span>
            )}
          </>
        )
      },
      {
        label: "Source",
        value: changeDetails.source || ""
      }
    ];
  }, [changeDetails]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (!changeDetails && !isLoading) {
    return <EmptyState />;
  }

  if (!changeDetails && isLoading) {
    return (
      <div className="flex flex-col w-full p-4 gap-2">
        <TextSkeletonLoader className="w-full" />
        <TextSkeletonLoader className="w-full" />
        <TextSkeletonLoader className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-white cursor-pointer">
      <ConfigDetailChangeModal
        // do not show modal if the config is not loaded
        open={open && !isLoading}
        setOpen={setOpen}
        changeDetails={changeDetails}
      />
      {viewType === ViewType.detailed && (
        <div className="flex flex-col flex-1 px-4 py-5 overflow-y-auto">
          <div className="flex flex-row w-full gap-4">
            {properties.map((p) => (
              <div
                className={clsx(
                  "flex flex-col w-auto py-4 text-left gap-2",
                  p.label === "Source" ? "flex-1" : ""
                )}
              >
                <div className="text-sm overflow-hidden truncate text-gray-500">
                  {p.label}
                </div>
                <div className="flex justify-start break-all text-sm">
                  {p.value}
                </div>
              </div>
            ))}
          </div>
          {changeDetails?.details && (
            <ConfigChangeDetailSection label="Details">
              <JSONViewer
                code={JSON.stringify(changeDetails?.details, null, 2)}
                format="yaml"
                convertToYaml
              />
            </ConfigChangeDetailSection>
          )}
          {changeDetails?.patches && !changeDetails?.diff && (
            <ConfigChangeDetailSection label="Change">
              <JSONViewer
                code={JSON.stringify(changeDetails?.patches, null, 2)}
                format="yaml"
                convertToYaml
              />
            </ConfigChangeDetailSection>
          )}
          {changeDetails?.diff && (
            <ConfigChangeDetailSection label="Change">
              <DiffRenderer diffText={changeDetails.diff} />
            </ConfigChangeDetailSection>
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
  changeDetails?: ConfigTypeChanges;
};

export function ConfigDetailChangeModal({
  open,
  setOpen,
  changeDetails
}: ConfigDetailChangeModalProps) {
  const config = useMemo(() => changeDetails?.config, [changeDetails]);

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
      bodyClass="flex h-full flex-col flex-1 overflow-y-auto"
      containerClassName="min-h-[15rem] h-auto max-h-full overflow-y-auto"
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {changeDetails?.config_id && (
          <ConfigDetailsChanges
            configId={changeDetails.config_id}
            id={changeDetails.id}
            viewType={ViewType.detailed}
            data={changeDetails}
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
