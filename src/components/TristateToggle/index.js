import { useState, useEffect } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import style from "./index.module.css";

export function TristateToggle({ onChange, defaultValue, label, className }) {
  const states = [0, 1, -1];
  const colors = ["#e5e7eb", "#e05858", "#58b358"];
  const fgColors = ["#909090", "#fafafa", "#fafafa"];

  const [value, setValue] = useState(defaultValue || states[0]);
  const [position, setPosition] = useState(undefined);
  const [bgColor, setBgColor] = useState(colors[0]);
  const [fgColor, setFgColor] = useState(fgColors[0]);

  useEffect(() => {
    updateButton(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // trigger onChange callback on value change
    onChange(value);
    updateButton(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function updateButton(value) {
    // map and update position, bgColor, and tooltip text
    let pos;
    let colorIndex;
    switch (value) {
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
    <div className={`${className} flex w-full`}>
      <div className={`${style.toggle}`} style={{ backgroundColor: bgColor }}>
        <button
          type="button"
          onClick={() => {
            setValue(-1);
            updateButton(value);
          }}
          className={`${style.button} ${style.buttonLeft}`}
          title={`Exclude ${label}`}
        >
          <BiX style={{ color: fgColor, marginLeft: "4px" }} />
        </button>
        <button
          className={style.button}
          type="button"
          title={`Do not filter ${label}`}
          onClick={() => {
            setValue(0);
            updateButton(value);
          }}
        >
          <BsDot style={{ color: fgColor }} />
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(1);
            updateButton(value);
          }}
          className={`${style.button} ${style.buttonLeft}`}
          title={`Include ${label}`}
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
          className="hidden"
          key={state}
          type="radio"
          checked={state === value}
        />
      ))}

      {label && <span className="ml-3 text-sm text-left">{label}</span>}
    </div>
  );
}
