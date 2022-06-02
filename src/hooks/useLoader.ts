import { useEffect, useState } from "react";

export function useLoader(): [
  idle: boolean,
  loading: boolean,
  loaded: boolean,
  setLoading: (val: boolean) => void
] {
  const [idle, setIdle] = useState(true);
  const [requestsCount, setRequestsCounts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoading(requestsCount !== 0);
    setLoaded(requestsCount === 0 && !idle);
  }, [requestsCount]);

  function computeLoadingState(showLoader: boolean) {
    setIdle(false);
    setRequestsCounts((val) => {
      val = showLoader ? val + 1 : val - 1;
      val = val < 0 ? 0 : val;
      return val;
    });
  }
  return [idle, loading, loaded, computeLoadingState];
}
