import { useParams } from "react-router-dom";

export const configTabsLists = [
  { label: "Catalog", path: "/catalog" },
  { label: "Changes", path: "/catalog/changes" },
  { label: "Insights", path: "/catalog/insights" }
];

export function useConfigDetailsTabs() {
  const { id } = useParams<{ id: string }>();

  return [
    { label: "Catalog", path: `/catalog/${id}` },
    { label: "Changes", path: `/catalog/${id}/changes` },
    { label: "Insights", path: `/catalog/${id}/insights` }
  ];
}
