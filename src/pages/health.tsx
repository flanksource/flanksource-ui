import { useState } from "react";
import { SearchLayout } from "../components/Layout";
import { Canary } from "../components/Canary";
import RefreshDropdown, {
  HEALTH_PAGE_REFRESH_RATE_KEY
} from "../components/RefreshDropdown";
import { HealthRefreshDropdownRateContext } from "../components/RefreshDropdown/RefreshRateContext";
import { Modal } from "../components";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";
import { AiFillPlusCircle } from "react-icons/ai";
import { BreadcrumbNav, BreadcrumbRoot } from "../components/BreadcrumbNav";
import { Head } from "../components/Head/Head";
import HealthSpecEditor from "../components/SpecEditor/HealthSpecEditor";
import { useSettingsCreateResource } from "../api/query-hooks/mutations/useSettingsResourcesMutations";

type Props = {
  url: string;
};

export function HealthPage({ url }: Props) {
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const resourceInfo = schemaResourceTypes.find(
    (item) => item.name === "Health Check"
  );

  const { mutate: createResource } = useSettingsCreateResource(
    resourceInfo!,
    () => {
      setModalIsOpen(false);
    }
  );

  /**
   * Refresh page whenever clicked, increment state to trigger useEffect
   */
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [refreshRate, setRefreshRate] = useState(() => {
    const refreshRate = localStorage.getItem(HEALTH_PAGE_REFRESH_RATE_KEY);
    return refreshRate ?? "";
  });

  return (
    <>
      <Head prefix="Health" />
      <HealthRefreshDropdownRateContext.Provider
        value={{
          refreshRate,
          setRefreshRate
        }}
      >
        <SearchLayout
          title={
            <BreadcrumbNav
              list={[
                <BreadcrumbRoot link="/health">Health</BreadcrumbRoot>,
                <button
                  type="button"
                  className=""
                  onClick={() => setModalIsOpen(true)}
                >
                  <AiFillPlusCircle size={32} className="text-blue-600" />
                </button>
              ]}
            />
          }
          extra={
            <RefreshDropdown
              onClick={() => setTriggerRefresh(triggerRefresh + 1)}
              isLoading={loading}
            />
          }
          contentClass="p-0"
        >
          <Canary
            url={url}
            onLoading={setLoading}
            triggerRefresh={triggerRefresh}
          />
        </SearchLayout>
        <Modal
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          bodyClass=""
          size="full"
          title={`Add ${resourceInfo!.name}`}
        >
          <HealthSpecEditor onSubmit={(val) => createResource(val)} />
        </Modal>
      </HealthRefreshDropdownRateContext.Provider>
    </>
  );
}
