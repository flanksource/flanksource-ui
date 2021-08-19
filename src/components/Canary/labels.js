import Badge from "../Badge";

export function Labels({ labels }) {
  if (labels == null) {
    return null;
  }
  var items = [];
  for (var k in labels) {
    if (labels[k] == "true") {
      items.push(
        <div key={`${k}`}>
          <Badge text={k} />{" "}
        </div>
      );
    } else {
      items.push(
        <div key={`${k}-${labels[k]}`}>
          <Badge text={`${k}: ${labels[k]}`} />{" "}
        </div>
      );
    }
  }
  return items;
}

export function getLabels(checks) {
  if (checks == null || typeof checks[Symbol.iterator] !== "function") {
    console.error("unknown check format", checks);
    return [];
  }
  var labelMap = {};
  for (const check of checks) {
    if (check.labels) {
      for (let k in check.labels) {
        let v = check.labels[k];
        var id = `canary:${k}:${v}`;
        labelMap[id] = {
          type: "canary",
          id: id,
          key: k,
          value: v,
          label: `${k}: ${v}`,
        };
      }
    }
  }

  var labels = [];
  Object.values(labelMap).map((label) => {
    if (label.value == "true") {
      label.label = label.key;
    }
    labels.push(label);
  });
  return labels;
}
