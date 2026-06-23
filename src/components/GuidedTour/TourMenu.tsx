// ABOUTME: The tour section picker shown when the user starts the interactive tour.
// ABOUTME: Lets them take the full tour or jump to a single feature's walkthrough.
import { useAtom } from "jotai";
import { Modal } from "../../ui/Modal";
import { type TourSection } from "./guidedTourSteps";
import {
  tourMenuOpenAtom,
  useCanRunPlaybooks,
  useStartTourSection
} from "./guidedTourState";

const options: { label: string; section: TourSection }[] = [
  { label: "Take a complete tour", section: "full" },
  { label: "Tell me about health checks", section: "health" },
  { label: "Tell me about the catalog", section: "catalog" },
  { label: "Tell me about playbooks", section: "playbooks" },
  { label: "Tell me about views", section: "views" }
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
      size="small"
    >
      <div className="flex flex-col gap-2 p-4">
        {visibleOptions.map(({ label, section }) => (
          <button
            key={section}
            type="button"
            onClick={() => startSection(section)}
            className="rounded-md border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
          >
            {label}
          </button>
        ))}
      </div>
    </Modal>
  );
}
