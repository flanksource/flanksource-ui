import React, { useEffect, useState } from "react";
// import history from "history/browser";
import { Modal } from "../Modal";
import { CheckDetails } from "./CanaryPopup/CheckDetails";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { CanaryCards } from "./card";
import { CanaryTable } from "./table";
import mixins from "../../utils/mixins.module.css";
import { getCanaries } from "../../api/services/topology";
import { useSearchParams } from "react-router-dom";

const MinimalCanaryFC = ({
  checks,
  labels,
  selectedTab,
  tableHeadStyle = {}
}) => {
  const [searchParams] = useSearchParams();
  const { tabBy, layout } = searchParams;

  const [selectedCheck, setSelectedCheck] = useState(null);

  const handleCheckSelect = (check) => {
    getCanaries({ check: check.id, includeMessages: true }).then((results) => {
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
            className={`flex flex-col overflow-y-hidden ${mixins.appleScrollbar}`}
          />
        </div>
      </Modal>
    </>
  );
};

export const MinimalCanary = React.memo(MinimalCanaryFC);
