import DashboardErrorBoundary from "../../components/Errors/DashboardErrorBoundary";
import { UserProfileDropdown } from "../../components/Users/UserProfile";
import { RefreshButton } from "../Buttons/RefreshButton";
import { HelpDropdown } from "../MenuBar/HelpDropdown";

interface IProps {
  children: React.ReactNode;
  contentClass?: string;
  title: React.ReactNode;
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
  return (
    <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-hidden">
      <div className="sticky top-0 z-10 flex-shrink-0 flex py-3 bg-white shadow h-16">
        <div className="px-4 flex flex-1 justify-between">
          <div className="flex items-center">
            <div>{title}</div>
          </div>
          <div
            className={`ml-4 flex gap-2 items-center md:ml-6 ${extraClassName}`}
          >
            {extra}
            {onRefresh && (
              <RefreshButton onClick={onRefresh} animate={loading} />
            )}
            <HelpDropdown />
            <UserProfileDropdown />
          </div>
        </div>
      </div>

      <main
        className="overflow-y-hidden h-full bg-warm-gray-50 "
        style={{ zIndex: 0 }}
      >
        <DashboardErrorBoundary>
          <div className={contentClass || "p-6"}>{children}</div>
        </DashboardErrorBoundary>
      </main>
    </div>
  );
}
