import { HiOutlineRefresh } from "react-icons/hi";
import { UserProfile } from "../UserProfile/user-profile";

export function SearchLayout({ children, title, extra, onRefresh }) {
  return (
    <div>
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex items-center">
              <div>{title}</div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {!onRefresh && (
                <button
                  onClick={onRefresh}
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none mr-2 "
                >
                  <span className="sr-only">Refresh</span>
                  <HiOutlineRefresh className="h-6 w-6" aria-hidden="true" />
                </button>
              )}
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
