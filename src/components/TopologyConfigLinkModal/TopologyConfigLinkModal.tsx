import { useAllConfigsQuery } from "../../api/query-hooks";
import { Topology } from "../../context/TopologyPageContext";
import { Modal } from "../Modal";
import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "../Icon";
import {
  ConfigItem,
  addManuallyAddedComponentConfigRelationship,
  getConfigsBy,
  removeComponentConfigRelationship
} from "../../api/services/configs";
import { DropdownWithActions } from "../Dropdown/DropdownWithActions";
import { delayedPromise } from "../../utils/common";
import { Badge } from "../Badge";
import { toastError, toastSuccess } from "../Toast/toast";
import { BsTrash } from "react-icons/bs";
import { IconButton } from "../IconButton";
import clsx from "clsx";

type TopologyConfigLinkModalProps = {
  topology: Topology;
  openModal: boolean;
  onCloseModal: (val: boolean) => void;
} & React.HTMLProps<HTMLDivElement>;

type ConfigOption = {
  id: string;
  value: string;
  description: string;
  name: string;
  icon: React.ReactNode;
};

export function TopologyConfigLinkModal({
  topology,
  openModal,
  onCloseModal
}: TopologyConfigLinkModalProps) {
  const { data: response } = useAllConfigsQuery({}, {});
  const [value, setValue] = useState<ConfigOption>();
  const [linkedConfigs, setLinkedConfigs] = useState<ConfigItem[]>([]);
  const maxResultsShown = 10;
  const configs = useMemo(() => {
    const data = response?.data || [];
    return data?.map((d: ConfigItem) => ({
      id: d.id,
      value: d.config_type,
      description: d.config_type,
      name: d.config_type,
      icon: <Icon name={d.external_type} secondary={d.config_type} />
    }));
  }, [response]);

  const onSearch = async (query = "") => {
    const result = configs
      .filter((config) => {
        return config.name.toLowerCase().indexOf(query.toLowerCase()) > 0;
      })
      .slice(0, maxResultsShown);
    return await delayedPromise<ConfigOption[]>(result, 1000);
  };

  const fetchLinkedConfigs = async () => {
    try {
      const response = await getConfigsBy({
        topologyId: topology.id
      });
      if (response?.data) {
        return setLinkedConfigs(
          response.data?.map((item) => item.configs as ConfigItem) || []
        );
      }
      toastError(response?.error.message);
    } catch (ex) {
      toastError((ex as Error).message);
    }
  };

  useEffect(() => {
    if (!topology?.id) {
      return;
    }
    fetchLinkedConfigs();
  }, [topology]);

  const onSubmit = async () => {
    if (!topology.id || !value?.id) {
      return Promise.resolve();
    }
    try {
      const response = await addManuallyAddedComponentConfigRelationship(
        topology.id,
        value.id
      );
      if (response.data) {
        toastSuccess("config link successful");
        setValue(undefined);
        return fetchLinkedConfigs();
      }
      toastError(response.error?.message);
    } catch (ex) {
      toastError((ex as Error).message);
    }
  };

  const deleteLink = async (configId: string) => {
    try {
      const response = await removeComponentConfigRelationship(
        topology.id,
        configId
      );
      if (response.data) {
        toastSuccess("Deleted config link successfully");
        return fetchLinkedConfigs();
      }
      toastError(response.error?.message);
    } catch (ex) {
      toastError((ex as Error).message);
    }
  };

  return (
    <Modal
      onClose={() => {
        onCloseModal(false);
        setValue(undefined);
      }}
      title={`${topology.name} - config relationships`}
      open={openModal}
      size="slightly-small"
      containerClassName=""
    >
      <div className="flex flex-col my-2 divide-y divide-gray-200 space-y-4">
        <div
          className={clsx(
            "flex flex-row items-center space-x-2",
            linkedConfigs.length === 0 ? "mb-4" : ""
          )}
        >
          <div className="text-sm font-bold text-gray-700 inline-block">
            Config
          </div>
          <div className="w-64">
            <DropdownWithActions<ConfigOption>
              onQuery={(e) => {
                return onSearch(e);
              }}
              label=""
              name="config"
              value={value}
              setValue={(_: string, val: ConfigOption) => {
                setValue(val);
              }}
              creatable={false}
              displayOption={({ option }) => {
                return (
                  <div className="w-auto max-w-[400px]">
                    <Icon name={option.name} secondary={option.name} />
                    {option.name}
                  </div>
                );
              }}
            />
          </div>
          <button className="btn btn-primary" type="submit" onClick={onSubmit}>
            Link
          </button>
        </div>
        <div
          className={clsx(
            "flex flex-col",
            linkedConfigs.length === 0 ? "hidden" : ""
          )}
        >
          <div className="flex flex-row items-center my-2 space-x-2">
            <span className="text-sm font-bold text-gray-700 inline-block">
              Linked to configs
            </span>
            <Badge
              className="w-5 h-5 flex items-center justify-center"
              roundedClass="rounded-full"
              text={linkedConfigs.length}
            />
          </div>
          <div className="flex flex-col max-h-36 overflow-y-auto space-y-2">
            {linkedConfigs.map((linkedConfig) => {
              return (
                <div className="flex flex-row space-x-2 py-1 pr-16">
                  <Icon
                    key={linkedConfig.id}
                    name={linkedConfig.external_type}
                    secondary={linkedConfig.config_type}
                  />
                  <span title={linkedConfig.name} className="truncate">
                    {linkedConfig.name}
                  </span>
                  <IconButton
                    className="bg-transparent flex items-center"
                    ovalProps={{
                      stroke: "blue",
                      height: "18px",
                      width: "18px",
                      fill: "transparent"
                    }}
                    icon={<BsTrash />}
                    onClick={() => {
                      deleteLink(linkedConfig.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
