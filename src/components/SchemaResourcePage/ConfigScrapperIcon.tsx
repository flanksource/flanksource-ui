import { useMemo } from "react";
import { Icon } from "../../ui/Icons/Icon";

export const configSpecTypesIconMap = new Map<string, string>([
  ["kubernetes", "kubernetes"],
  ["azure", "azure"],
  ["kubernetesFile", "kubernetes"],
  ["sql", "database"],
  ["trivy", "trivy"],
  ["aws", "aws"],
  ["file", "folder"],
  ["githubActions", "github"],
  ["http", "http"],
  ["azureDevops", "azure-devops"],
  ["custom", "cog"]
]);

type Props = {
  spec: Record<string, any>;
};

export default function ConfigScrapperIcon({ spec }: Props) {
  const icon = useMemo(() => {
    for (let key of Object.keys(spec)) {
      let icon = configSpecTypesIconMap.get(key);
      if (icon != null) {
        return icon;
      }
    }
    return null;
  }, [spec]);

  if (!icon) {
    return null;
  }

  return <Icon name={icon} className="h-5 w-5" />;
}
