import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { MdAlarmAdd } from "react-icons/md";
import { useGetConfigByIdQuery } from "../../../api/query-hooks";
import { usePartialUpdateSearchParams } from "../../../hooks/usePartialUpdateSearchParams";
import { ActionLink } from "../../ActionLink/ActionLink";
import AttachAsEvidenceButton from "../../AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import PlaybooksDropdownMenu from "../../Playbooks/Runs/Submit/PlaybooksDropdownMenu";
import { EvidenceType } from "../../../api/types/evidence";

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
      className={clsx("flex flex-row justify-between px-1", className)}
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
      <PlaybooksDropdownMenu config_id={configId} />
    </div>
  );
}
