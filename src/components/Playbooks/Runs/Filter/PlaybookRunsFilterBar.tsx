import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/ui/Button";
import { TimeRangePicker } from "@flanksource-ui/ui/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import SubmitPlaybookRunForm from "../Submit/SubmitPlaybookRunForm";
import PlaybookSpecsDropdown from "./PlaybookSpecsDropdown";
import PlaybookStatusDropdown from "./PlaybookStatusDropdown";

type PlaybookRunsFilterBarProps = {
  playbookId?: string;
  isLoading?: boolean;
  setIsEditPlaybookFormOpen: (isOpen: boolean) => void;
  playbook?: PlaybookSpec;
};

export default function PlaybookRunsFilterBar({
  playbookId,
  isLoading,
  setIsEditPlaybookFormOpen = () => {},
  playbook: playbookSpec
}: PlaybookRunsFilterBarProps) {
  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams();
  const [isSubmitPlaybookRunFormOpen, setIsSubmitPlaybookRunFormOpen] =
    useState(false);

  const range = getTimeRangeFromUrl();

  return (
    <div className="flex flex-row gap-2 w-full">
      <PlaybookSpecsDropdown />
      <PlaybookStatusDropdown />
      <TimeRangePicker
        onChange={(timeRange) => {
          console.log("timeRange", timeRange);
          setTimeRangeParams(timeRange);
        }}
        className="w-[35rem]"
        value={range}
      />
      {playbookId && (
        <>
          <div className="flex-1" />
          <Button
            text="Edit Playbook"
            className="btn-white"
            icon={<FaEdit />}
            disabled={isLoading}
            onClick={() => setIsEditPlaybookFormOpen(true)}
          />
          {playbookSpec && (
            <>
              <Button
                disabled={isLoading}
                text="Run Playbook"
                onClick={() => setIsSubmitPlaybookRunFormOpen(true)}
              />
              <SubmitPlaybookRunForm
                isOpen={isSubmitPlaybookRunFormOpen}
                onClose={() => setIsSubmitPlaybookRunFormOpen(false)}
                playbook={playbookSpec}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
