import { useState } from "react";
import { debounce } from "lodash";
import { SearchLayout } from "../components/Layout";
import { Canary } from "../components/Canary";
import { useUpdateParams } from "../components/Canary/url";
import { getParamsFromURL } from "../components/Canary/utils";
import { RefreshButton } from "../components/RefreshButton";

const getSearchParams = () => getParamsFromURL(window.location.search);

export function HealthPage({ url }) {
  const [loading, setLoading] = useState(true);
  const updateParams = useUpdateParams();
  const handleSearch = debounce((query) => {
    updateParams({ query });
  }, 400);

  return (
    <SearchLayout
      title={<h1 className="text-xl font-semibold">Health</h1>}
      extra={
        <RefreshButton
          onClick={() => handleSearch(getSearchParams()?.query || "")}
          animate={loading}
        />
      }
      contentClass="p-0"
    >
      <Canary url={url} onLoading={setLoading} />
    </SearchLayout>
  );
}
