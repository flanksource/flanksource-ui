import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCheckDetails } from "../../api/query-hooks/health";
import { EvidenceType } from "../../api/types/evidence";
import { HealthCheck } from "../../api/types/health";
import { isCanaryUI } from "../../context/Environment";
import AttachAsEvidenceButton from "../AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import { timeRanges } from "../Dropdown/TimeRange";
import { Modal } from "../Modal";
import PlaybooksDropdownMenu from "../Playbooks/Runs/Submit/PlaybooksDropdownMenu";
import { CheckDetails } from "./CanaryPopup/CheckDetails";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { HealthCheckEdit } from "./HealthCheckEdit";
import { CanaryCards } from "./CanaryCards";
import { CanaryTable } from "./table";

type MinimalCanaryFCProps = {
  checks?: HealthCheck[];
  labels?: any[];
  selectedTab?: string;
  tableHeadStyle?: any;
};

const MinimalCanaryFC = ({
  checks,
  labels,
  selectedTab,
  tableHeadStyle = {}
}: MinimalCanaryFCProps) => {
  const [searchParams, setSearchParams] = useSearchParams({
    layout: "table"
  });

  const {
    tabBy,
    layout,
    timeRange = timeRanges[1].value,
    checkId
  } = Object.fromEntries(searchParams.entries());

  const [selectedCheck, setSelectedCheck] = useState<Partial<HealthCheck>>();
  const [openChecksModal, setOpenChecksModal] = useState(false);

  const { data: check } = useGetCheckDetails(selectedCheck?.id);

  // Open check modal if checkId is present in url, but no check is selected
  useEffect(() => {
    if (checkId && !selectedCheck?.id) {
      setSelectedCheck(checks?.find((c) => c.id === checkId));
      setOpenChecksModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckSelect = useCallback(
    (check: Pick<HealthCheck, "id">) => {
      setSelectedCheck({
        ...check,
        checkStatuses: undefined
      });
      setOpenChecksModal(true);
      searchParams.set("checkId", check.id);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  function clearCheck() {
    setOpenChecksModal(false);
    searchParams.delete("checkId");
    searchParams.set("timeRange", "1h");
    setSearchParams(searchParams);
  }

  return (
    <>
      {layout === "card" ? (
        <CanaryCards checks={checks!} onClick={handleCheckSelect} />
      ) : (
        <CanaryTable
          checks={checks}
          labels={labels}
          onCheckClick={handleCheckSelect}
          showNamespaceTags={
            tabBy !== "namespace" ? true : selectedTab === "all"
          }
          hideNamespacePrefix
          groupSingleItems={false}
          theadStyle={tableHeadStyle}
          style={{
            maxHeight: `calc(100vh - ${isCanaryUI ? "10rem" : "14rem"})`
          }}
        />
      )}
      <Modal
        open={openChecksModal && !!check}
        onClose={() => clearCheck()}
        title={<CheckTitle check={check ?? selectedCheck} size="" />}
        size="full"
        containerClassName="flex flex-col h-full overflow-y-auto"
        bodyClass="flex flex-col flex-1 overflow-y-auto"
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-4 mb-16">
          <CheckDetails
            check={check}
            timeRange={timeRange}
            className={`flex flex-col overflow-y-auto flex-1`}
          />
          <div className="rounded-t-none  flex gap-2 bg-gray-100 px-8 py-4 justify-end absolute w-full bottom-0 left-0">
            {selectedCheck?.canary_id && (
              <HealthCheckEdit check={selectedCheck as HealthCheck} />
            )}
            {!isCanaryUI && (
              <>
                <div className="flex flex-col items-center ">
                  <PlaybooksDropdownMenu
                    className="btn-primary"
                    check_id={selectedCheck?.id}
                  />
                </div>
                <div className="flex flex-col items-center py-1">
                  <AttachAsEvidenceButton
                    check_id={selectedCheck?.id}
                    evidence={{
                      check_id: selectedCheck?.id,
                      includeMessages: true,
                      start: timeRange
                    }}
                    type={EvidenceType.Check}
                    callback={(success: boolean) => {
                      console.log(success);
                    }}
                    className="btn-primary"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export const MinimalCanary = React.memo(MinimalCanaryFC);
