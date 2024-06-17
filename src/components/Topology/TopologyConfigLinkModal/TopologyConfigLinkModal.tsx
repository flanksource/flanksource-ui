import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useAtom } from "jotai";
import React, { useCallback, useMemo, useState } from "react";
import { componentConfigRelationshipQueryKey } from "../../../api/query-hooks/useComponentConfigRelationshipQuery";
import {
  addManualComponentConfigRelationship,
  getAllConfigsForSearchPurpose
} from "../../../api/services/configs";
import { ConfigItem } from "../../../api/types/configs";
import { Topology } from "../../../api/types/topology";
import { queryClient } from "../../../query-client";
import { Events, sendAnalyticEvent } from "../../../services/analytics";
import { Modal } from "../../../ui/Modal";
import TextSkeletonLoader from "../../../ui/SkeletonLoader/TextSkeletonLoader";
import { refreshButtonClickedTrigger } from "../../../ui/SlidingSideBar/SlidingSideBar";
import { delayedPromise, stringSortHelper } from "../../../utils/common";
import ConfigLink from "../../Configs/ConfigLink/ConfigLink";
import { DropdownWithActions } from "../../Dropdown/DropdownWithActions";
import { toastError, toastSuccess } from "../../Toast/toast";

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
  const [value, setValue] = useState<ConfigOption>();
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

  const [, setTriggerRefresh] = useAtom(refreshButtonClickedTrigger);

  const onSearch = useCallback(
    async (query = "") => {
      const result = configs
        .filter(({ name }) => {
          return name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        })
        .sort((v1, v2) => stringSortHelper(v1.name, v2.name))
        // show only 50 results
        .slice(0, 50);
      return await delayedPromise<ConfigOption[]>(result, 1000);
    },
    [configs]
  );

  const { mutate: linkConfig, isLoading: isSubmitting } = useMutation({
    mutationFn: ({
      topologyId,
      configId
    }: {
      topologyId: string;
      configId: string;
    }) => {
      return addManualComponentConfigRelationship(topologyId, configId);
    },
    onSuccess: () => {
      setTriggerRefresh((v) => v + 1);
      toastSuccess("config link successful");
      sendAnalyticEvent(Events.LinkedComponentToConfig);
      setValue(undefined);
      queryClient.invalidateQueries(
        componentConfigRelationshipQueryKey({ topologyId: topology.id })
      );
    },
    onError: (err: any) => {
      toastError(err?.message);
    },
    onSettled: () => {
      onCloseModal(false);
    }
  });

  return (
    <Modal
      onClose={() => {
        onCloseModal(false);
        setValue(undefined);
      }}
      title={`Link to Catalog`}
      open={openModal}
      containerClassName=""
      bodyClass=""
    >
      <div className="flex flex-col divide-y divide-gray-200 space-y-4">
        <div className={clsx("flex flex-col px-4 py-4")}>
          <div className="text-sm font-bold text-gray-700 inline-block">
            Catalog
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
                          config={
                            {
                              id: option.id,
                              name: option.name,
                              type: option.type,
                              config_class: option.config_class
                            } as ConfigItem
                          }
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
          <button
            type="submit"
            disabled={!value || isSubmitting}
            onClick={() => {
              if (value) {
                linkConfig({
                  topologyId: topology.id,
                  configId: value.id
                });
              }
            }}
            className="btn-primary"
          >
            {isSubmitting ? "Linking.." : "Link"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
