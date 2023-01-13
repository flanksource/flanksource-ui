import clsx from "clsx";
import { FaCog } from "react-icons/fa";

import { CardWidth } from "../TopologyCard";

import { useOnMouseActivity } from "../../hooks/useMouseActivity";
import { Size } from "../../types";
import { Toggle } from "../Toggle";
import { useSearchParams } from "react-router-dom";
import { LegacyRef } from "react";

export function getCardWidth() {
  let value: any = localStorage.getItem("topology_card_width");

  if (!value?.trim()) {
    return CardWidth[Size.extra_large];
  }

  value = parseInt(value, 10);
  if (isNaN(value)) {
    return CardWidth[Size.extra_large];
  } else {
    return `${value}px`;
  }
}

export const TopologyPreference = ({
  title = "Preferences",
  cardSize,
  setCardWidth
}: {
  title?: string;
  cardSize: Size | string;
  setCardWidth: (width: string) => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    ref: popoverRef,
    isActive: isPopoverActive,
    setIsActive: setIsPopoverActive
  } = useOnMouseActivity();

  const showHiddenComponents =
    searchParams.get("showHiddenComponents") !== "no";

  return (
    <div ref={popoverRef as LegacyRef<HTMLDivElement>}>
      <FaCog
        className="content-center w-6 h-6 mt-1 ml-4 cursor-pointer md:mt-0"
        onClick={() => setIsPopoverActive((val) => !val)}
      />
      <div
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        className={clsx(
          "origin-top-right absolute right-0 mt-5 w-96 z-50 divide-y divide-gray-100 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none capitalize",
          isPopoverActive ? "display-block" : "hidden"
        )}
      >
        <div className="py-1">
          <div className="flex items-center justify-between px-4 py-2 text-base">
            <span className="font-bold text-gray-700">{title}</span>
          </div>
        </div>
        <div className="py-1" role="none">
          <div className="flex px-4 py-3 items-center">
            <label
              htmlFor="topology-card-width-slider"
              className="inline-block mr-3 text-xs text-gray-700"
            >
              Show hidden components:
            </label>
            <Toggle
              className="inline-flex items-center"
              label=""
              value={showHiddenComponents}
              onChange={(val) => {
                const newValue = val ? "yes" : "no";
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  showHiddenComponents: newValue
                });
              }}
            />
          </div>
        </div>
        <div className="py-1" role="none">
          <div className="flex px-4 py-4 items-center">
            <label
              htmlFor="topology-card-width-slider"
              className="mr-3 text-xs text-gray-700"
            >
              Card Width:
            </label>
            <input
              step={2}
              min="250"
              max="768"
              type="range"
              value={parseInt(cardSize, 10)}
              id="topology-card-width-slider"
              onChange={(e) => setCardWidth(e.target.value)}
              className="w-64 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
