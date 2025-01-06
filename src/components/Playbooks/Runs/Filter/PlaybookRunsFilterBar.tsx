import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { TimeRangePicker } from "@flanksource-ui/ui/Dates/TimeRangePicker";
import useTimeRangeParams from "@flanksource-ui/ui/Dates/TimeRangePicker/useTimeRangeParams";
import { useEffect, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const range = getTimeRangeFromUrl();

  const configID = searchParams.get("config_id") ?? undefined;
  let playbookParameters: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    if (key.startsWith("params.")) {
      const k = key.replace("params.", "");
      playbookParameters[k] = val;
    }
  });

  useEffect(() => {
    const shouldOpenRunForm = searchParams.get("run") === "true";
    if (shouldOpenRunForm) {
      setIsSubmitPlaybookRunFormOpen(true);
    }
  }, [searchParams]);

  const handleCloseRunForm = () => {
    setIsSubmitPlaybookRunFormOpen(false);
    searchParams.delete("run");
    setSearchParams(searchParams);
  };

  const handleOpenRunForm = () => {
    searchParams.set("run", "true");
    setSearchParams(searchParams);
  };

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
                onClick={handleOpenRunForm}
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
                  configId={configID}
                  overrideParams={configID !== ""}
                  params={playbookParameters}
                  onClose={handleCloseRunForm}
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
