import React, { useEffect, useMemo, useState } from "react";
import { ActionLink } from "../ActionLink/ActionLink";
import clsx from "clsx";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { usePartialUpdateSearchParams } from "../../hooks/usePartialUpdateSearchParams";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { EvidenceType } from "../../api/services/evidence";
import { MdAlarmAdd } from "react-icons/md";

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
  const [attachAsEvidence, setAttachAsEvidence] = useState(false);
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
        obj[key] = configDetails.config[key];
        return obj;
      }, {});

    return configDetails?.config && JSON.stringify(ordered, null, 2);
  }, [configDetails]);

  const configLines = useMemo(() => code && code.split("\n"), [code]);

  return (
    <div
      className={clsx("flex flex-wrap justify-between py-4 px-1", className)}
      {...props}
    >
      <ActionLink
        text="Link to incident"
        icon={<MdAlarmAdd />}
        onClick={() => {
          setAttachAsEvidence(true);
        }}
      />
      <AttachEvidenceDialog
        key={`attach-evidence-dialog`}
        isOpen={attachAsEvidence}
        onClose={() => setAttachAsEvidence(false)}
        config_id={configId}
        evidence={{
          lines: configLines,
          configName: configDetails?.name,
          configType: configDetails?.config_type,
          selected_lines: Object.fromEntries(
            Object.keys(checked).map((n) => [n, configLines[n]])
          )
        }}
        type={EvidenceType.Config}
        callback={(_: any) => {
          setChecked({});
        }}
      />
    </div>
  );
}
