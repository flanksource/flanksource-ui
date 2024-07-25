import { UserProfileDropdown } from "../../components/Users/UserProfile";

type MinimalLayoutProps = {
  children: React.ReactNode;
  title: React.ReactNode;
};

export function MinimalLayout({ children, title }: MinimalLayoutProps) {
  return (
    <div className="flex flex-1">
      <div className="flex flex-1 flex-col overflow-x-auto">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <div className="flex flex-1 justify-between px-4">
            <div className="flex items-center">
              <div>{title}</div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <UserProfileDropdown />
            </div>
          </div>
        </div>

        <main>
          <div className="mx-auto max-w-screen-lg bg-warm-gray-50 py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
