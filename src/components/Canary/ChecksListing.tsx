import { atom, useAtom } from "jotai";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCheckDetails } from "../../api/query-hooks/health";
import { EvidenceType } from "../../api/types/evidence";
import { HealthCheck } from "../../api/types/health";
import { isCanaryUI } from "../../context/Environment";
import { Loading } from "../../ui/Loading";
import { Modal } from "../../ui/Modal";
import { timeRanges } from "../Dropdown/TimeRange";
import AttachAsEvidenceButton from "../Incidents/AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import PlaybooksDropdownMenu from "../Playbooks/Runs/Submit/PlaybooksDropdownMenu";
import { CanaryCards } from "./CanaryCards";
import { CheckDetails } from "./CanaryPopup/CheckDetails";
import CheckRunNow from "./CanaryPopup/CheckRunNow";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { CanaryTable } from "./CanaryTable";
import { HealthCheckEdit } from "./HealthCheckEdit";
import { useHealthUserSettings } from "./useHealthUserSettings";

export const refreshCheckModalAtomTrigger = atom(0);

type ChecksListingProps = {
  checks?: HealthCheck[];
  labels?: any[];
  selectedTab?: string;
  tableHeadStyle?: any;
};

export function ChecksListing({
  checks,
  labels,
  selectedTab,
  tableHeadStyle = {}
}: ChecksListingProps) {
  const [, refreshCheckModal] = useAtom(refreshCheckModalAtomTrigger);
  const [searchParams, setSearchParams] = useSearchParams({
    layout: "table"
  });

  const { tabBy } = useHealthUserSettings();

  const layout = searchParams.get("layout");
  const timeRange = searchParams.get("timeRange") ?? timeRanges[1].value;
  const checkId = searchParams.get("checkId") ?? undefined;

  const { data: check, refetch } = useGetCheckDetails(checkId as string);
  const [isOpen, setOpen] = useState(false);

  const handleCheckSelect = useCallback(
    (check: Pick<HealthCheck, "id">) => {
      setOpen(true);
      searchParams.set("checkId", check.id);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  function clearCheck() {
    setOpen(false);
    searchParams.delete("checkId");
    searchParams.set("timeRange", "1h");
    setSearchParams(searchParams);
  }

  let showNamespaceTags = tabBy !== "namespace" || selectedTab === "all";
  return (
    <>
      {layout === "card" ? (
        <CanaryCards checks={checks!} onClick={handleCheckSelect} />
      ) : (
        <CanaryTable
          checks={checks}
          labels={labels}
          onCheckClick={handleCheckSelect}
          showNamespaceTags={showNamespaceTags}
          hideNamespacePrefix
          groupSingleItems={false}
          theadStyle={tableHeadStyle}
          style={{
            maxHeight: `calc(100vh - ${isCanaryUI ? "10rem" : "14rem"})`
          }}
        />
      )}
      <Modal
        open={isOpen || !!check}
        onClose={() => clearCheck()}
        title={<CheckTitle check={check} size="" />}
        size="full"
        containerClassName="flex flex-col h-full overflow-y-auto"
        bodyClass="flex flex-col flex-1 overflow-y-auto"
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-4 mb-16">
          {!check && <Loading className="my-auto" type="modal" />}
          {check && (
            <>
              <CheckDetails
                check={check}
                timeRange={timeRange}
                className={`flex flex-col overflow-y-auto flex-1`}
              />
              <div className="rounded-t-none  flex gap-2 bg-gray-100 px-8 py-4 justify-end absolute w-full bottom-0 left-0">
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
                    <div className="flex flex-col items-center ">
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
    </>
  );
}
