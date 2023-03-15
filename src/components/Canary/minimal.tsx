import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "../Modal";
import { CheckDetails } from "./CanaryPopup/CheckDetails";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { CanaryCards } from "./card";
import { CanaryTable } from "./table";
import mixins from "../../utils/mixins.module.css";
import { useSearchParams } from "react-router-dom";
import { EvidenceType } from "../../api/services/evidence";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { isCanaryUI } from "../../context/Environment";
import { HealthCheckEdit } from "./HealthCheckEdit";
import { HealthCheck } from "../../types/healthChecks";
import { timeRanges } from "../Dropdown/TimeRange";
import { getCanaries } from "../../api/services/topology";
import { toastError } from "../Toast/toast";

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
  const [attachAsAsset, setAttachAsAsset] = useState(false);
  const [openChecksModal, setOpenChecksModal] = useState(false);

  const handleCheckSelect = useCallback(
    (check: Pick<HealthCheck, "id">) => {
      setSelectedCheck({
        ...check,
        checkStatuses: undefined
      });
      setOpenChecksModal(true);
      const payload = {
        check: check.id,
        includeMessages: false,
        start: timeRange
      };
      getCanaries(payload)
        .then((response) => {
          if (!response.data?.checks?.[0]) {
            toastError(`Failed to fetch checks data`);
            return;
          }
          setSelectedCheck(response.data?.checks?.[0]);
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            checkId: check.id,
            timeRange
          });
        })
        .catch((err) => {
          toastError(err);
        });
    },
    [searchParams, setSearchParams, timeRange]
  );

  useEffect(() => {
    if (checkId && !selectedCheck) {
      handleCheckSelect({ id: checkId });
    }
  }, []);

  function clearCheck() {
    setOpenChecksModal(false);
    searchParams.delete("checkId");
    searchParams.set("timeRange", "1h");
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
        title={<CheckTitle check={selectedCheck} size="" />}
        size="medium"
      >
        <div
          className="flex flex-col h-full py-4 mb-16"
          style={{ maxHeight: "calc(100vh - 12rem)" }}
        >
          <CheckDetails
            check={selectedCheck}
            timeRange={timeRange}
            className={`flex flex-col overflow-y-hidden ${mixins.appleScrollbar}`}
          />
          <div className="flex space-x-2 border-t border-t-gray-400 px-8 py-4 justify-end absolute w-full bottom-0 left-0">
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
