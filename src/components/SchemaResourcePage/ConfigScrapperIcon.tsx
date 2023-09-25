import { useMemo } from "react";
import { Icon } from "../Icon";

export const configSpecTypesIconMap = new Map<string, string>([
  ["kubernetes", "kubernetes"],
  ["azure", "azure"],
  ["kubernetesFile", "kubernetes"],
  ["sql", "sql"],
  ["trivy", "trivy"],
  ["aws", "aws"],
  ["file", "folder"],
  ["githubActions", "git"],
  ["http", "http"],
  ["azureDevops", "azure-devops"],
  ["custom", "cog"]
]);

type Props = {
  spec: Record<string, any>;
};

export default function ConfigScrapperIcon({ spec }: Props) {
  const icon = useMemo(() => {
    const keys = Object.keys(spec);
    const specKeys = keys.find((key) => typeof spec[key] === "object");
    return configSpecTypesIconMap.get(specKeys ?? "");
  }, [spec]);

  if (!icon) {
    return null;
  }

  return <Icon name={icon} className="w-5 h-5" />;
}
