import { useRef, useState } from "react";
import { getTopologySnapshot } from "../../../api/services/topology";

type DownloadFileProps = {
  topologyId: string;
  readonly preDownloading: () => void;
  readonly postDownloading: () => void;
  readonly onError: () => void;
  readonly getFileName: () => string;
};

type DownloadedFileInfo = {
  readonly download: (start: string, related: boolean) => Promise<void>;
  readonly ref: React.MutableRefObject<HTMLAnchorElement | null>;
  readonly name: string | undefined;
  readonly url: string | undefined;
};

export function useDownloadTopologySnapshot({
  topologyId,
  preDownloading,
  postDownloading,
  onError,
  getFileName
}: DownloadFileProps): DownloadedFileInfo {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [url, setFileUrl] = useState<string>();
  const [name, setFileName] = useState<string>();

  const download = async (start: string, related: boolean) => {
    try {
      preDownloading();
      const data = await getTopologySnapshot(topologyId, {
        related,
        start
      });
      const url = URL.createObjectURL(new Blob([data]));
      setFileUrl(url);
      setFileName(getFileName());
      ref.current?.click();
      postDownloading();
      URL.revokeObjectURL(url);
    } catch (error) {
      onError();
    }
  };

  return { download, ref, url, name };
}
