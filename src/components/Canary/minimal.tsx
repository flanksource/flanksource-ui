import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "../Modal";
import { CheckDetails } from "./CanaryPopup/CheckDetails";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { CanaryCards } from "./card";
import { CanaryTable } from "./table";
import mixins from "../../utils/mixins.module.css";
import { getCheckStatuses } from "../../api/services/topology";
import { useSearchParams } from "react-router-dom";
import { EvidenceType } from "../../api/services/evidence";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { isCanaryUI } from "../../context/Environment";
import { toastError } from "../Toast/toast";
import dayjs from "dayjs";
import { HealthCheckEdit } from "./HealthCheckEdit";
import { HealthCheck } from "../../types/healthChecks";
import { timeRanges } from "../Dropdown/TimeRange";

const getStartValue = (start: string) => {
  if (!start.includes("mo")) {
    return start;
  }

  return dayjs()
    .subtract(+(start.match(/\d/g)?.[0] ?? "1"), "month")
    .toISOString();
};

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
    timeRange = timeRanges[0].value,
    checkId,
    checkTimeRange
  } = Object.fromEntries(searchParams.entries());

  const currentTimeRange = checkTimeRange || timeRange;
  const [selectedCheck, setSelectedCheck] = useState<Partial<HealthCheck>>();
  const [attachAsAsset, setAttachAsAsset] = useState(false);
  const [openChecksModal, setOpenChecksModal] = useState(false);

  const handleCheckSelect = useCallback(
    (check: Pick<HealthCheck, "id">) => {
      const payload = {
        check: check.id,
        includeMessages: true,
        start: getStartValue(currentTimeRange)
      };
      const data = {
        ...check,
        checkStatuses: undefined,
        loading: true
      };
      setOpenChecksModal(true);
      setSelectedCheck(data);
      getCheckStatuses(check.id, payload.start)
        .then((results) => {
          setSelectedCheck({
            ...data,
            loading: false,
            checkStatuses: results.data || []
          });
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            checkId: check.id,
            checkTimeRange: currentTimeRange
          });
        })
        .catch((err) => {
          toastError(`Loading status history failed`);
        });
    },
    [currentTimeRange, searchParams, setSearchParams]
  );

  useEffect(() => {
    if (checkId && !selectedCheck) {
      handleCheckSelect({ id: checkId });
    }
  }, []);

  function clearCheck() {
    setOpenChecksModal(false);
    searchParams.delete("checkId");
    searchParams.delete("checkTimeRange");
    setSearchParams(searchParams);
  }

  return (
    <>
      {layout === "card" ? (
        <CanaryCards checks={checks} onClick={handleCheckSelect} />
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
      <AttachEvidenceDialog
        isOpen={attachAsAsset}
        onClose={() => setAttachAsAsset(false)}
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
      />
      <Modal
        open={openChecksModal}
        onClose={() => clearCheck()}
        title={<CheckTitle check={selectedCheck} />}
        size="medium"
      >
        <div
          className="flex flex-col h-full py-4 mb-16"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <CheckDetails
            check={selectedCheck}
            timeRange={currentTimeRange}
            className={`flex flex-col overflow-y-hidden ${mixins.appleScrollbar}`}
          />
          <div className="rounded-t-lg flex space-x-2 bg-gray-100 px-8 py-4 justify-end absolute w-full bottom-0 left-0">
            {selectedCheck?.canary_id && (
              <HealthCheckEdit check={selectedCheck as HealthCheck} />
            )}
            {!isCanaryUI && (
              <button
                className="btn-primary float-right"
                onClick={(e) => setAttachAsAsset(true)}
              >
                Attach as Evidence
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export const MinimalCanary = React.memo(MinimalCanaryFC);
