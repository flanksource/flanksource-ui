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
    <div className="block py-2 px-4 text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200">
      Frontend: <b className="text-xs">{frontendVersion}</b>, Backend:{" "}
      <b className="text-xs">{versionInfo?.backend || "NA"}</b>
    </div>
  );
}
