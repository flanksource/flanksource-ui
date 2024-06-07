import { TristateToggle } from "@flanksource-ui/ui/FormControls/TristateToggle";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getConciseLabelState } from "../labels";
import { decodeUrlSearchParams, useUpdateParams } from "../url";

type TristateLabelStandaloneProps = {
  label: any;
  className?: string;
  labelClass?: string;
  hideLabel?: boolean;
};

export function TristateLabelStandalone({
  label,
  className,
  labelClass,
  ...props
}: TristateLabelStandaloneProps) {
  const location = useLocation();

  const { labels: urlLabelState = {} } = useMemo(() => {
    return decodeUrlSearchParams(location.search);
  }, [location.search]);

  const updateParams = useUpdateParams();

  const handleToggleChange = (v: any) => {
    const newState = { ...urlLabelState };
    newState[label.id] = v;
    const conciseLabelState = getConciseLabelState(newState);
    updateParams({ labels: conciseLabelState });
  };

  return (
    <TristateToggle
      value={urlLabelState[label.id]}
      onChange={(v: string | number) => handleToggleChange(v)}
      className={className}
      labelClass={labelClass}
      label={label}
      {...props}
    />
  );
}
