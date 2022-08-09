import { RefreshButton } from "../RefreshButton";
import { UserProfile } from "../UserProfile/user-profile";

interface IProps {
  children: React.ReactNode;
  contentClass?: string;
  title: React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
  extra?: React.ReactNode;
}

export function SearchLayout({
  children,
  contentClass,
  title,
  extra,
  loading,
  onRefresh
}: IProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="sticky top-0 z-10 flex-shrink-0 flex py-3 bg-white shadow h-16">
        <div className="px-4 flex flex-1 justify-between">
          <div className="flex items-center">
            <div>{title}</div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            {onRefresh && (
              <RefreshButton onClick={onRefresh} animate={loading} />
            )}
            {extra}
            <UserProfile />
          </div>
        </div>
      </div>

      <main className="overflow-y-auto h-full">
        <div className={contentClass || "p-6"}>{children}</div>
      </main>
    </div>
  );
}
