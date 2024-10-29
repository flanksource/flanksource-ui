import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { TimeRangePicker } from "@flanksource-ui/ui/Dates/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/Dates/TimeRangePicker/useTimeRangeParams";
import { useState } from "react";
import { URLSearchParamsInit } from "react-router-dom";
import SubmitPlaybookRunForm from "../Submit/SubmitPlaybookRunForm";
import PlaybookSpecsDropdown from "./PlaybookSpecsDropdown";
import PlaybookStatusDropdown from "./PlaybookStatusDropdown";
import { VscEdit, VscPlay } from "react-icons/vsc";

export const playbookRunsDefaultDateFilter: URLSearchParamsInit = {
  rangeType: "relative",
  display: "7 days",
  range: "now-7d"
};

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
  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams(
    playbookRunsDefaultDateFilter
  );
  const [isSubmitPlaybookRunFormOpen, setIsSubmitPlaybookRunFormOpen] =
    useState(false);

  const range = getTimeRangeFromUrl();

  return (
    <div className="flex w-full flex-row gap-2">
      <FormikFilterForm
        filterFields={["playbook", "status"]}
        paramsToReset={[]}
      >
        <div className="flex flex-row gap-2">
          <PlaybookSpecsDropdown />
          <PlaybookStatusDropdown />
          <TimeRangePicker
            onChange={(timeRange) => {
              setTimeRangeParams(timeRange);
            }}
            value={range}
          />
        </div>
      </FormikFilterForm>
      {playbookId && (
        <>
          <div className="flex-1" />
          <AuthorizationAccessCheck
            resource={tables.playbooks}
            action="write"
            key="edit-playbook"
          >
            <Button
              text="Edit"
              className="btn-white min-w-max"
              icon={<VscEdit />}
              disabled={isLoading}
              onClick={() => setIsEditPlaybookFormOpen(true)}
            />
          </AuthorizationAccessCheck>

          {playbookSpec && (
            <>
              <Button
                disabled={isLoading}
                onClick={() => setIsSubmitPlaybookRunFormOpen(true)}
                className="btn-primary min-w-max"
              >
                <VscPlay />
                Run
              </Button>
              <AuthorizationAccessCheck
                resource={tables.playbooks}
                action="write"
              >
                <SubmitPlaybookRunForm
                  isOpen={isSubmitPlaybookRunFormOpen}
                  onClose={() => setIsSubmitPlaybookRunFormOpen(false)}
                  playbook={playbookSpec}
                />
              </AuthorizationAccessCheck>
            </>
          )}
        </>
      )}
    </div>
  );
}
