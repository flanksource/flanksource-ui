import { useCallback } from "react";
import toast from "react-hot-toast";
import { MdOutlineFileDownload } from "react-icons/md";
import stripAnsi from "strip-ansi";

function downloadFile(content: string, filename: string, contentType: string) {
  const a = document.createElement("a");
  const strippedContent = stripAnsi(content);
  const file = new Blob([strippedContent], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = filename.toLowerCase();
  a.click();
}

type Props = {
  activeTab: string;
  activeTabContentRef: React.RefObject<HTMLDivElement>;
  contentType?:
    | "text/markdown"
    | "text/x-shellscript"
    | "text/plain"
    | "application/yaml"
    | "application/log+json"
    | "application/json";
};

export default function TabContentDownloadButton({
  activeTab,
  activeTabContentRef,
  contentType = "text/plain"
}: Props) {
  // Artifacts already have a filename with the extension
  // Other tabs don't.
  const fileName = activeTab.includes(".")
    ? activeTab
    : `${activeTab}.${getContentTypeExtension(contentType)}`;

  const onDownloadLogs = useCallback(async () => {
    const tabContent = activeTabContentRef.current;
    if (!tabContent) {
      toast.error("No content available to download");
      return;
    }

    const content = tabContent.innerText;
    downloadFile(content, fileName, contentType);
  }, [fileName, activeTabContentRef, contentType]);

  return (
    <button
      className="absolute right-5 top-1 z-[9] flex items-center text-lg"
      onClick={onDownloadLogs}
    >
      <MdOutlineFileDownload className="h-5 w-5" />
      <span className="pl-1 text-sm">Download </span>
    </button>
  );
}

function getContentTypeExtension(contentType: string) {
  switch (contentType) {
    case "text/markdown":
      return "md";
    case "text/x-shellscript":
      return "sh";
    case "text/plain":
      return "txt";
    case "application/yaml":
      return "yaml";
    case "application/log+json":
      return "log.json";
    case "application/json":
      return "json";
    default:
      return "txt";
  }
}
