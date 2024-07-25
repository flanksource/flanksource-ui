import {
  TimeRange,
  timeRanges
} from "@flanksource-ui/components/Dropdown/TimeRange";
import { useHealthPageContext } from "@flanksource-ui/context/HealthPageContext";
import { XIcon } from "@heroicons/react/solid";
import { useSearchParams } from "react-router-dom";
import { HidePassingToggle } from "../CanaryFilters/HidePassingToggle";
import { LabelFilterList } from "../CanaryFilters/LabelFilterList";
import { CanaryStickySidebar } from "./CanaryStickySidebar";

function SectionTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mb-3 text-sm font-semibold uppercase text-blue-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

type CanarySidebarProps = {
  isMenuItemOpen: boolean;
  setIsMenuItemOpen: (isOpen: boolean) => void;
};

export default function CanarySidebar({
  isMenuItemOpen,
  setIsMenuItemOpen
}: CanarySidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const timeRange = searchParams.get("timeRange");

  const {
    healthState: { filteredLabels }
  } = useHealthPageContext();

  return (
    <CanaryStickySidebar
      isMenuItemOpen={isMenuItemOpen}
      setMenuItemOpen={setIsMenuItemOpen}
    >
      <div className="absolute right-1 top-5 z-[9999999] flex flex-col 2xl:hidden">
        <div className="flex items-center rounded-md p-1 2xl:hidden">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setIsMenuItemOpen(false)}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-6 w-6 fill-gray-400" aria-hidden="true" />
          </button>
        </div>
      </div>
      <SectionTitle className="hidden">Filter by Time Range</SectionTitle>
      <div className="mb-4 hidden w-full pr-4">
        <TimeRange
          name="time-range"
          value={timeRange || timeRanges[1].value}
          className="w-full"
          dropDownClassNames="w-full"
          onChange={(value) => {
            if (value) {
              searchParams.set("timeRange", value);
              setSearchParams(searchParams, {
                replace: true
              });
            }
          }}
        />
      </div>
      <div className="flex flex-col">
        <SectionTitle>Filter by Health</SectionTitle>
        <div className="flex items-center pr-5">
          <div className="flex items-center">
            <HidePassingToggle />
          </div>
          <div className="mb-0 text-sm text-gray-800">Hide Passing</div>
        </div>
      </div>
      <div className="flex flex-col">
        <SectionTitle className="mb-5 flex items-center justify-between">
          Filter by Label
        </SectionTitle>
        <div className="flex w-full flex-col pr-5">
          <LabelFilterList labels={filteredLabels} />
        </div>
      </div>
    </CanaryStickySidebar>
  );
}
