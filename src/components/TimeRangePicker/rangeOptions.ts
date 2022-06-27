export type RangeOption = {
  display?: string;
  from: string;
  to: string;
};

export type RangeOptionsCategory = {
  name: string;
  options: RangeOption[];
};

export const displayTimeFormat = "YYYY-MM-DD HH:mm";

export const rangeOptionsCategories = [
  {
    name: "Relative time ranges",
    options: [
      { display: "5 minutes", from: "now-5m", to: "now" },
      { display: "15 minutes", from: "now-15m", to: "now" },
      { display: "30 minutes", from: "now-30m", to: "now" },
      { display: "1 hour", from: "now-1h", to: "now" },
      { display: "3 hours", from: "now-3h", to: "now" },
      { display: "6 hours", from: "now-6h", to: "now" },
      { display: "12 hours", from: "now-12h", to: "now" },
      { display: "24 hours", from: "now-24h", to: "now" },
      { display: "2 days", from: "now-2d", to: "now" },
      { display: "7 days", from: "now-7d", to: "now" },
      { display: "30 days", from: "now-30d", to: "now" },
      { display: "90 days", from: "now-90d", to: "now" },
      { display: "6 months", from: "now-6M", to: "now" },
      { display: "1 year", from: "now-1y", to: "now" },
      { display: "2 year", from: "now-2y", to: "now" },
      { display: "5 year", from: "now-5y", to: "now" }
    ]
  },
  {
    name: "Other quick ranges",
    options: [
      { display: "Yesterday", from: "now-1d/d", to: "now-1d/d" },
      { display: "Day before yesterday", from: "now-2d/d", to: "now-2d/d" },
      { display: "This day last week", from: "now-7d/d", to: "now-7d/d" },
      { display: "Previous week", from: "now-1w/w", to: "now-1w/w" },
      { display: "Previous month", from: "now-1M/M", to: "now-1M/M" },
      { display: "Previous year", from: "now-1y/y", to: "now-1y/y" },
      { display: "Today", from: "now/d", to: "now/d" },
      { display: "Today so far", from: "now", to: "now" },
      { display: "This week", from: "now/w", to: "now/w" },
      { display: "This week so far", from: "now/w", to: "now" },
      { display: "This month", from: "now/M", to: "now/M" },
      { display: "This month so far", from: "now/M", to: "now" },
      { display: "This year", from: "now/y", to: "now/y" },
      { display: "This year so far", from: "now/y", to: "now" }
    ]
  }
];
