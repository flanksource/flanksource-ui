import {
  PlaybookRunAction,
  PlaybookSpec
} from "@flanksource-ui/api/types/playbooks";
import { Float } from "@headlessui-float/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FaCog } from "react-icons/fa";
import { ImSpinner } from "react-icons/im";
import { MdOutlineFileDownload } from "react-icons/md";
import stripAnsi from "strip-ansi";

function downloadFile(content: string, filename: string, contentType: string) {
  const a = document.createElement("a");
  const strippedContent = stripAnsi(content);
  const file = new Blob([strippedContent], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
  toast.success("Downloaded logs");
}

type Props = {
  action: Pick<
    PlaybookRunAction,
    "result" | "id" | "playbook_run_id" | "error" | "start_time"
  >;
  playbook?: Pick<PlaybookSpec, "name">;
};

export default function PlaybookResultsDropdownButton({
  action,
  playbook
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const fileName = `${playbook?.name}-${action.start_time}`;

  const onDownloadLogs = useCallback(() => {
    setIsDownloading(true);
    if (action.error) {
      downloadFile(action.error, `${fileName}.log`, "text/plain");
      setIsDownloading(false);
      return;
    }

    if (action.result?.stdout || action.result?.stdout || action.result?.logs) {
      let results = "";
      if (action.result?.stdout) {
        results = action.result.stdout + "\n";
      }
      if (action.result?.stderr) {
        results += action.result.stderr + "\n";
      }
      if (action.result?.logs) {
        results += action.result.logs + "\n";
      }

      downloadFile(results, `${fileName}.log`, "text/plain");
      setIsDownloading(false);
      return;
    }

    try {
      const logs = JSON.stringify(action.result, null, 2);
      downloadFile(logs, `${fileName}.json`, "text/json");
    } catch (e) {
      toast.error("Failed to download logs");
    }

    setIsDownloading(false);
    return;
  }, [action.error, action.result, fileName]);

  return (
    <Menu as="div">
      <Float placement="bottom-end" portal>
        <Menu.Button className="absolute right-5 top-5 z-[99999] text-lg">
          <FaCog className="h-4 w-4" />
        </Menu.Button>

        {/* @ts-ignore */}
        <Transition
          as={Fragment as any}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="menu-items">
            <Menu.Item
              as="button"
              className="menu-item"
              onClick={onDownloadLogs}
            >
              {isDownloading ? (
                <ImSpinner className="inline animate-spin" size={16} />
              ) : (
                <MdOutlineFileDownload className="inline" size={16} />
              )}
              <span>Download logs</span>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Float>
    </Menu>
  );
}
