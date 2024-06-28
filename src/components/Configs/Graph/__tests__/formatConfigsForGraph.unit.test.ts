import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { prepareConfigsForGraph } from "../formatConfigsForGraph";
import { applicationSetController } from "./mocks/argo-argocd-applicationset-controller";
import { argoArgocdNotificationsController } from "./mocks/argo-argocd-notifications-controller";

// Test data for ConfigRelationships
const configs: Pick<
  ConfigItem,
  | "id"
  | "related_ids"
  | "type"
  | "health"
  | "deleted_at"
  | "name"
  | "status"
  | "tags"
>[] = [
  {
    id: "1",
    related_ids: ["2"],
    name: "config1",
    status: "active",
    type: "type1"
  },
  {
    id: "2",
    related_ids: ["3"],
    name: "config2",
    type: "type2"
  },
  {
    id: "3",
    related_ids: ["1"],
    name: "config3",
    type: "type3"
  },
  {
    id: "4",
    related_ids: ["1"],
    type: "type4",
    name: "config-current"
  }
];

test("prepareConfigsForGraph should return transformedConfigs", () => {
  const res = prepareConfigsForGraph(configs);
  expect(res).toMatchInlineSnapshot(`
    [
      {
        "childrenCount": 0,
        "data": {
          "config": {
            "id": "1",
            "name": "config1",
            "related_ids": [
              "2",
            ],
            "status": "active",
            "type": "type1",
          },
          "type": "config",
        },
        "expanded": false,
        "nodeId": "1",
        "related_ids": [
          "2",
        ],
      },
      {
        "childrenCount": 0,
        "data": {
          "config": {
            "id": "2",
            "name": "config2",
            "related_ids": [
              "3",
            ],
            "type": "type2",
          },
          "type": "config",
        },
        "expanded": false,
        "nodeId": "2",
        "related_ids": [
          "3",
        ],
      },
      {
        "childrenCount": 0,
        "data": {
          "config": {
            "id": "3",
            "name": "config3",
            "related_ids": [
              "1",
            ],
            "type": "type3",
          },
          "type": "config",
        },
        "expanded": false,
        "nodeId": "3",
        "related_ids": [
          "1",
        ],
      },
      {
        "childrenCount": 0,
        "data": {
          "config": {
            "id": "4",
            "name": "config-current",
            "related_ids": [
              "1",
            ],
            "type": "type4",
          },
          "type": "config",
        },
        "expanded": false,
        "nodeId": "4",
        "related_ids": [
          "1",
        ],
      },
    ]
  `);
});

test("prepareConfigsForGraph should return formatted config for argo-argocd-notifications-controller", () => {
  const res = prepareConfigsForGraph(argoArgocdNotificationsController as any);
  // should add an intermediary node and a root node
  expect(res.length).toEqual(argoArgocdNotificationsController.length + 1);
  expect(res).toMatchSnapshot();
});

test("prepareConfigsForGraph should return formatted config for argo-argocd-applicationset-controller-764547bfd6", () => {
  const res = prepareConfigsForGraph(applicationSetController as any);
  // should add an intermediary node and a root node
  expect(res.length).toEqual(argoArgocdNotificationsController.length + 1);
  expect(res).toMatchSnapshot();
});
