import dayjs from "dayjs";

type TimeRangeRelativeOption = {
  type: "relative";
  display: string;
  durationInSeconds: number;
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
  options: TimeRangeOption[];
};

export const displayTimeFormat = "YYYY-MM-DD HH:mm";

export const rangeOptionsCategories: RangeOptionsCategory[] = [
  {
    name: "Relative time ranges",
    options: [
      {
        type: "relative",
        display: "5 minutes",
        durationInSeconds: dayjs.duration(5, "minute").asSeconds()
      },
      {
        display: "15 minutes",
        type: "relative",
        durationInSeconds: dayjs.duration(15, "minute").asSeconds()
      },
      {
        display: "30 minutes",
        type: "relative",
        durationInSeconds: dayjs.duration(30, "minute").asSeconds()
      },
      {
        display: "1 hour",
        type: "relative",
        durationInSeconds: dayjs.duration(1, "hour").asSeconds()
      },
      {
        display: "3 hours",
        type: "relative",
        durationInSeconds: dayjs.duration(3, "hour").asSeconds()
      },
      {
        display: "6 hours",
        type: "relative",
        durationInSeconds: dayjs.duration(6, "hour").asSeconds()
      },
      {
        display: "12 hours",
        type: "relative",
        durationInSeconds: dayjs.duration(12, "hour").asSeconds()
      },
      {
        display: "24 hours",
        type: "relative",
        durationInSeconds: dayjs.duration(24, "hour").asSeconds()
      },
      {
        display: "2 days",
        type: "relative",
        durationInSeconds: dayjs.duration(2, "day").asSeconds()
      },
      {
        display: "7 days",
        type: "relative",
        durationInSeconds: dayjs.duration(7, "day").asSeconds()
      },
      {
        display: "30 days",
        type: "relative",
        durationInSeconds: dayjs.duration(30, "day").asSeconds()
      },
      {
        display: "90 days",
        type: "relative",
        durationInSeconds: dayjs.duration(90, "day").asSeconds()
      },
      {
        display: "6 months",
        type: "relative",
        durationInSeconds: dayjs.duration(6, "month").asSeconds()
      },
      {
        display: "1 year",
        type: "relative",
        durationInSeconds: dayjs.duration(1, "year").asSeconds()
      },
      {
        display: "2 year",
        type: "relative",
        durationInSeconds: dayjs.duration(2, "year").asSeconds()
      },
      {
        display: "5 year",
        type: "relative",
        durationInSeconds: dayjs.duration(5, "year").asSeconds()
      }
    ]
  },
  {
    name: "Other quick ranges",
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
      from: dayjs().subtract(1, "day").startOf("day").toISOString(),
      to: dayjs().subtract(1, "day").endOf("day").toISOString()
    })
  ],
  [
    "Day before yesterday",
    () => ({
      from: dayjs().subtract(2, "day").startOf("day").toISOString(),
      to: dayjs().subtract(2, "day").endOf("day").toISOString()
    })
  ],
  [
    "This day last week",
    () => ({
      from: dayjs().subtract(1, "week").startOf("day").toISOString(),
      to: dayjs().subtract(1, "week").endOf("day").toISOString()
    })
  ],
  [
    "Previous week",
    () => ({
      from: dayjs().subtract(1, "week").startOf("week").toISOString(),
      to: dayjs().subtract(1, "week").endOf("week").toISOString()
    })
  ],
  [
    "Previous month",
    () => ({
      from: dayjs().subtract(1, "month").startOf("month").toISOString(),
      to: dayjs().subtract(1, "month").endOf("month").toISOString()
    })
  ],
  [
    "Previous year",
    () => ({
      from: dayjs().subtract(1, "year").startOf("year").toISOString(),
      to: dayjs().subtract(1, "year").endOf("year").toISOString()
    })
  ],
  [
    "Today",
    () => ({
      from: dayjs().startOf("day").toISOString(),
      to: dayjs().endOf("day").toISOString()
    })
  ],
  [
    "Today so far",
    () => ({
      from: dayjs().startOf("day").toISOString(),
      to: dayjs().toISOString()
    })
  ],
  [
    "This week",
    () => ({
      from: dayjs().startOf("week").toISOString(),
      to: dayjs().endOf("week").toISOString()
    })
  ],
  [
    "This week so far",
    () => ({
      from: dayjs().startOf("week").toISOString(),
      to: dayjs().toISOString()
    })
  ],
  [
    "This month",
    () => ({
      from: dayjs().startOf("month").toISOString(),
      to: dayjs().endOf("month").toISOString()
    })
  ],
  [
    "This month so far",
    () => ({
      from: dayjs().startOf("month").toISOString(),
      to: dayjs().toISOString()
    })
  ],
  [
    "This year",
    () => ({
      from: dayjs().startOf("year").toISOString(),
      to: dayjs().endOf("year").toISOString()
    })
  ],
  [
    "This year so far",
    () => ({
      from: dayjs().startOf("year").toISOString(),
      to: dayjs().toISOString()
    })
  ]
]);

export function timeRangeOptionsToAbsolute(
  input: TimeRangeOption
): Omit<TimeRangeAbsoluteOption, "type" | "display"> {
  if (input.type === "relative") {
    const from = dayjs().subtract(input.durationInSeconds, "second");
    const to = dayjs();
    return {
      from: from.toISOString(),
      to: to.toISOString()
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
