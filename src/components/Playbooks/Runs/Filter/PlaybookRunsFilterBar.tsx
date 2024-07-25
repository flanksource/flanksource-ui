import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { TimeRangePicker } from "@flanksource-ui/ui/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { URLSearchParamsInit } from "react-router-dom";
import SubmitPlaybookRunForm from "../Submit/SubmitPlaybookRunForm";
import PlaybookSpecsDropdown from "./PlaybookSpecsDropdown";
import PlaybookStatusDropdown from "./PlaybookStatusDropdown";

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
    <div className="flex flex-row gap-2 w-full">
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
            className="w-[35rem]"
            value={range}
          />
        </div>
      </FormikFilterForm>
      {playbookId && (
        <>
          <div className="flex-1" />
          <AuthorizationAccessCheck
            resource={tables.connections}
            action="write"
          >
            <Button
              text="Edit Playbook"
              className="btn-white"
              icon={<FaEdit />}
              disabled={isLoading}
              onClick={() => setIsEditPlaybookFormOpen(true)}
            />
          </AuthorizationAccessCheck>
          {playbookSpec && (
            <>
              <Button
                disabled={isLoading}
                text="Run Playbook"
                onClick={() => setIsSubmitPlaybookRunFormOpen(true)}
              />
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
