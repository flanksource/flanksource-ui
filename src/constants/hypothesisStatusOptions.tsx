import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { HypothesisStatus } from "../api/services/hypothesis";

const { Proven, Likely, Possible, Unlikely, Improbable, Disproven } =
  HypothesisStatus;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const hypothesisStatusIconMap = {
  [Proven]: {
    Icon: ({ className, ...props }) => (
      <ThumbUpIcon
        className={clsx("text-bright-green", className)}
        {...props}
      />
    )
  },
  [Likely]: {
    Icon: ({ className, ...props }) => (
      <ThumbUpIcon className={clsx("text-warm-green", className)} {...props} />
    )
  },
  [Possible]: {
    Icon: ({ className, ...props }) => (
      <ThumbUpIcon className={clsx("text-warmer-gray", className)} {...props} />
    )
  },
  [Unlikely]: {
    Icon: ({ className, ...props }) => (
      <ThumbDownIcon
        className={clsx("text-warmer-gray", className)}
        {...props}
      />
    )
  },
  [Improbable]: {
    Icon: ({ className, ...props }) => (
      <ThumbDownIcon
        className={clsx("text-bright-orange", className)}
        {...props}
      />
    )
  },
  [Disproven]: {
    Icon: ({ className, ...props }) => (
      <ThumbDownIcon
        className={clsx("text-bright-red", className)}
        {...props}
      />
    )
  }
};

export const hypothesisStatusOptions = Object.values(HypothesisStatus).map(
  (name) =>
    console.log(name, hypothesisStatusIconMap[name]) || {
      title: capitalize(name),
      value: name.toLowerCase(),
      ...hypothesisStatusIconMap[name]
    }
);

export const hypothesisStatusDropdownOptions = Object.fromEntries(
  hypothesisStatusOptions.map(({ Icon, ...o }) => [
    o.value,
    {
      id: `dropdown-${o.value}`,
      name: o.title,
      iconTitle: <Icon style={{ width: "24px" }} className="drop-shadow" />,
      icon: <Icon style={{ width: "20px" }} className="drop-shadow" />,
      description: o.title,
      value: o.value
    }
  ])
);
