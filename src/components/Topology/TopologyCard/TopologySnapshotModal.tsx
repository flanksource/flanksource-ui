import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaDownload } from "react-icons/fa";
import { Oval } from "react-loading-icons";
import { Topology } from "../../../api/types/topology";
import { Events, sendAnalyticEvent } from "../../../services/analytics";
import { Toggle } from "../../../ui/FormControls/Toggle";
import { Modal } from "../../../ui/Modal";
import { TimeRange, timeRanges } from "../../Dropdown/TimeRange";
import { toastError } from "../../Toast/toast";
import { useDownloadTopologySnapshot } from "./useDownloadTopologySnapshot";

type Props = {
  onCloseModal: () => void;
  topology: Topology;
  isModalOpen: boolean;
};

type TopologySnapshotFormData = {
  timeRange: string;
  relatedComponents: boolean;
};

export default function TopologySnapshotModal({
  onCloseModal,
  topology,
  isModalOpen
}: Props) {
  const { control, handleSubmit } = useForm<TopologySnapshotFormData>({
    mode: "onBlur",
    defaultValues: {
      timeRange: timeRanges[0].value,
      relatedComponents: false
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const preDownloading = () => setIsLoading(true);
  const postDownloading = () => setIsLoading(false);

  const onErrorDownloadFile = () => {
    setIsLoading(false);
    toastError("Error downloading file");
  };

  const getFileName = () => {
    return `${topology.name}-snapshot.zip`;
  };

  const { ref, url, download, name } = useDownloadTopologySnapshot({
    topologyId: topology.id,
    preDownloading,
    postDownloading,
    onError: onErrorDownloadFile,
    getFileName
  });

  const onSubmit = async (data: TopologySnapshotFormData) => {
    try {
      await download(data.timeRange, data.relatedComponents);
      sendAnalyticEvent(Events.DownloadedSnapshot);
    } catch (error) {
      toastError("Error downloading file");
    }
  };

  return (
    <Modal
      onClose={onCloseModal}
      title={`Download ${topology.name} snapshot`}
      open={isModalOpen}
      size="very-small"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col py-4 space-y-4">
          <Controller
            control={control}
            name="timeRange"
            render={({ field: { value, onChange } }) => (
              <TimeRange
                name="name"
                label="Time Range"
                value={value}
                onChange={onChange}
                className="w-full"
                containerClassName="w-full flex flex-col text-left"
                dropDownClassNames="w-full"
                isLoading={isLoading}
              />
            )}
          />
          <div className="w-full py-2 text-left">
            <Controller
              control={control}
              name="relatedComponents"
              render={({ field: { value, onChange } }) => (
                <Toggle
                  onChange={onChange}
                  value={value}
                  label="Include related components"
                />
              )}
            />
          </div>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
          <a href={url} download={name} className="hidden" ref={ref} />
          <div className="flex justify-end w-full py-2">
            <button className="btn btn-primary" type="submit">
              {isLoading ? (
                <>
                  <Oval stroke="white" height="1.5em" />
                  <span className="ml-2">Downloading...</span>
                </>
              ) : (
                <>
                  <FaDownload />
                  <span className="ml-2">Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
