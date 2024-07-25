import { useGetConfigChangesById } from "@flanksource-ui/api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { EvidenceType } from "@flanksource-ui/api/types/evidence";
import { User } from "@flanksource-ui/api/types/users";
import AttachAsEvidenceButton from "@flanksource-ui/components/Incidents/AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import { ViewType } from "@flanksource-ui/types";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { DiffRenderer } from "@flanksource-ui/ui/Code/DiffRenderer";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Loading } from "@flanksource-ui/ui/Loading";
import { Modal } from "@flanksource-ui/ui/Modal";
import ModalTitleListItems from "@flanksource-ui/ui/Modal/ModalTitleListItems";
import { Stat } from "@flanksource-ui/ui/stats/Stat";
import { useMemo, useState } from "react";
import ConfigLink from "../../ConfigLink/ConfigLink";
import ConfigChangeDetailSection from "./ConfigChangeDetailsSection";

type ConfigDetailsChangesProps = {
  id: string;
  configId: string;
  viewType?: ViewType;
  data?: ConfigChange;
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

  const { data: change, isLoading } = useGetConfigChangesById(id, configId!, {
    enabled: open
  });

  const config = useMemo(() => change?.config, [change]);

  // if the change is not loaded, show the data from the props, otherwise show
  // the data from the API which is more detailed
  const changeDetails = useMemo(() => change ?? data, [change, data]);

  let icon = changeDetails?.source;

  if (icon?.startsWith("AWS::CloudTrail")) {
    icon = "AWS::CloudTrail";
  } else if (icon?.startsWith("kubernetes/")) {
    icon = "Kubernetes";
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <ConfigDetailChangeModal
        // do not show modal if the config is not loaded
        isLoading={isLoading}
        open={open}
        setOpen={setOpen}
        changeDetails={changeDetails}
      />

      {viewType === ViewType.detailed && (
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-3">
          <div className="flex w-full flex-row gap-12">
            <Stat
              title="Date"
              sizeStyle="sm"
              value={<Age from={changeDetails?.created_at!} suffix={true} />}
            />

            <Stat
              title="Source"
              sizeStyle="sm"
              value={
                <>
                  <Icon
                    name={changeDetails?.source}
                    secondary={icon}
                    className="h-5 w-auto pr-1"
                  />
                  {changeDetails?.source}
                </>
              }
            />

            <Stat
              title="Created By"
              sizeStyle="sm"
              value={
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {!changeDetails?.created_by &&
                    !changeDetails?.external_created_by &&
                    changeDetails?.source}
                  {changeDetails?.created_by ? (
                    <Avatar
                      user={
                        (changeDetails.created_by! as unknown as User) ??
                        changeDetails.external_created_by
                      }
                    />
                  ) : (
                    <span>{changeDetails?.external_created_by}</span>
                  )}
                </>
              }
            />
          </div>
          {changeDetails?.details && (
            <ConfigChangeDetailSection label="Details">
              <JSONViewer
                code={JSON.stringify(changeDetails?.details, null, 2)}
                format="json"
                convertToYaml
              />
            </ConfigChangeDetailSection>
          )}
          {changeDetails?.patches && !changeDetails?.diff && (
            <ConfigChangeDetailSection label="Change">
              <JSONViewer
                code={JSON.stringify(changeDetails?.patches, null, 2)}
                format="json"
                convertToYaml
              />
            </ConfigChangeDetailSection>
          )}
          {changeDetails?.diff && (
            <ConfigChangeDetailSection label="Change">
              <DiffRenderer diffText={changeDetails!.diff!} />
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
              <ConfigIcon config={config} />
              <span>{config?.name}</span>
              &nbsp;/&nbsp;
            </>
          )}

          <ChangeIcon change={changeDetails} />
          {changeDetails?.change_type}
        </div>
      )}
    </div>
  );
}

type ConfigDetailChangeModalProps = {
  open: boolean;
  isLoading: boolean;
  setOpen: (val: boolean) => void;
  changeDetails?: ConfigChange;
};

export function ConfigDetailChangeModal({
  open,
  setOpen,
  isLoading,
  changeDetails
}: ConfigDetailChangeModalProps) {
  const config = useMemo(() => changeDetails?.config, [changeDetails]);
  return (
    <Modal
      title={
        config && (
          <ModalTitleListItems
            items={[
              <div
                key={"config-details"}
                className="flex flex-shrink flex-row items-center gap-1"
              >
                <ChangeIcon change={changeDetails} />
                <span> {changeDetails?.change_type}</span>
              </div>,
              <ConfigLink
                key={"config-link"}
                className="link overflow-hidden overflow-ellipsis whitespace-nowrap text-xl font-semibold"
                config={config}
              />
            ]}
          />
        )
      }
      open={open}
      onClose={(e) => {
        // this is added to fix modal not being closed issue when we open a modal on top of another modal
        e?.stopPropagation();
        setOpen(false);
      }}
    >
      <div className="">
        {(isLoading || !changeDetails) && (
          <div className="">
            <Loading type="modal" />
          </div>
        )}

        {!isLoading && changeDetails && changeDetails?.config_id && (
          <ConfigDetailsChanges
            configId={changeDetails.config_id}
            id={changeDetails.id}
            viewType={ViewType.detailed}
            data={changeDetails}
          />
        )}
      </div>
      <div className="flex items-center justify-end rounded-lg bg-gray-100 px-5 py-4">
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
