import React, { useEffect, useState } from "react";
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
import { searchParamsToObj } from "../../utils/common";
import dayjs from "dayjs";

const getStartValue = (start) => {
  if (!start.includes("mo")) {
    return start;
  }

  return dayjs()
    .subtract(+(start.match(/\d/g)?.[0] ?? "1"), "month")
    .toISOString();
};

const MinimalCanaryFC = ({
  checks,
  labels,
  selectedTab,
  tableHeadStyle = {}
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { tabBy, layout, timeRange, checkId, checkTimeRange } =
    Object.fromEntries(searchParams.entries());
  const currentTimeRange = checkTimeRange ?? timeRange;
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [attachAsAsset, setAttachAsAsset] = useState(false);

  useEffect(() => {
    if (checkId && !selectedCheck) {
      handleCheckSelect({ id: checkId });
    }
  }, [checkId]);

  const handleCheckSelect = (check) => {
    const payload = {
      check: check.id,
      includeMessages: true,
      start: getStartValue(currentTimeRange)
    };
    const data = {
      ...check,
      checkStatuses: null,
      latency: null,
      uptime: null,
      loading: true
    };
    setSelectedCheck(data);
    getCanaries(payload).then((results) => {
      if (results == null || results.data.checks.length === 0) {
        toastError("There is no recent checks data");
        setSelectedCheck(null);
        return;
      }
      if (results?.data?.checks?.[0]?.id) {
        setSearchParams({
          ...searchParamsToObj(searchParams),
          checkId: results.data.checks[0].id,
          checkTimeRange: currentTimeRange
        });
        setSelectedCheck(results.data.checks[0]);
      }
    });
  };

  function clearCheck() {
    setSelectedCheck(null);

    const newSearchParams = {
      ...searchParamsToObj(searchParams)
    };
    const { checkId, checkTimeRange, ...removedSearchParams } = newSearchParams;
    setSearchParams(removedSearchParams);
  }

  return (
    <>
      {layout === "card" && (
        <CanaryCards checks={checks} onClick={handleCheckSelect} />
      )}
      {(layout === "table" || !layout) && (
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
        />
      )}
      <AttachEvidenceDialog
        isOpen={attachAsAsset}
        onClose={() => setAttachAsAsset(false)}
        evidence={{
          check_id: selectedCheck?.id,
          includeMessages: true,
          start: timeRange
        }}
        type={EvidenceType.Check}
        callback={(success) => {
          console.log(success);
        }}
      />
      <Modal
        open={selectedCheck != null}
        onClose={() => clearCheck()}
        title={<CheckTitle check={selectedCheck} />}
        size="medium"
        hideActions
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
          <div className="rounded-t-lg justify-between bg-gray-100 px-8 py-4 items-end absolute w-full bottom-0 left-0">
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
