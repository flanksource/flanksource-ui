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
