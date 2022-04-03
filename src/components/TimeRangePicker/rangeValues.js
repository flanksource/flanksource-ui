/* eslint-disable prettier/prettier */
const intervalsInMs = {
  y: 31536000000,
  M: 2592000000,
  w: 604800000,
  d: 86400000,
  h: 3600000,
  m: 60000,
  s: 1000,
  ms: 1
};

export const rangeValues = [
  { title: "1 hour", from: "now-1h", to: "now", interval: intervalsInMs.h },
  { title: "2 hours", from: "now-2h", to: "now", interval: intervalsInMs.h * 2 },
  { title: "3 hours", from: "now-3h", to: "now", interval: intervalsInMs.h * 3 },
  { title: "4 hours", from: "now-4h", to: "now", interval: intervalsInMs.h * 4 },
  { title: "5 hours", from: "now-5h", to: "now", interval: intervalsInMs.h * 5 },
  { title: "6 hours", from: "now-6h", to: "now", interval: intervalsInMs.h * 6 },
  { title: "12 hours", from: "now-12h", to: "now", interval: intervalsInMs.h * 12 },
  { title: "24 hours", from: "now-24h", to: "now", interval: intervalsInMs.h * 24 },
  { title: "2 days", from: "now-2d", to: "now", interval: intervalsInMs.d * 2 },
  { title: "3 days", from: "now-3d", to: "now", interval: intervalsInMs.d * 3 },
  { title: "4 days", from: "now-4d", to: "now", interval: intervalsInMs.d * 4 },
  { title: "5 days", from: "now-5d", to: "now", interval: intervalsInMs.d * 5 },
  { title: "6 days", from: "now-6d", to: "now", interval: intervalsInMs.d * 6 },
  { title: "7 days", from: "now-7d", to: "now", interval: intervalsInMs.d * 7 },
  { title: "2 weeks", from: "now-2w", to: "now", interval: intervalsInMs.w * 2 },
  { title: "3 weeks", from: "now-3w", to: "now", interval: intervalsInMs.w * 3 },
  { title: "1 month", from: "now-1m", to: "now", interval: intervalsInMs.M }
];
