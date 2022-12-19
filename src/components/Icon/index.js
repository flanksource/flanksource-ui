import { isEmpty } from "lodash";
import { GoDiff } from "react-icons/go";
import { Icons } from "../../icons";

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
  oipa: "oracle_icon",
  cost: "dollar",
  File: "cfg",
  memory: "mem",
  MSPlanner: "msplanner"
};

const reactIcons = {
  diff: GoDiff
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
  if (icon == null) {
    console.warn("Icon not found: " + name);
  }
  return icon;
}

export function Icon({
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
  if (reactIcons[secondary]) {
    let Icon = reactIcons[secondary];
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
export function Avatar({ url, alt = "" }) {
  return (
    <img
      className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
      src={url}
      alt={alt}
    />
  );
}
