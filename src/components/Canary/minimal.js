import React, { useEffect, useState } from "react";
import history from "history/browser";
import { Modal } from "../Modal";
import { CheckDetails } from "./CanaryPopup/CheckDetails";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { CanaryCards } from "./card";
import { CanaryTable } from "./table";
import mixins from "../../utils/mixins.module.css";
import { getParamsFromURL } from "./utils";
import { getCanaries } from "../../api/services/topology";

export function MinimalCanary({
  checks,
  labels,
  selectedTab,
  tableHeadStyle = {}
}) {
  const [searchParams, setSearchParams] = useState(
    getParamsFromURL(window.location.search)
  );

  useEffect(() => {
    history.listen(({ location }) => {
      setSearchParams(getParamsFromURL(location.search));
    });
  }, []);
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
          history={history}
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
        title={
          <CheckTitle
            check={checks?.find((o) => o?.id === selectedCheck?.id)}
          />
        }
        size="medium"
        hideActions
      >
        <div
          className="flex flex-col h-full py-8"
          style={{ maxHeight: "calc(100vh - 4rem)" }}
        >
          <CheckDetails
            check={checks?.find((o) => o?.id === selectedCheck?.id)}
            // graphData={graphData}
            className={`flex flex-col overflow-y-hidden ${mixins.appleScrollbar}`}
          />
        </div>
      </Modal>
    </>
  );
}
