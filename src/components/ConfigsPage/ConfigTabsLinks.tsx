import { useParams } from "react-router-dom";

export const configTabsLists = [
  { label: "Config", path: "/configs" },
  { label: "Changes", path: "/configs/changes" },
  { label: "Insights", path: "/configs/insights" }
];

export function useConfigDetailsTabs() {
  const { id } = useParams<{ id: string }>();

  return [
    { label: "Config", path: `/configs/${id}` },
    { label: "Changes", path: `/configs/${id}/changes` },
    { label: "Insights", path: `/configs/${id}/insights` }
  ];
}
