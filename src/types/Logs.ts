type LogItem = {
  labels?: Record<string, string>;
  message: string;
  timestamp: string;
  firstObserved: string;
};

export default LogItem;
