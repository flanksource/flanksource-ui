export const sortValues = ["none", "asc", "desc"];

export const getHealthPercentageScore = (check) => {
  if (check.checkStatuses && check.checkStatuses.length > 0) {
    let positives = 0;
    check.checkStatuses.forEach((statusObj) => {
      if (statusObj.status) {
        positives += 1;
      }
    });
    return positives / check.checkStatuses.length;
  }
  return 0;
};

export const getUptimeScore = (check) => {
  const { uptime } = check;
  let score = uptime.passed / (uptime.passed + uptime.failed);
  if (Number.isNaN(score)) {
    score = 0;
  }
  return score;
};

export const getLatency = (check) => {
  const { latency } = check;
  if (latency && latency.rolling1h) {
    return latency.rolling1h;
  }
  return Number.POSITIVE_INFINITY;
};
