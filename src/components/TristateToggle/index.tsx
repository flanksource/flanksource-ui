import { useState, useEffect, useCallback } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import style from "./index.module.css";

type Props = {
  onChange: (value: string) => void;
  value: string | number;
  label: Record<string, string>;
  labelClass?: string;
  hideLabel?: boolean;
  className?: string;
};

export function TristateToggle({
  onChange = (value: any) => {},
  value,
  label,
  labelClass,
  hideLabel,
  className
}: Props) {
  const states = [0, 1, -1];
  const colors = ["#e5e7eb", "#e05858", "#58b358"];
  const fgColors = ["#909090", "#fafafa", "#fafafa"];

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

  const updateButton = useCallback(
    (stateValue: string | number) => {
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
    },
    [colors, fgColors]
  );

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
        className="flex items-center relative justify-center min-w-[66px] min-h-[24px] overflow-hidden rounded-[40px] duration-200"
        style={{ backgroundColor: bgColor }}
      >
        <button
          type="button"
          onClick={() => {
            toggleState(-1);
          }}
          className={`flex justify-center items-center w-[22px] h-full duration-100`}
          title={`Exclude ${label.label}`}
        >
          <BiX style={{ color: fgColor, marginLeft: "4px" }} />
        </button>
        <button
          className={`flex justify-center items-center w-[22px] h-full duration-100`}
          type="button"
          title={`Do not filter ${label.label}`}
          onClick={() => {
            toggleState(0);
          }}
        >
          <BsDot style={{ color: fgColor }} />
        </button>
        <button
          type="button"
          onClick={() => {
            toggleState(1);
          }}
          className={`flex justify-center items-center w-[22px] h-full duration-100`}
          title={`Include ${label.label}`}
        >
          <BiCheck style={{ color: fgColor, marginRight: "4px" }} />
        </button>
        <div
          className={`${style.buttonInnerCircle}  ${
            position && style[position]
          }`}
        />
      </div>
      {states.map((state) => (
        <input
          name={label.id}
          onChange={(target) => onChange(target.target.value)}
          className="hidden"
          key={state}
          type="radio"
          value={stateValue}
          checked={state === stateValue}
        />
      ))}
      {label.label && !hideLabel && (
        <span
          className={`${labelClass || "ml-3 text-xs text-left text-gray-700"}`}
        >
          {label.label}
        </span>
      )}
    </div>
  );
}
