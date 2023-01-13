import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "../Modal";
import { CheckDetails } from "./CanaryPopup/CheckDetails";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { CanaryCards } from "./card";
import { CanaryTable } from "./table";
import mixins from "../../utils/mixins.module.css";
import { getCanaries } from "../../api/services/topology";
import { useSearchParams } from "react-router-dom";
import { EvidenceType } from "../../api/services/evidence";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { isCanaryUI } from "../../context/Environment";
import { toastError } from "../Toast/toast";
import dayjs from "dayjs";
import { HealthCheckEdit } from "./HealthCheckEdit";
import { HealthCheck } from "../../types/healthChecks";

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

  const { tabBy, layout, timeRange, checkId, checkTimeRange } =
    Object.fromEntries(searchParams.entries());

  const currentTimeRange = checkTimeRange ?? timeRange;
  const [selectedCheck, setSelectedCheck] = useState<Partial<HealthCheck>>();
  const [attachAsAsset, setAttachAsAsset] = useState(false);

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
        latency: undefined,
        uptime: undefined,
        loading: true
      };
      setSelectedCheck(data);
      getCanaries(payload).then((results) => {
        if (results == null || results.data.checks.length === 0) {
          toastError("There is no recent checks data");
          setSelectedCheck(undefined);
          return;
        }
        if (results?.data?.checks?.[0]?.id) {
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            checkId: results.data.checks[0].id,
            checkTimeRange: currentTimeRange
          });
          setSelectedCheck(results.data.checks[0]);
        }
      });
    },
    [currentTimeRange, searchParams, setSearchParams]
  );

  useEffect(() => {
    if (checkId && !selectedCheck) {
      handleCheckSelect({ id: checkId });
    }
  }, [checkId, handleCheckSelect, selectedCheck]);

  function clearCheck() {
    setSelectedCheck(undefined);
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
        open={selectedCheck != null}
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
