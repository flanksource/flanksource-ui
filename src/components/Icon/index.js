import { isEmpty } from "lodash";
import React from "react";
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
    console.warn("Icon not found: " + name);
  }
  return icon;
}

export function Icon({
  size = "sm",
  name,
  secondary, // If icon by name is not found, try the secondary (fallthrough) name
  className = "",
  alt = "",
  ...props
}) {
  if (isEmpty(name) && isEmpty(secondary)) {
    return "";
  }
  let iconClassName;
  switch (size) {
    case "2xs":
      iconClassName = "h-3 w-3";
      break;
    case "2xsi":
      iconClassName = "h-3.5 w-3.5";
      break;
    case "xs":
      iconClassName = "h-3 w-3";
      break;
    case "sm":
      iconClassName = "h-4 w-4";
      break;
    case "md":
      iconClassName = "h-5 w-5";
      break;
    case "lg":
      iconClassName = "h-5 w-5";
      break;
    case "xl":
      iconClassName = "h-6 w-6";
      break;
    case "2xl":
      iconClassName = "h-8 w-8";
      break;
    default:
      iconClassName = "h-4 w-4";
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

  if (typeof props.icon === "string") {
    return (
      <img
        alt={alt}
        src={props.icon}
        className={`${props.iconClassName || iconClassName} ${className}`}
      />
    );
  }

  return props.icon ? <props.icon className={iconClassName} /> : null;
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
