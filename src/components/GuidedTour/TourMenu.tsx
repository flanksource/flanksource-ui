// ABOUTME: The tour section picker shown when the user starts the interactive tour.
// ABOUTME: Lets them take the full tour or jump to a single feature's walkthrough.
import { type ReactNode } from "react";
import { useAtom } from "jotai";
import { AiFillHeart } from "react-icons/ai";
import { VscJson } from "react-icons/vsc";
import { Modal } from "../../ui/Modal";
import { Icon } from "../../ui/Icons/Icon";
import { type TourSection } from "./guidedTourSteps";
import {
  tourMenuOpenAtom,
  useCanRunPlaybooks,
  useStartTourSection
} from "./guidedTourState";

const iconClass = "h-5 w-5 shrink-0 text-gray-600";

// Each option shows the matching sidebar icon; the full tour uses the
// Mission Control logo.
const options: { label: string; section: TourSection; icon: ReactNode }[] = [
  {
    label: "Take a complete tour",
    section: "full",
    icon: <Icon name="mission-control" className={iconClass} />
  },
  {
    label: "Tell me about health checks",
    section: "health",
    icon: <AiFillHeart className={iconClass} />
  },
  {
    label: "Tell me about the catalog",
    section: "catalog",
    icon: <VscJson className={iconClass} />
  },
  {
    label: "Tell me about playbooks",
    section: "playbooks",
    icon: <Icon name="playbook" className={iconClass} />
  },
  {
    label: "Tell me about views",
    section: "views",
    icon: <Icon name="workflow" className={iconClass} />
  }
];

export function TourMenu() {
  const [open, setOpen] = useAtom(tourMenuOpenAtom);
  const startSection = useStartTourSection();
  const canRunPlaybooks = useCanRunPlaybooks();

  // Hide the playbooks walkthrough when the user can't run playbooks.
  const visibleOptions = options.filter(
    ({ section }) => section !== "playbooks" || canRunPlaybooks
  );

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Take a tour"
      size="medium"
      showExpand={false}
    >
      <div className="mx-auto flex w-full max-w-md flex-col gap-2 p-4">
        {visibleOptions.map(({ label, section, icon }) => (
          <button
            key={section}
            type="button"
            onClick={() => startSection(section)}
            className="flex items-center gap-3 rounded-md border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </Modal>
  );
}
