export const OBJECTS = [
  "mcp",
  "canaries",
  "catalog",
  "application",
  "playbooks",
  "notification"
];

export const ACTIONS = [
  "read",
  "create",
  "update",
  "delete",
  "playbook:approve",
  "playbook:run"
];

export const getActionsForObject = (object: string) => {
  if (object === "playbooks") {
    return ACTIONS;
  }
  if (object === "mcp") {
    return ["*"];
  }

  // Only CRUD
  return ACTIONS.filter((action) => !action.startsWith("playbook:"));
};

// Generate all combos
export const getAllObjectActions = () => {
  return OBJECTS.flatMap((obj) =>
    getActionsForObject(obj).map((action) => `${obj}:${action}`)
  );
};
