import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Modal } from "../Modal";
import { CanaryCards } from "./card";
import { CanaryTable } from "./table";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { CheckDetails } from "./CanaryPopup/CheckDetails";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";

import { isCanaryUI } from "../../constants";
import { searchParamsToObj } from "../../utils/common";
import { getCanaries } from "../../api/services/topology";

import mixins from "../../utils/mixins.module.css";
import { EvidenceType } from "../../api/services/evidence";

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
      start: currentTimeRange
    };
    getCanaries(payload).then((results) => {
      if (results == null || results.data.checks.length === 0) {
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
          hideNamespacePrefix
          groupSingleItems={false}
          theadStyle={tableHeadStyle}
          onCheckClick={handleCheckSelect}
          showNamespaceTags={
            tabBy !== "namespace" ? true : selectedTab === "all"
          }
        />
      )}
      <AttachEvidenceDialog
        isOpen={attachAsAsset}
        type={EvidenceType.Health}
        onClose={() => setAttachAsAsset(false)}
        callback={(success) => {
          console.log(success);
        }}
        evidence={{
          check_id: selectedCheck?.id,
          includeMessages: true,
          start: currentTimeRange
        }}
      />
      <Modal
        size="medium"
        hideActions
        open={selectedCheck != null}
        onClose={() => clearCheck()}
        title={<CheckTitle check={selectedCheck} />}
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
          <div className="absolute bottom-0 left-0 items-end justify-between w-full px-8 py-4 bg-gray-100 rounded-t-lg">
            {!isCanaryUI && (
              <button
                className="float-right btn-primary"
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
