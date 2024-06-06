import {
  ConfigItem,
  ConfigRelationships
} from "@flanksource-ui/api/types/configs";
import { prepareConfigsForGraph } from "../formatConfigsForGraph";
import {
  applicationSetController,
  applicationSetControllerRootConfig
} from "./mocks/argo-argocd-applicationset-controller";
import {
  argoArgocdNotificationsController,
  argoArgocdNotificationsControllerRoot
} from "./mocks/argo-argocd-notifications-controller";

// Test data for ConfigRelationships
const configs: Pick<
  ConfigRelationships,
  "id" | "related_ids" | "direction" | "type"
>[] = [
  {
    id: "1",
    related_ids: ["2"],
    direction: "outgoing",
    type: "type1"
  },
  {
    id: "2",
    related_ids: ["3"],
    direction: "incoming",
    type: "type2"
  },
  {
    id: "3",
    related_ids: ["1"],
    direction: "outgoing",
    type: "type3"
  }
];

// Test data for ConfigItem
const currentConfig: Pick<ConfigItem, "id" | "related_ids" | "type"> = {
  id: "4",
  related_ids: ["1"],
  type: "type4"
};

test("prepareConfigsForGraph should return transformedConfigs", () => {
  const res = prepareConfigsForGraph(configs, currentConfig);
  expect(res).toMatchInlineSnapshot(`
    [
      {
        "config": {
          "direction": "outgoing",
          "id": "1",
          "related_ids": [
            "2",
          ],
          "type": "type1",
        },
        "nodeType": "config",
      },
      {
        "config": {
          "direction": "incoming",
          "id": "2",
          "related_ids": [
            "3",
          ],
          "type": "type2",
        },
        "nodeType": "config",
      },
      {
        "config": {
          "direction": "outgoing",
          "id": "3",
          "related_ids": [
            "1",
          ],
          "type": "type3",
        },
        "nodeType": "config",
      },
      {
        "config": {
          "id": "4",
          "related_ids": [
            "1",
          ],
          "type": "type4",
        },
        "nodeType": "config",
      },
    ]
  `);
});

test("prepareConfigsForGraph should return formatted config for argo-argocd-notifications-controller", () => {
  const res = prepareConfigsForGraph(
    argoArgocdNotificationsController,
    argoArgocdNotificationsControllerRoot
  );
  // should add an intermediary node and a root node
  expect(res.length).toEqual(argoArgocdNotificationsController.length + 2);
  expect(res).toMatchSnapshot();
});

test("prepareConfigsForGraph should return formatted config for argo-argocd-applicationset-controller-764547bfd6", () => {
  const res = prepareConfigsForGraph(
    applicationSetController,
    applicationSetControllerRootConfig
  );
  // should add an intermediary node and a root node
  expect(res.length).toEqual(argoArgocdNotificationsController.length + 2);
  expect(res).toMatchSnapshot();
});
