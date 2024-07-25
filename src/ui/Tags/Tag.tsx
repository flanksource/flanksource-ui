import clsx from "clsx";
import {
  PiMagnifyingGlassMinusThin,
  PiMagnifyingGlassPlusThin
} from "react-icons/pi";
import { Tooltip } from "react-tooltip";
import { IconButton } from "../Buttons/IconButton";

type TagProps = React.HTMLProps<HTMLDivElement> & {
  variant?: "gray" | "blue";
  tag?: {
    key: string;
    value: string;
  };
  onFilterByTag?: (
    e: React.MouseEvent<HTMLButtonElement>,
    tag: {
      key: string;
      value: string;
    },
    action: "include" | "exclude"
  ) => void;
};

export function Tag({
  children,
  className = "flex flex-row px-1 py-0.5 rounded-md text-xs whitespace-nowrap break-inside-avoid-column",
  variant = "gray",
  tag,
  onFilterByTag,
  ...props
}: TagProps) {
  return (
    <>
      <div
        data-tooltip-content={tag ? `${tag.key}: ${tag.value}` : undefined}
        data-tooltip-id={tag ? `${tag.key}-${tag.value}` : undefined}
        data-tooltip-class-name="z-[9999]"
        className={clsx(
          className,
          variant === "gray" && "bg-gray-100 text-gray-600",
          variant === "blue" && "bg-blue-100 text-blue-800",
          onFilterByTag && "group"
        )}
        {...props}
      >
        {children}
        {onFilterByTag && tag && (
          <div className="hidden flex-row gap-1 px-1 group-hover:flex">
            <IconButton
              onClick={(e) => onFilterByTag(e, tag, "include")}
              icon={<PiMagnifyingGlassPlusThin size={18} />}
              title="Include"
            />
            <IconButton
              onClick={(e) => onFilterByTag(e, tag, "exclude")}
              icon={<PiMagnifyingGlassMinusThin size={18} />}
              title="Exclude"
            />
          </div>
        )}
      </div>
      {tag && <Tooltip id={`${tag.key}-${tag.value}`} />}
    </>
  );
}
