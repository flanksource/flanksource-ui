import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { ComponentProps } from "react";
import { HypothesisStatus } from "../api/services/hypothesis";

const { Proven, Likely, Possible, Unlikely, Improbable, Disproven } =
  HypothesisStatus;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Props extends ComponentProps<"svg"> {}

export const hypothesisStatusIconMap = {
  [Proven]: {
    Icon: (props: Props) => <ThumbUpIcon {...props} />,
    className: "text-bright-green"
  },
  [Likely]: {
    Icon: (props: Props) => <ThumbUpIcon {...props} />,
    className: "text-warm-green"
  },
  [Possible]: {
    Icon: (props: Props) => <ThumbUpIcon {...props} />,
    className: "text-warmer-gray"
  },
  [Unlikely]: {
    Icon: (props: Props) => <ThumbDownIcon {...props} />,
    className: "text-warmer-gray"
  },
  [Improbable]: {
    Icon: (props: Props) => <ThumbDownIcon {...props} />,
    className: "text-bright-orange"
  },
  [Disproven]: {
    Icon: (props: Props) => <ThumbDownIcon {...props} />,
    className: "text-bright-red"
  }
};

export const hypothesisStatusOptions = Object.values(HypothesisStatus).map(
  (name) => ({
    title: capitalize(name),
    value: name.toLowerCase(),
    ...hypothesisStatusIconMap[name]
  })
);

export const hypothesisStatusDropdownOptions = Object.fromEntries(
  hypothesisStatusOptions.map(({ Icon, ...o }) => [
    o.value,
    {
      name: o.title,
      iconTitle: (
        <Icon
          style={{ width: "24px" }}
          className={clsx(o.className, "drop-shadow")}
        />
      ),
      icon: (
        <Icon
          style={{ width: "20px" }}
          className={clsx(o.className, "drop-shadow")}
        />
      ),
      description: o.title,
      value: o.value
    }
  ])
);
