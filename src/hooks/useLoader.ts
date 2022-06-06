import { useEffect, useState } from "react";

export default function useLoader(): {
  idle: boolean;
  loading: boolean;
  loaded: boolean;
  setLoading: (val: boolean) => void;
} {
  const [idle, setIdle] = useState(true);
  const [requestsCount, setRequestsCounts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoading(requestsCount !== 0);
    setLoaded(requestsCount === 0 && !idle);
  }, [requestsCount, idle]);

  function computeLoadingState(showLoader: boolean) {
    setIdle(false);
    setRequestsCounts((val) => {
      return Math.max(0, showLoader ? val + 1 : val - 1);
    });
  }
  return {
    idle,
    loading,
    loaded,
    setLoading: computeLoadingState
  };
}
