import { useSearchParams } from "react-router-dom";
import { Tabs } from "../../Canary/tabs";

export enum IncidentDetailsViewTypes {
  comments = "Comments",
  actionPlan = "Action Plan"
}

const TabsConfig = [
  {
    label: IncidentDetailsViewTypes.actionPlan,
    value: IncidentDetailsViewTypes.actionPlan
  },
  {
    label: IncidentDetailsViewTypes.comments,
    value: IncidentDetailsViewTypes.comments
  }
];

type HypothesisContainerProps = {
  onViewChange: (viewType: IncidentDetailsViewTypes) => void;
  viewType: IncidentDetailsViewTypes;
} & React.HTMLProps<HTMLDivElement>;

export function HypothesisContainer({
  viewType,
  onViewChange,
  children,
  ...rest
}: HypothesisContainerProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const onTabChange = (e: { label: string; value: string }) => {
    const value = e.value as IncidentDetailsViewTypes;
    onViewChange(value);
    if (
      value === IncidentDetailsViewTypes.comments &&
      !searchParams.get("comments")
    ) {
      searchParams.append("comments", "true");
    }
    setSearchParams(Object.fromEntries(searchParams.entries()));
  };

  return (
    <div {...rest}>
      <Tabs
        className="my-4"
        tabs={TabsConfig}
        value={viewType}
        onClick={onTabChange}
      />
      {children}
    </div>
  );
}
