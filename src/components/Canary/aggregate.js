import { reduce } from "lodash";
import { getPercentage } from "./utils";

// if all check icons are similar in a given iconList, use that icon.
// if there are different icons, use a icon that indicate 'mixing'.
function aggregateIcon(iconList) {
  iconList = iconList.filter((icon) => icon !== "");
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
function aggregateType(typeList) {
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
function aggregateStatuses(statusLists) {
  const count = reduce(
    statusLists,
    (sum, i) => Math.max(sum, i == null ? 0 : i.length),
    0
  );

  const aggregated = [];
  for (let i = 0; i < count; i += 1) {
    const allPass = reduce(
      statusLists,
      (sum, list) =>
        sum && list != null && list.length >= i && list[i] && list[i].status,
      true
    );
    const allFail = reduce(
      statusLists,
      (sum, list) =>
        sum && list != null && list.length >= i && list[i] && !list[i].status,
      true
    );
    if (allPass) {
      aggregated.push({
        id: aggregated.length,
        status: true
      });
    } else if (allFail) {
      aggregated.push({
        id: aggregated.length,
        status: false
      });
    } else {
      aggregated.push({
        id: aggregated.length,
        mixed: true
      });
    }
  }
  return aggregated;
}

// The uptime for a group, is defined as the minimum uptime with the group
// eslint-disable-next-line no-unused-vars
function minUptime(items) {
  return reduce(
    items,
    (old, item) => {
      if (getPercentage(old.uptime) > getPercentage(item.uptime)) {
        return item;
      }
      return old;
    },
    { passed: 0, failed: 0 }
  );
}

// The uptime for a group, is defined as the minimum uptime with the group
function sumUptime(items) {
  return reduce(
    items,
    (old, item) => {
      old.passed += item.uptime.passed;
      old.failed += item.uptime.failed;
      return old;
    },
    { passed: 0, failed: 0 }
  );
}

function avgLatency(items) {
  const total = reduce(items, (sum, i) => sum + i.latency.rolling1h, 0);
  return total / items.length;
}

export function aggregate(title, items) {
  if (items == null) {
    return {};
  }
  // eslint-disable-next-line no-underscore-dangle
  let _title = title;
  if (items.length > 1) {
    _title += ` (${items.length})`;
  }
  return {
    description: _title,
    icon: aggregateIcon(items.map((item) => item.icon)),
    latency: {
      rolling1h: avgLatency(items)
    },
    uptime: sumUptime(items),
    checkStatuses: aggregateStatuses(items.map((item) => item.checkStatuses)),
    type: aggregateType(items.map((item) => item.type))
  };
}

export const getAggregatedGroupedChecks = (groupedChecks) =>
  Object.entries(groupedChecks).reduce((acc, [k, v]) => {
    acc[k] = {
      ...aggregate(k, v),
      subRows: v,
      name: k
    };
    return acc;
  }, {});
