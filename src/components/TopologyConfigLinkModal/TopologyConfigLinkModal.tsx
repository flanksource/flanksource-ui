import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import { componentConfigRelationshipQueryKey } from "../../api/query-hooks/useComponentConfigRelationshipQuery";
import {
  addManualComponentConfigRelationship,
  getAllConfigsForSearchPurpose
} from "../../api/services/configs";
import { Topology } from "../../context/TopologyPageContext";
import { queryClient } from "../../query-client";
import { delayedPromise, stringSortHelper } from "../../utils/common";
import ConfigLink from "../ConfigLink/ConfigLink";
import { DropdownWithActions } from "../Dropdown/DropdownWithActions";
import { Modal } from "../Modal";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";
import { toastError, toastSuccess } from "../Toast/toast";

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
  const { data = [], isLoading } = useQuery(
    ["all", "configs", "topology", "search"],
    getAllConfigsForSearchPurpose
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState<ConfigOption>();
  const maxResultsShown = 10;
  const configs = useMemo(() => {
    return data
      ?.map((d) => ({
        id: d.id,
        value: d.name,
        description: d.name,
        name: d.name,
        icon: null,
        type: d.type,
        config_class: d.config_class
      }))
      .sort((v1, v2) => stringSortHelper(v1.name, v2.name));
  }, [data]);

  const onSearch = useCallback(
    async (query = "") => {
      console.log("query", query);
      const result = configs
        .filter(({ name }) => {
          return name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        })
        .sort((v1, v2) => stringSortHelper(v1.name, v2.name))
        .slice(0, maxResultsShown);
      return await delayedPromise<ConfigOption[]>(result, 1000);
    },
    [configs]
  );

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
          <div className="flex flex-col w-full">
            {isLoading ? (
              <TextSkeletonLoader className="w-full" />
            ) : (
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
            )}
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