import React, { useEffect, useState } from "react";
import history from "history/browser";
import { Modal } from "../Modal";
import { CheckDetails } from "./CanaryPopup/CheckDetails";
import { CheckTitle } from "./CanaryPopup/CheckTitle";
import { CanaryCards } from "./card";
import { CanaryTable } from "./table";
import mixins from "../../utils/mixins.module.css";
import { getParamsFromURL } from "./utils";

export function MinimalCanary({ checks, labels, selectedTab }) {
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
    setSelectedCheck(check);
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
          theadStyle={{}}
        />
      )}
      <Modal
        open={selectedCheck != null}
        onClose={() => setSelectedCheck(null)}
        containerClass="py-8"
        cardClass="w-full h-full"
        cardStyle={{
          maxWidth: "1280px"
        }}
        contentClass="h-full px-8"
        closeButtonStyle={{ padding: "2.25rem 2.25rem 0 0" }}
        hideActions
      >
        <div
          className="flex flex-col h-full py-8"
          style={{ maxHeight: "calc(100vh - 4rem)" }}
        >
          <CheckTitle
            check={checks.find((o) => o?.id === selectedCheck?.id)}
            className="pb-4"
          />
          <CheckDetails
            check={checks.find((o) => o?.id === selectedCheck?.id)}
            // graphData={graphData}
            className={`flex flex-col overflow-y-hidden ${mixins.appleScrollbar}`}
          />
        </div>
      </Modal>
    </>
  );
}
