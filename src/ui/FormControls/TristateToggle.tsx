import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import { BsDot } from "react-icons/bs";

type Props = {
  onChange: (value: string) => void;
  value: string | number;
  label?: Record<string, string>;
  labelClass?: string;
  hideLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const states = [0, 1, -1];
const colors = ["#e5e7eb", "#e05858", "#58b358"];
const fgColors = ["#909090", "#fafafa", "#fafafa"];

export function TristateToggle({
  onChange = (value: any) => {},
  value,
  label,
  labelClass,
  hideLabel,
  className,
  size = "md"
}: Props) {
  const sizeClassNames =
    size === "sm" ? "w-3 h-3" : size === "md" ? "w-5 h-5" : "w-6 h-6";

  const indicatorPositionTransitionSize =
    size === "sm" ? "17px" : size === "md" ? "21px" : "26px";

  const containerSizeClassNames =
    size === "sm"
      ? "min-w-[40px] min-h-[16px]"
      : size === "md"
        ? "min-w-[66px] min-h-[24px]"
        : "min-w-[90px] min-h-[32px]";

  const [stateValue, setValue] = useState(value || states[0]);
  const [position, setPosition] = useState<string>();
  const [bgColor, setBgColor] = useState(colors[0]);
  const [fgColor, setFgColor] = useState(fgColors[0]);

  useEffect(() => {
    updateButton(stateValue);
    if (value !== null) {
      setValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const updateButton = useCallback((stateValue: string | number) => {
    // map and update position, bgColor, and tooltip text
    let pos;
    let colorIndex;
    switch (+stateValue) {
      case -1:
        pos = "left";
        colorIndex = 1;
        break;
      case 1:
        pos = "right";
        colorIndex = 2;
        break;
      default:
        pos = undefined;
        colorIndex = 0;
    }
    setPosition(pos);
    setBgColor(colors[colorIndex]);
    setFgColor(fgColors[colorIndex]);
  }, []);

  const toggleState = useCallback(
    (value: string | number) => {
      if (value === stateValue) {
        setValue(0);
      } else {
        setValue(value);
      }
      onChange(typeof value === "number" ? value.toString() : value);
      updateButton(value);
    },
    [onChange, stateValue, updateButton]
  );

  return (
    <div className={`${className} flex`}>
      <div
        className={`relative flex items-center justify-center ${containerSizeClassNames} overflow-hidden rounded-[40px] duration-200`}
        style={{ backgroundColor: bgColor }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleState(-1);
          }}
          className={`flex h-full flex-1 items-center justify-center duration-100`}
          title={`Exclude ${label?.label}`}
        >
          <BiX style={{ color: fgColor, marginLeft: "4px" }} />
        </button>
        <button
          className={`flex h-full flex-1 items-center justify-center duration-100`}
          type="button"
          title={`Do not filter ${label?.label}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleState(0);
          }}
        >
          <BsDot style={{ color: fgColor }} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleState(1);
          }}
          className={`flex h-full flex-1 items-center justify-center duration-100`}
          title={`Include ${label?.label}`}
        >
          <BiCheck style={{ color: fgColor, marginRight: "4px" }} />
        </button>
        <div
          className={clsx(
            `absolute ${sizeClassNames} pointer-events-none transform rounded-full bg-white shadow-md transition-transform duration-150`
          )}
          style={{
            ...(position === "left" && {
              transform: `translateX(-${indicatorPositionTransitionSize})`
            }),
            ...(position === "right" && {
              transform: `translateX(${indicatorPositionTransitionSize})`
            }),
            ...(!position && { transform: "translateX(0)" })
          }}
        />
      </div>
      {states.map((state) => (
        <input
          name={label?.id}
          onChange={(target) => onChange(target.target.value)}
          className="hidden"
          key={state}
          type="radio"
          value={stateValue}
          checked={state === stateValue}
        />
      ))}
      {label?.label && !hideLabel && (
        <span
          className={`${labelClass || "ml-3 text-left text-xs text-gray-700"}`}
        >
          {label.label}
        </span>
      )}
    </div>
  );
}
