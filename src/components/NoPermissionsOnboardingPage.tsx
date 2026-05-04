import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";

export function NoPermissionsOnboardingPage() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <SearchLayout contentClass="flex min-h-0 flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
            👋
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            Welcome to Mission Control
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your account is set up, but you do not have access to any pages yet.
            Ask an administrator to grant you access to Health, Catalog,
            Playbooks, or another workspace area.
          </p>
          <p className="mt-6 text-xs text-slate-400">
            This page will update automatically once permissions are assigned.
          </p>
        </div>
      </SearchLayout>
    </div>
  );
}
