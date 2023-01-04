import { isEmpty } from "lodash";
import { GoDiff } from "react-icons/go";
import { Icons } from "../../icons";
import React, { memo } from "react";

const aliases = {
  "AWS::EC2::Subnet": "network",
  "AWS::EC2::DHCPOptions": "settings",
  "AWS::Subnet": "network",
  "AWS::IAM::User": "user",
  "AWS::::Account": "aws",
  "AWS::Instance": "aws-ec2-instance",
  "AWS::ElasticLoadBalancing::LoadBalancer": "aws-elb",
  "AWS::ElasticLoadBalancingV2::LoadBalancer": "aws-alb",
  "AWS::Region": "aws",
  "AWS::EC2::SecurityGroup": "firewall",
  "AzureDevops::PipelineRun": "Azure::DevOps::Pipeline",
  "MSSQL::Database": "mssql",
  oipa: "oracle_icon",
  cost: "dollar",
  File: "cfg",
  memory: "mem",
  MSPlanner: "msplanner",
  deployment: "rocket",
  mutatingwebhookconfiguration: "webhook",
  validatingwebhookconfiguration: "webhook",
  installplan: "helm",
  csinode: "csi",
  csidriver: "csi",
  endpoints: "endpoint",
  alertmanager: "prometheus",
  servicemonitor: "prometheus",
  podmonitor: "prometheus",
  kibana: "elasticsearch",
  kustomization: "kustomize",
  catalogsource: "operatorframework",
  certificate: "cert-manager",
  clusterissuer: "cert-manager",
  issuer: "cert-manager",
  controllerrevision: "kubernetes",
  clusterservicerevision: "kubernetes"
} as const;

const reactIcons = {
  diff: GoDiff
} as const;

const prefixes = {
  helm: "helm",
  git: "git",
  grafana: "grafana",
  prometheus: "prometheus",
  operator: "operatorframework"
};

function findByName(name?: string) {
  if (isEmpty(name) || !name) {
    return undefined;
  }
  if (aliases[name as keyof typeof aliases]) {
    name = aliases[name as keyof typeof aliases];
  }
  name = name.replaceAll("::", "-").replaceAll("--", "-").toLowerCase();
  if (aliases[name as keyof typeof aliases]) {
    name = aliases[name as keyof typeof aliases];
  }
  var icon = Icons[name.toLowerCase() as keyof typeof Icons];
  if (icon == null) {
    icon = Icons[("aws-" + name) as keyof typeof Icons];
  }
  if (icon == null) {
    icon = Icons[("azure-" + name) as keyof typeof Icons];
  }
  if (icon == null) {
    icon = Icons[("k8s-" + name) as keyof typeof Icons];
  }

  for (let prefix in prefixes) {
    if (name.toLowerCase().startsWith(prefix)) {
      icon =
        Icons[prefixes[prefix as keyof typeof prefixes] as keyof typeof Icons];
    }
  }
  if (icon == null) {
    console.warn("Icon not found: " + name);
  }
  return icon;
}

type IconProps = {
  name?: string;
  secondary?: string;
  className?: string;
  alt?: string;
  icon?: string | { src: string };
};

export const Icon: React.FC<IconProps> = memo(
  ({
    name,
    secondary = "", // If icon by name is not found, try the secondary (fallthrough) name
    className = "w-5 h-auto",
    alt = "",
    icon,
    ...props
  }) => {
    console.log("Icon 1", name);

    if (isEmpty(name) && isEmpty(secondary)) {
      return null;
    }

    if (reactIcons[name as keyof typeof reactIcons]) {
      const Icon = reactIcons[name as keyof typeof reactIcons];
      return <Icon className={`inline-block object-center ${className}`} />;
    }

    console.log("Icon", name);

    if (name && (name.startsWith("http:") || name.startsWith("https://"))) {
      icon = name;
    } else if (!isEmpty(name) || !isEmpty(secondary)) {
      icon = findByName(name);
      if (icon == null) {
        icon = findByName(secondary);
      }
      if (icon == null && reactIcons[secondary as keyof typeof reactIcons]) {
        const Icon = reactIcons[secondary as keyof typeof reactIcons];
        return <Icon className={`inline-block object-center ${className}`} />;
      }
    }

    const src =
      typeof (icon as { src: string })?.src === "string"
        ? (icon as { src: string }).src
        : (icon as string);

    if (src) {
      return (
        <img
          alt={alt}
          src={src}
          className={`inline-block object-center ${className}`}
          {...props}
        />
      );
    }

    const Icon = icon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

    return icon ? <Icon className={className} {...props} /> : null;
  }
);

type AvatarProps = {
  url: string;
  alt?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function Avatar({ url, alt = "", ...props }: AvatarProps) {
  return (
    <img
      className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
      src={url}
      alt={alt}
      {...props}
    />
  );
}
