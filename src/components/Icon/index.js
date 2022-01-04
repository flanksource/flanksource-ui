import { Icons } from "../../icons";

export function Icon({ size = "sm", name, className, alt = "", ...props }) {
  let iconClassName;
  switch (size) {
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
  } else if (name !== "") {
    props.icon = Icons[name];
  }

  if (typeof props.icon === "string") {
    return (
      <img
        alt={alt}
        src={props.icon}
        className={`${iconClassName} ${className}`}
      />
    );
  }

  return <>{props.icon ? <props.icon className={iconClassName} /> : null}</>;
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
