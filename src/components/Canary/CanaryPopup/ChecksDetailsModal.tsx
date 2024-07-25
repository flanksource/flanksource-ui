import { useGetCheckDetails } from "@flanksource-ui/api/query-hooks/health";
import { EvidenceType } from "@flanksource-ui/api/types/evidence";
import { isCanaryUI } from "@flanksource-ui/context/Environment";
import { Loading } from "@flanksource-ui/ui/Loading";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useAtom } from "jotai";
import { useSearchParams } from "react-router-dom";
import { timeRanges } from "../../Dropdown/TimeRange";
import AttachAsEvidenceButton from "../../Incidents/AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import PlaybooksDropdownMenu from "../../Playbooks/Runs/Submit/PlaybooksDropdownMenu";
import { refreshCheckModalAtomTrigger } from "../ChecksListing";
import { HealthCheckEdit } from "../HealthCheckEdit";
import { CheckDetails } from "./CheckDetails";
import CheckRunNow from "./CheckRunNow";
import { CheckTitle } from "./CheckTitle";

type ChecksDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  checkId: string | undefined;
};

export function ChecksDetailsModal({
  isOpen,
  onClose: clearCheck,
  checkId
}: ChecksDetailsModalProps) {
  const [searchParams] = useSearchParams();
  const [, refreshCheckModal] = useAtom(refreshCheckModalAtomTrigger);
  const { data: check, refetch } = useGetCheckDetails(checkId as string);
  const timeRange = searchParams.get("timeRange") ?? timeRanges[1].value;

  return (
    <Modal
      open={isOpen || !!check}
      onClose={() => clearCheck()}
      title={<CheckTitle check={check} size="" />}
      size="full"
      containerClassName="flex flex-col h-full overflow-y-auto"
      bodyClass="flex flex-col flex-1 overflow-y-auto"
    >
      <div className="mb-16 flex flex-1 flex-col overflow-y-auto px-4 py-4">
        {!check && <Loading className="my-auto" type="modal" />}
        {check && (
          <>
            <CheckDetails
              check={check}
              timeRange={timeRange}
              className={`flex flex-1 flex-col overflow-y-auto`}
            />
            <div className="absolute bottom-0 left-0 flex w-full justify-end gap-2 rounded-t-none bg-gray-100 px-8 py-4">
              {check?.canary_id && <HealthCheckEdit check={check} />}
              <CheckRunNow
                onSuccessfulRun={() => {
                  refreshCheckModal((prev) => prev + 1);
                  refetch();
                }}
                check={check}
              />
              {!isCanaryUI && (
                <>
                  <div className="flex flex-col items-center">
                    <PlaybooksDropdownMenu
                      className="btn-primary"
                      check_id={checkId as string}
                    />
                  </div>
                  <div className="flex flex-col items-center py-1">
                    <AttachAsEvidenceButton
                      check_id={checkId as string}
                      evidence={{
                        check_id: checkId as string,
                        includeMessages: true,
                        start: timeRange
                      }}
                      type={EvidenceType.Check}
                      className="btn-primary"
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
