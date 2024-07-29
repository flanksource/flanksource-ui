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
  id,
  onFilterByTag,
  ...props
}: TagProps) {
  return (
    <>
      <div
        data-tooltip-id={`${id}-${tag?.key}-${tag?.value}`}
        data-tooltip-delay-show={100}
        className={clsx(
          className,
          variant === "gray" && "bg-gray-100 text-gray-600",
          variant === "blue" && "bg-blue-100 text-blue-800"
        )}
        {...props}
      >
        {children}
      </div>
      {tag && (
        <Tooltip
          id={`${id}-${tag.key}-${tag.value}`}
          className="z-[999999] bg-gray-400"
          clickable
        >
          <div className="flex flex-col gap-1">
            <p className="flex-1">
              {tag.key}: {tag.value}
            </p>
            {onFilterByTag && tag && (
              <div className="flex flex-row justify-center gap-1 px-1">
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
        </Tooltip>
      )}
    </>
  );
}
