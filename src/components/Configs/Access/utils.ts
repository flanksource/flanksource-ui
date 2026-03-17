import {
  CATALOG_ACCESS_FLAT_TABLE_PREFIX,
  CATALOG_ACCESS_GROUP_CONFIG_TABLE_PREFIX,
  CATALOG_ACCESS_GROUP_USER_TABLE_PREFIX
} from "@flanksource-ui/hooks/useCatalogAccessUrlState";

export const paramsToReset = [
  "pageIndex",
  `${CATALOG_ACCESS_FLAT_TABLE_PREFIX}__pageIndex`,
  `${CATALOG_ACCESS_GROUP_USER_TABLE_PREFIX}__pageIndex`,
  `${CATALOG_ACCESS_GROUP_CONFIG_TABLE_PREFIX}__pageIndex`
];
