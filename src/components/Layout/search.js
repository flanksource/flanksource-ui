import { RefreshButton } from "../RefreshButton";
import { UserProfile } from "../UserProfile/user-profile";

export function SearchLayout({
  children,
  contentClass,
  title,
  extra,
  onRefresh,
  button
}) {
  return (
    <div className="flex flex-col flex-1">
      <div className="sticky top-0 z-10 flex-shrink-0 flex py-3 bg-white shadow">
        <div className="px-4 flex flex-1 justify-between">
          <div className="flex items-center">
            <div>{button}{title}</div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            {onRefresh && <RefreshButton onClick={onRefresh} />}
            {extra}
            <UserProfile />
          </div>
        </div>
      </div>

      <main>
        <div className={contentClass || "p-6"}>{children}</div>
      </main>
    </div>
  );
}
