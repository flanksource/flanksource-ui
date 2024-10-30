import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type CatalogTabsType =
  | "catalog"
  | "changes"
  | "insights"
  | "relationships"
  | "playbooks"
  | "checks";

const previousVisitedCatalogTab = atomWithStorage<CatalogTabsType>(
  "previousVisitedCatalogTab",
  "catalog",
  undefined,
  {
    getOnInit: true
  }
);

const currentTabAtom = atom<CatalogTabsType | undefined>(undefined);

/**
 *
 * useNavigateToPreviousVisitedCatalogTab
 *
 * This hook is used to navigate to the previous visited tab in the catalog page
 * (/catalog/:id) if the current tab is not the catalog tab.
 *
 */
export default function useNavigateToPreviousVisitedCatalogTab() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentTab, setCurrentTab] = useAtom(currentTabAtom);

  const [previousVisitedTab, setPreviousVisitedTab] = useAtom(
    previousVisitedCatalogTab
  );

  useEffect(() => {
    // we update the previous visited tab, if the tab changes and we are in the
    // catalog page
    if (location.pathname.includes(`/catalog/${id}`)) {
      const tab = location.pathname.split(
        `/catalog/${id}/` // /catalog/:id/
      )[1] as CatalogTabsType;
      setPreviousVisitedTab(tab);
    }
  }, [id, location, navigate, previousVisitedTab, setPreviousVisitedTab]);

  useEffect(() => {
    // we want to force to catalog tab previously visited, if we are in the
    // catalog page (/catalog/:id), and the previous visited tab is not catalog
    // tab
    if (
      location.pathname.endsWith(
        `/catalog/${id}` // /catalog/:id
      ) &&
      previousVisitedTab !== "catalog" &&
      // we want to avoid infinite loop
      previousVisitedTab !== currentTab
    ) {
      navigate(previousVisitedTab);
    }

    // we set the current tab to the previous visited tab if we are in
    setCurrentTab(previousVisitedTab);
  }, [
    currentTab,
    id,
    location,
    navigate,
    previousVisitedTab,
    setCurrentTab,
    setPreviousVisitedTab
  ]);
}
