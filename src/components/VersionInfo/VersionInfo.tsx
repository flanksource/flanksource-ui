import packageJson from "../../../package.json";
import { useVersionInfo } from "../../api/query-hooks";

// This is static version from package.json and doesn't change after build
const frontendVersion = packageJson.version;

export function VersionInfo() {
  const { data, isLoading, isRefetching } = useVersionInfo();
  const versionInfo = data?.data as any;

  if (isLoading || isRefetching) {
    return null;
  }

  return (
    <div className="block border-0 border-b border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
      Frontend: <b className="text-xs">{frontendVersion}</b>, Backend:{" "}
      <b className="text-xs">{versionInfo?.backend || "NA"}</b>
    </div>
  );
}
