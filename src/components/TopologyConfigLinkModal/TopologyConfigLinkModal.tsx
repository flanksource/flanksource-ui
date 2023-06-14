import { useAllConfigsQuery } from "../../api/query-hooks";
import { Topology } from "../../context/TopologyPageContext";
import { Modal } from "../Modal";
import React, { useMemo, useState } from "react";
import {
  ConfigItem,
  addManualComponentConfigRelationship
} from "../../api/services/configs";
import { DropdownWithActions } from "../Dropdown/DropdownWithActions";
import { delayedPromise, stringSortHelper } from "../../utils/common";
import { toastError, toastSuccess } from "../Toast/toast";
import clsx from "clsx";
import { queryClient } from "../../query-client";
import { componentConfigRelationshipQueryKey } from "../../api/query-hooks/useComponentConfigRelationshipQuery";
import ConfigLink from "../ConfigLink/ConfigLink";

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
  config_class?: string;
  type?: string;
};

export function TopologyConfigLinkModal({
  topology,
  openModal,
  onCloseModal
}: TopologyConfigLinkModalProps) {
  const { data: response } = useAllConfigsQuery({}, {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState<ConfigOption>();
  const maxResultsShown = 10;
  const configs = useMemo(() => {
    const data = response?.data || [];
    return data
      ?.map((d: ConfigItem) => ({
        id: d.id,
        value: d.name,
        description: d.name,
        name: d.name,
        icon: null,
        type: d.type,
        config_class: d.config_class
      }))
      .sort((v1, v2) => stringSortHelper(v1.name, v2.name));
  }, [response]);

  const onSearch = async (query = "") => {
    const result = configs
      .filter((config) => {
        return config.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
      })
      .sort((v1, v2) => stringSortHelper(v1.name, v2.name))
      .slice(0, maxResultsShown);
    return await delayedPromise<ConfigOption[]>(result, 1000);
  };

  const onSubmit = async () => {
    if (!topology.id || !value?.id || isSubmitting) {
      if (!value?.id) {
        toastError("Please select a config to link");
      }
      return Promise.resolve();
    }
    setIsSubmitting(true);
    onCloseModal(false);
    try {
      const response = await addManualComponentConfigRelationship(
        topology.id,
        value.id
      );
      if (response.data) {
        toastSuccess("config link successful");
        setValue(undefined);
        queryClient.invalidateQueries(
          componentConfigRelationshipQueryKey({ topologyId: topology.id })
        );
        setIsSubmitting(false);
        return;
      }
      toastError(response.error?.message);
    } catch (ex) {
      toastError((ex as Error).message);
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      onClose={() => {
        onCloseModal(false);
        setValue(undefined);
      }}
      title={`Link to config`}
      open={openModal}
      size="slightly-small"
      containerClassName=""
      bodyClass=""
    >
      <div className="flex flex-col divide-y divide-gray-200 space-y-4">
        <div className={clsx("flex flex-col px-4 py-4")}>
          <div className="text-sm font-bold text-gray-700 inline-block">
            Config
          </div>
          <div className="w-full">
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
                  <div className="w-auto cursor-pointer">
                    <div className="flex flex-row truncate">
                      <ConfigLink
                        configId={option.id}
                        configName={option.name}
                        configType={option.type}
                        configTypeSecondary={option.config_class}
                        variant="label"
                      />
                    </div>
                  </div>
                );
              }}
              disabled={!Boolean(configs.length)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end p-2 rounded bg-gray-100">
          <button type="submit" onClick={onSubmit} className="btn-primary">
            {isSubmitting ? "Linking.." : "Link"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
