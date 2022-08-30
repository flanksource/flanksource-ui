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
import { updateParams } from "./url";

const MinimalCanaryFC = ({
  checks,
  labels,
  selectedTab,
  tableHeadStyle = {}
}) => {
  const [searchParams, setSearchParams] = useState(
    getParamsFromURL(window.location.search)
  );

  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      setSearchParams(getParamsFromURL(location.search));
    });
    return () => {
      unlisten();
    };
  }, []);
  const { tabBy, layout } = searchParams;

  const [selectedCheck, setSelectedCheck] = useState(null);

  const handleCheckSelect = (check) => {
    updateParams({ check_id: check.id });
  };

  useEffect(() => {
    const { check_id } = searchParams;
    if (check_id) {
      getCanaries({ check: check_id, includeMessages: true }).then(
        (results) => {
          if (results == null || results.data.checks.length === 0) {
            return;
          }
          setSelectedCheck(results.data.checks[0]);
        }
      );
    }
  }, [searchParams]);

  const closeModal = () => {
    setSelectedCheck(null);
    updateParams({ check_id: "" });
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
        onClose={() => closeModal()}
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
