type LogItem = {
  labels?: Record<string, string>;
  message: string;
  timestamp: string;
  count?: number;
  firstObserved?: string;
  lastObserved?: string;
};

export default LogItem;
