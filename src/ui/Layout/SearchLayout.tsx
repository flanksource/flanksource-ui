import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";

import { cardPreferenceAtom } from "@flanksource-ui/store/preference.state";

import { HelpDropdown } from "../MenuBar/HelpDropdown";
import { RefreshButton } from "../Buttons/RefreshButton";
import { UserProfileDropdown } from "../../components/Users/UserProfile";
import DashboardErrorBoundary from "../../components/Errors/DashboardErrorBoundary";
import PreferencePopOver from "./Preference";

interface IProps {
  children: React.ReactNode;
  contentClass?: string;
  title?: React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
  extra?: React.ReactNode;
  extraClassName?: string;
}

export function SearchLayout({
  children,
  contentClass,
  extraClassName = "",
  title,
  extra,
  loading,
  onRefresh
}: IProps) {
  const [topologyCardSize, setTopologyCardSize] = useAtom(cardPreferenceAtom);

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-hidden bg-gray-50">
      <div className="sticky top-0 z-20 flex h-12 flex-shrink-0 bg-white py-2 shadow">
        <div className="flex flex-1 justify-between px-4">
          <div className="flex items-center">
            <div>{title}</div>
          </div>
          <div
            className={`ml-4 flex items-center gap-3 md:ml-6 ${extraClassName}`}
          >
            {extra}
            <div className="flex h-8 items-center divide-x divide-gray-300 rounded-md border border-gray-300 bg-white">
              {onRefresh && (
                <div className="flex h-full w-8 items-center justify-center">
                  <RefreshButton onClick={onRefresh} animate={loading} />
                </div>
              )}
              <div className="flex h-full w-8 items-center justify-center">
                <PreferencePopOver
                  cardSize={topologyCardSize}
                  setTopologyCardSize={setTopologyCardSize}
                />
              </div>
            </div>

            <div className="flex h-8 items-center divide-x divide-gray-300 rounded-md border border-gray-300 bg-white">
              <Link
                to={{
                  pathname: "/notifications"
                }}
                className="flex h-full w-8 items-center justify-center text-gray-400 hover:text-gray-500"
              >
                <FaBell className="h-4 w-4" />
              </Link>
              <div className="flex h-full w-8 items-center justify-center">
                <HelpDropdown />
              </div>
              <div className="flex h-full w-8 items-center justify-center">
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <DashboardErrorBoundary>
          <div
            className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${contentClass || "p-6"}`}
          >
            {children}
          </div>
        </DashboardErrorBoundary>
      </main>
    </div>
  );
}
