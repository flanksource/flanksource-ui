type TimeRangeRelativeOption = {
  type: "relative";
  display: string;
  range: string;
};

type TimeRangeMappedOption = {
  type: "mapped";
  display: string;
};

export type TimeRangeAbsoluteOption = {
  type: "absolute";
  display: "Custom";
  from: string;
  to: string;
};

export type TimeRangeOption =
  | TimeRangeRelativeOption
  | TimeRangeMappedOption
  | TimeRangeAbsoluteOption;

export type RangeOptionsCategory = {
  name: string;
  type: "future" | "past";
  options: TimeRangeOption[];
};

export const displayTimeFormat = "YYYY-MM-DD HH:mm";

export const rangeOptionsCategories: RangeOptionsCategory[] = [
  {
    name: "Relative time ranges",
    type: "past",
    options: [
      {
        type: "relative",
        display: "5 minutes",
        range: "now-5m"
      },
      {
        display: "15 minutes",
        type: "relative",
        range: "now-15m"
      },
      {
        display: "30 minutes",
        type: "relative",
        range: "now-30m"
      },
      {
        display: "1 hour",
        type: "relative",
        range: "now-1h"
      },
      {
        display: "3 hours",
        type: "relative",
        range: "now-3h"
      },
      {
        display: "6 hours",
        type: "relative",
        range: "now-6h"
      },
      {
        display: "12 hours",
        type: "relative",
        range: "now-12h"
      },
      {
        display: "24 hours",
        type: "relative",
        range: "now-24h"
      },
      {
        display: "2 days",
        type: "relative",
        range: "now-2d"
      },
      {
        display: "7 days",
        type: "relative",
        range: "now-7d"
      },
      {
        display: "30 days",
        type: "relative",
        range: "now-30d"
      },
      {
        display: "90 days",
        type: "relative",
        range: "now-90d"
      },
      {
        display: "6 months",
        type: "relative",
        range: "now-6M"
      },
      {
        display: "1 year",
        type: "relative",
        range: "now-1y"
      },
      {
        display: "2 year",
        type: "relative",
        range: "now-2y"
      },
      {
        display: "5 year",
        type: "relative",
        range: "now-5y"
      }
    ]
  },
  {
    name: "Relative time ranges",
    type: "future",
    options: [
      {
        type: "relative",
        display: "5 minutes",
        range: "now+5m"
      },
      {
        display: "15 minutes",
        type: "relative",
        range: "now+15m"
      },
      {
        display: "30 minutes",
        type: "relative",
        range: "now+30m"
      },
      {
        display: "1 hour",
        type: "relative",
        range: "now+1h"
      },
      {
        display: "3 hours",
        type: "relative",
        range: "now+3h"
      },
      {
        display: "6 hours",
        type: "relative",
        range: "now+6h"
      },
      {
        display: "12 hours",
        type: "relative",
        range: "now+12h"
      },
      {
        display: "24 hours",
        type: "relative",
        range: "now+24h"
      },
      {
        display: "2 days",
        type: "relative",
        range: "now+2d"
      },
      {
        display: "7 days",
        type: "relative",
        range: "now+7d"
      },
      {
        display: "30 days",
        type: "relative",
        range: "now+30d"
      },
      {
        display: "90 days",
        type: "relative",
        range: "now+90d"
      },
      {
        display: "6 months",
        type: "relative",
        range: "now+6M"
      },
      {
        display: "1 year",
        type: "relative",
        range: "now+1y"
      },
      {
        display: "2 year",
        type: "relative",
        range: "now+2y"
      },
      {
        display: "5 year",
        type: "relative",
        range: "now+5y"
      }
    ]
  },
  {
    name: "Other quick ranges",
    type: "past",
    options: [
      {
        display: "Yesterday",
        type: "mapped"
      },
      {
        display: "Day before yesterday",
        type: "mapped"
      },
      {
        display: "This day last week",
        type: "mapped"
      },
      {
        display: "Previous week",
        type: "mapped"
      },
      {
        display: "Previous month",
        type: "mapped"
      },
      {
        display: "Previous year",
        type: "mapped"
      },
      {
        display: "Today",
        type: "mapped"
      },
      {
        display: "Today so far",
        type: "mapped"
      },
      {
        display: "This week",
        type: "mapped"
      },
      {
        display: "This week so far",
        type: "mapped"
      },
      {
        display: "This month",
        type: "mapped"
      },
      {
        display: "This month so far",
        type: "mapped"
      },
      {
        display: "This year",
        type: "mapped"
      },
      {
        display: "This year so far",
        type: "mapped"
      }
    ]
  }
];

export type MappedOptionsDisplay =
  | "Yesterday"
  | "Day before yesterday"
  | "This day last week"
  | "Previous week"
  | "Previous month"
  | "Previous year"
  | "Today"
  | "Today so far"
  | "This week"
  | "This week so far"
  | "This month"
  | "This month so far"
  | "This year"
  | "This year so far";

export const mappedOptionsTimeRanges = new Map<
  MappedOptionsDisplay,
  () => {
    from: string;
    to: string;
  }
>([
  [
    "Yesterday",
    () => ({
      from: "now-1d/d",
      to: "now-1d/d"
    })
  ],
  [
    "Day before yesterday",
    () => ({
      from: "now-2d/d",
      to: "now-2d/d"
    })
  ],
  [
    "This day last week",
    () => ({
      from: "now-7d/d",
      to: "now-7d/d"
    })
  ],
  [
    "Previous week",
    () => ({
      from: "now-1w/w",
      to: "now-1w/w"
    })
  ],
  [
    "Previous month",
    () => ({
      from: "now-1M/M",
      to: "now-1M/M"
    })
  ],
  [
    "Previous year",
    () => ({
      from: "now-1y/y",
      to: "now-1y/y"
    })
  ],
  [
    "Today",
    () => ({
      from: "now/d",
      to: "now/d"
    })
  ],
  [
    "Today so far",
    () => ({
      from: "now",
      to: "now"
    })
  ],
  [
    "This week",
    () => ({
      from: "now/w",
      to: "now/w"
    })
  ],
  [
    "This week so far",
    () => ({
      from: "now/w",
      to: "now"
    })
  ],
  [
    "This month",
    () => ({
      from: "now/M",
      to: "now/M"
    })
  ],
  [
    "This month so far",
    () => ({
      from: "now/M",
      to: "now"
    })
  ],
  [
    "This year",
    () => ({
      from: "now/y",
      to: "now/y"
    })
  ],
  [
    "This year so far",
    () => ({
      from: "now/y",
      to: "now"
    })
  ]
]);

export function timeRangeOptionsToAbsolute(
  input: TimeRangeOption
): Omit<TimeRangeAbsoluteOption, "type" | "display"> {
  if (input.type === "relative") {
    return {
      from: input.range,
      to: "now"
    };
  } else if (input.type === "mapped") {
    const timeRange = mappedOptionsTimeRanges.get(
      input.display as MappedOptionsDisplay
    );
    if (timeRange) {
      return timeRange();
    } else {
      throw new Error("Invalid mapped time range");
    }
  } else {
    return input;
  }
}
