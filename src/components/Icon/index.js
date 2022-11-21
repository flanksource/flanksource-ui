import { isEmpty } from "lodash";
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
  oipa: "oracle_icon",
  cost: "dollar",
  File: "cfg",
  memory: "mem",
  MSPlanner: "msplanner"
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
  size = "sm",
  name,
  secondary = "", // If icon by name is not found, try the secondary (fallthrough) name
  className = "",
  alt = "",
  ...props
}) {
  if (isEmpty(name) && isEmpty(secondary)) {
    return null;
  }
  if (isEmpty(className)) {
    className = "max-w-5 max-h-5";
  }
  if (
    name != null &&
    (name.startsWith("http:") || name.startsWith("https://"))
  ) {
    props.icon = name;
  } else if (!isEmpty(name) || !isEmpty(secondary)) {
    props.icon = findByName(name);
    if (props.icon == null) {
      props.icon = findByName(secondary);
    }
  }

  const src = typeof props.icon?.src === "string" ? props.icon.src : props.icon;

  if (src) {
    return (
      <img
        alt={alt}
        src={src}
        className={`inline-block object-center ${className}`}
      />
    );
  }

  return props.icon ? <props.icon className={className} /> : null;
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
