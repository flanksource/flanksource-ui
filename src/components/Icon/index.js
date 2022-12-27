import { isEmpty } from "lodash";
import { GoDiff } from "react-icons/go";
import { Icons } from "../../icons";
import { memo } from "react";

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
};

const reactIcons = {
  diff: GoDiff
};

const prefixes = {
  helm: "helm",
  git: "git",
  grafana: "grafana",
  prometheus: "prometheus",
  operator: "operatorframework"
};

function findByName(name) {
  if (isEmpty(name)) {
    return null;
  }
  if (aliases[name]) {
    name = aliases[name];
  }
  name = name.replaceAll("::", "-").replaceAll("--", "-").toLowerCase();
  if (aliases[name]) {
    name = aliases[name];
  }
  var icon = Icons[name.toLowerCase()];
  if (icon == null) {
    icon = Icons["aws-" + name];
  }
  if (icon == null) {
    icon = Icons["azure-" + name];
  }
  if (icon == null) {
    icon = Icons["k8s-" + name];
  }

  for (let prefix in prefixes) {
    if (name.toLowerCase().startsWith(prefix)) {
      icon = Icons[prefixes[prefix]];
    }
  }
  if (icon == null) {
    console.warn("Icon not found: " + name);
  }
  return icon;
}

function icon({
  name,
  secondary = "", // If icon by name is not found, try the secondary (fallthrough) name
  className = "",
  alt = "",
  icon = "",
  ...props
}) {
  if (isEmpty(name) && isEmpty(secondary)) {
    return null;
  }
  if (isEmpty(className)) {
    className = "w-5 h-auto";
  }
  if (reactIcons[name]) {
    let Icon = reactIcons[name];
    return <Icon className={`inline-block object-center ${className}`} />;
  }

  if (
    name != null &&
    (name.startsWith("http:") || name.startsWith("https://"))
  ) {
    icon = name;
  } else if (!isEmpty(name) || !isEmpty(secondary)) {
    icon = findByName(name);
    if (icon == null) {
      icon = findByName(secondary);
    }
    if (icon == null && reactIcons[secondary]) {
      let Icon = reactIcons[secondary];
      return <Icon className={`inline-block object-center ${className}`} />;
    }
  }

  const src = typeof icon?.src === "string" ? icon.src : icon;

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

  return icon ? <icon className={className} {...props} /> : null;
}

export const Icon = memo(icon);

export function Avatar({ url, alt = "" }) {
  return (
    <img
      className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
      src={url}
      alt={alt}
    />
  );
}
