import { RefreshButton } from "../RefreshButton";
import { UserProfile } from "../UserProfile/user-profile";

export function SearchLayout({ children, title, extra, onRefresh }) {
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex py-3 bg-white shadow">
          <div className="px-4 flex flex-1 justify-between">
            <div className="flex items-center">
              <div>{title}</div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {onRefresh && <RefreshButton onClick={onRefresh} />}
              {extra}
              <UserProfile />
            </div>
          </div>
        </div>

        <main>
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
