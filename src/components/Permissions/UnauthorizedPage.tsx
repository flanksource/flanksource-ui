import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { FaExclamationCircle } from "react-icons/fa";

export function UnauthorizedMessage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <h1 className="font-semibold text-red-500">
        <FaExclamationCircle className="mr-2 inline-block" />
        Unauthorized
      </h1>
      <p>You do not have permission to access this page</p>
    </div>
  );
}

export default function UnauthorizedPage({
  isLoading
}: {
  isLoading: boolean;
}) {
  return (
    <SearchLayout contentClass="p-0 h-full" loading={isLoading}>
      <UnauthorizedMessage />
    </SearchLayout>
  );
}
