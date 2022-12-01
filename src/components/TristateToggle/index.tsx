import { useState, useEffect } from "react";
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

  useEffect(() => {
    // trigger onChange callback on stateValue change
    onChange(
      typeof stateValue === "number" ? stateValue.toString() : stateValue
    );
    updateButton(stateValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateValue]);

  function updateButton(stateValue: string | number) {
    // map and update position, bgColor, and tooltip text
    let pos;
    let colorIndex;
    switch (stateValue) {
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
  }

  return (
    <div className={`${className} flex`}>
      <div className={`${style.toggle}`} style={{ backgroundColor: bgColor }}>
        <button
          type="button"
          onClick={() => {
            setValue(-1);
            updateButton(stateValue);
          }}
          className={`${style.button} ${style.buttonLeft}`}
          title={`Exclude ${label.label}`}
        >
          <BiX style={{ color: fgColor, marginLeft: "4px" }} />
        </button>
        <button
          className={style.button}
          type="button"
          title={`Do not filter ${label.label}`}
          onClick={() => {
            setValue(0);
            updateButton(stateValue);
          }}
        >
          <BsDot style={{ color: fgColor }} />
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(1);
            updateButton(stateValue);
          }}
          className={`${style.button} ${style.buttonLeft}`}
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
