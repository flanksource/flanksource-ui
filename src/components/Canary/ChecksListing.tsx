import { atom } from "jotai";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HealthCheck } from "../../api/types/health";
import { isCanaryUI } from "../../context/Environment";
import { CanaryCards } from "./CanaryCards";
import { ChecksDetailsModal } from "./CanaryPopup/ChecksDetailsModal";
import { CanaryTable } from "./CanaryTable";
import { useHealthUserSettings } from "./useHealthUserSettings";

export const refreshCheckModalAtomTrigger = atom(0);

type ChecksListingProps = {
  checks?: HealthCheck[];
  labels?: any[];
  selectedTab?: string;
  tableHeadStyle?: any;
};

export function ChecksListing({
  checks,
  labels,
  selectedTab,
  tableHeadStyle = {}
}: ChecksListingProps) {
  const [searchParams, setSearchParams] = useSearchParams({
    layout: "table"
  });

  const { tabBy } = useHealthUserSettings();

  const layout = searchParams.get("layout");
  const checkId = searchParams.get("checkId") ?? undefined;

  const [isOpen, setOpen] = useState(false);

  const handleCheckSelect = useCallback(
    (check: Pick<HealthCheck, "id">) => {
      setOpen(true);
      searchParams.set("checkId", check.id);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  function clearCheck() {
    setOpen(false);
    searchParams.delete("checkId");
    searchParams.set("timeRange", "1h");
    setSearchParams(searchParams);
  }

  const showNamespaceTags = tabBy !== "namespace" || selectedTab === "all";

  return (
    <>
      {layout === "card" ? (
        <CanaryCards checks={checks!} onClick={handleCheckSelect} />
      ) : (
        <CanaryTable
          checks={checks}
          labels={labels}
          onCheckClick={handleCheckSelect}
          showNamespaceTags={showNamespaceTags}
          hideNamespacePrefix
          groupSingleItems={false}
          theadStyle={tableHeadStyle}
          style={{
            maxHeight: `calc(100vh - ${isCanaryUI ? "10rem" : "14rem"})`
          }}
        />
      )}
      <ChecksDetailsModal
        isOpen={isOpen}
        onClose={clearCheck}
        checkId={checkId}
      />
    </>
  );
}
