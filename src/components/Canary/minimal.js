import React, { useState } from "react";
// import history from "history/browser";
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

const MinimalCanaryFC = ({
  checks,
  labels,
  selectedTab,
  tableHeadStyle = {}
}) => {
  const [searchParams] = useSearchParams();
  const { tabBy, layout, timeRange } = Object.fromEntries(
    searchParams.entries()
  );

  const [selectedCheck, setSelectedCheck] = useState(null);
  const [attachAsAsset, setAttachAsAsset] = useState(false);

  const handleCheckSelect = (check) => {
    const payload = {
      check: check.id,
      includeMessages: true,
      start: timeRange
    };
    getCanaries(payload).then((results) => {
      if (results == null || results.data.checks.length === 0) {
        return;
      }
      setSelectedCheck(results.data.checks[0]);
    });
  };

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
        type={EvidenceType.Health}
        callback={(success) => {
          console.log(success);
        }}
      />
      <Modal
        open={selectedCheck != null}
        onClose={() => setSelectedCheck(null)}
        title={<CheckTitle check={selectedCheck} />}
        size="medium"
        hideActions
      >
        <div
          className="flex flex-col h-full py-8"
          style={{ maxHeight: "calc(100vh - 4rem)" }}
        >
          <CheckDetails
            check={selectedCheck}
            attachAsEvidence={() => setAttachAsAsset(true)}
            className={`flex flex-col overflow-y-hidden ${mixins.appleScrollbar}`}
          />
        </div>
      </Modal>
    </>
  );
};

export const MinimalCanary = React.memo(MinimalCanaryFC);
