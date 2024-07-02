import { HealthCheck } from "@flanksource-ui/api/types/health";
import { reduce } from "lodash";
import { getPercentage } from "./utils";

// if all check icons are similar in a given iconList, use that icon.
// if there are different icons, use a icon that indicate 'mixing'.
function aggregateIcon(iconList?: string[]) {
  iconList = (iconList ?? []).filter((icon) => icon !== "");
  if (iconList.length === 0) {
    return null;
  }
  let icon = iconList[0];
  for (let i = 0; i < iconList.length; i += 1) {
    if (iconList[i] !== icon) {
      icon = "multiple";
      break;
    }
  }
  return icon;
}

// if all check types are similar in a given typeList, use that type.
// if there are different types, use a type that indicate 'mixing'.
function aggregateType(typeList: string[]) {
  typeList = typeList.filter((type) => type !== "");
  if (typeList.length === 0) {
    return null;
  }
  let type = typeList[0];
  for (let i = 0; i < typeList.length; i += 1) {
    if (typeList[i] !== type) {
      type = "multiple";
      break;
    }
  }
  return type;
}

// calculate the average health of all checks with valid statuses
// returns a simplified list of statuses that indicates the overall health.
function aggregateStatuses(statusLists?: { status?: string }[]) {
  let allFail = true,
    allPass = true,
    mixed;
  statusLists?.forEach((item) => {
    allFail = allFail && item.status === "unhealthy";
  });

  statusLists?.forEach((item) => {
    allPass = allPass && item.status === "healthy";
  });

  mixed = !allFail && !allPass;

  return {
    good: allPass,
    mixed
  };
}

// The uptime for a group, is defined as the minimum uptime with the group
// eslint-disable-next-line no-unused-vars
function minUptime(items: { uptime: { passed: number; failed: number } }[]) {
  return reduce(
    items,
    (old: any, item: any) => {
      if (getPercentage(old.uptime)! > getPercentage(item.uptime)!) {
        return item;
      }
      return old;
    },
    { passed: 0, failed: 0 }
  );
}

// The uptime for a group, is defined as the minimum uptime with the group
function sumUptime(items: { uptime: { passed: number; failed: number } }[]) {
  return reduce(
    items,
    (old, item) => {
      old.passed += item.uptime?.passed;
      old.failed += item.uptime?.failed;
      return old;
    },
    { passed: 0, failed: 0 }
  );
}

function avgLatency(items: { latency: { rolling1h: number } }[]) {
  const total = reduce(items, (sum, i) => sum + i.latency?.rolling1h, 0);
  return total / items.length;
}

export function aggregate(title: string, items: HealthCheck[]) {
  if (items == null) {
    return {};
  }
  return {
    description: title,
    icon: aggregateIcon(items.map((item) => item.icon!)),
    latency: {
      rolling1h: avgLatency(items)
    },
    uptime: sumUptime(items),
    status: {
      good: aggregateStatuses(items).good,
      mixed: aggregateStatuses(items).mixed
    },
    type: aggregateType(items.map((item) => item.type)),
    namespaces: [...new Set(items.map((item) => item.namespace))]
  };
}

export const getAggregatedGroupedChecks = (
  groupedChecks: Record<string, HealthCheck[]> | undefined,
  groupSingleItems = true
) => {
  const aggregatedValue = Object.entries(groupedChecks ?? {}).reduce(
    (acc, [k, v]) => {
      if (groupSingleItems || v.length > 1) {
        const aggregated = {
          ...aggregate(k, v),
          isAggregate: true,
          subRows: v,
          name: k
        };
        acc[k] = aggregated as any;
      } else if (v.length > 0) {
        const check = v[0];
        acc[k] = check;
      }
      return acc;
    },
    {} as Record<string, HealthCheck>
  );
  return aggregatedValue;
};
