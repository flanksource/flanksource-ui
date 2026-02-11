// ABOUTME: Action bar for bulk running health checks.
// ABOUTME: Shows Select All/None, Run Selected, and Cancel buttons during bulk mode.

import { runHealthCheckNow } from "@flanksource-ui/api/services/topology";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { VscDebugRerun } from "react-icons/vsc";
import { useBulkCheckRun } from "./BulkCheckRunContext";

type BulkCheckRunBarProps = {
  filteredChecks: HealthCheck[];
  onExit: () => void;
};

export default function BulkCheckRunBar({
  filteredChecks,
  onExit
}: BulkCheckRunBarProps) {
  const { selectedCheckIds, toggleChecks } = useBulkCheckRun();
  const [isRunning, setIsRunning] = useState(false);

  const allCheckIds = filteredChecks.map((c) => c.id);

  function handleSelectAll() {
    toggleChecks(allCheckIds, true);
  }

  function handleSelectNone() {
    toggleChecks(allCheckIds, false);
  }

  async function handleRunSelected() {
    const ids = Array.from(selectedCheckIds);
    if (ids.length === 0) {
      return;
    }

    setIsRunning(true);
    const results = await Promise.allSettled(
      ids.map((id) => runHealthCheckNow(id))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed === 0) {
      toastSuccess(`Successfully triggered ${succeeded} check(s)`);
    } else if (succeeded === 0) {
      toastError(`All ${failed} check(s) failed to trigger`);
    } else {
      toastSuccess(
        `Triggered ${succeeded} check(s), ${failed} failed to trigger`
      );
    }

    setIsRunning(false);
    onExit();
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-2">
      <span className="text-sm font-medium text-blue-800">
        {selectedCheckIds.size} selected
      </span>

      <Button className="btn-white" size="xs" onClick={handleSelectAll}>
        Select All
      </Button>

      <Button className="btn-white" size="xs" onClick={handleSelectNone}>
        Select None
      </Button>

      <div className="flex-1" />

      <Button className="btn-white" size="xs" onClick={onExit}>
        Cancel
      </Button>

      <Button
        className="btn-primary"
        size="xs"
        disabled={selectedCheckIds.size === 0 || isRunning}
        onClick={handleRunSelected}
        icon={
          isRunning ? <FaSpinner className="animate-spin" /> : <VscDebugRerun />
        }
        text={`Run Selected (${selectedCheckIds.size})`}
      />
    </div>
  );
}
