export const sortValues = ["none", "asc", "desc"];

export const getHealthPercentageScore = (check) => {
  if (check != null) {
    if (check.checkStatuses && check.checkStatuses.length > 0) {
      let positives = 0;
      check.checkStatuses.forEach((statusObj) => {
        if (statusObj.status) {
          positives += 1;
        }
      });
      return positives / check.checkStatuses.length;
    }
    return -1;
  }
  return -1;
};

export const getUptimeScore = (check) => {
  if (check != null) {
    const { uptime } = check;
    const score = uptime.passed / (uptime.passed + uptime.failed);
    if (Number.isNaN(score)) {
      return 0;
    }
    return score;
  }
  return -1;
};

export const getLatency = (check) => {
  if (check != null) {
    const { latency } = check;
    if (latency && latency.rolling1h) {
      return latency.rolling1h;
    }
    return Number.POSITIVE_INFINITY;
  }
  return Number.POSITIVE_INFINITY;
};
