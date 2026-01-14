import { useGetConfigByIdQuery } from "@flanksource-ui/api/query-hooks";
import { EvidenceType } from "@flanksource-ui/api/types/evidence";
import { usePartialUpdateSearchParams } from "@flanksource-ui/hooks/usePartialUpdateSearchParams";
import { ActionLink } from "@flanksource-ui/ui/Buttons/ActionLink";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { MdAlarmAdd } from "react-icons/md";
import AttachAsEvidenceButton from "../../Incidents/AttachEvidenceDialog/AttachAsEvidenceDialogButton";

type ConfigActionBarProps = {
  configId: string;
} & React.HTMLProps<HTMLDivElement>;

export default function ConfigActionBar({
  configId,
  className,
  ...props
}: ConfigActionBarProps) {
  const [searchParams] = usePartialUpdateSearchParams();
  const [checked, setChecked] = useState<Record<string, any>>({});
  const { data: configDetails } = useGetConfigByIdQuery(configId);

  useEffect(() => {
    if (!configDetails?.config) {
      return;
    }
    const selected = searchParams.getAll("selected");
    setChecked(Object.fromEntries(selected.map((x) => [x, true])));
  }, [searchParams, configDetails]);

  const code = useMemo(() => {
    if (!configDetails?.config) {
      return "";
    }
    if (configDetails?.config?.content != null) {
      return configDetails?.config.content;
    }

    const ordered = Object.keys(configDetails.config)
      .sort()
      .reduce((obj: Record<string, any>, key) => {
        obj[key] = configDetails.config ? [key] : null;
        return obj;
      }, {});

    return configDetails?.config && JSON.stringify(ordered, null, 2);
  }, [configDetails]);

  const configLines = useMemo(() => code && code.split("\n"), [code]);

  return (
    <div
      className={clsx("flex flex-row justify-between py-2", className)}
      {...props}
    >
      <AttachAsEvidenceButton
        config_id={configId}
        evidence={{
          lines: configLines,
          configName: configDetails?.name,
          configType: configDetails?.type,
          selected_lines: Object.fromEntries(
            Object.keys(checked).map((n) => [n, configLines[n]])
          )
        }}
        type={EvidenceType.Config}
        buttonComponent={({ onClick, disabled: _ }) => {
          return (
            <ActionLink
              text="Link to incident"
              icon={<MdAlarmAdd />}
              onClick={() => onClick()}
            />
          );
        }}
        callback={(_: any) => {
          setChecked({});
        }}
      />
    </div>
  );
}
