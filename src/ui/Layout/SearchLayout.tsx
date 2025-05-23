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
    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-hidden">
      <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white py-3 shadow">
        <div className="flex flex-1 justify-between px-4">
          <div className="flex items-center">
            <div>{title}</div>
          </div>
          <div
            className={`ml-4 flex items-center gap-2 md:ml-6 ${extraClassName}`}
          >
            {extra}
            {onRefresh && (
              <RefreshButton onClick={onRefresh} animate={loading} />
            )}
            <Link
              to={{
                pathname: "/notifications"
              }}
            >
              <FaBell className="cursor-pointer text-gray-500" size={20} />
            </Link>

            <PreferencePopOver
              cardSize={topologyCardSize}
              setTopologyCardSize={setTopologyCardSize}
            />

            <HelpDropdown />
            <UserProfileDropdown />
          </div>
        </div>
      </div>

      <main
        className="h-full overflow-y-hidden bg-warm-gray-50"
        style={{ zIndex: 0 }}
      >
        <DashboardErrorBoundary>
          <div className={contentClass || "p-6"}>{children}</div>
        </DashboardErrorBoundary>
      </main>
    </div>
  );
}
