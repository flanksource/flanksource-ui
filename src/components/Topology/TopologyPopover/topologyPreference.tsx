import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { LegacyRef, useMemo } from "react";
import { FaCog } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { useOnMouseActivity } from "../../../hooks/useMouseActivity";
import { Size } from "../../../types";
import { ClickableSvg } from "../../../ui/ClickableSvg/ClickableSvg";
import { Toggle } from "../../../ui/FormControls/Toggle";
import { CardWidth } from "../TopologyCard";

const topologyCardWidthAtom = atomWithStorage(
  "topology_card_width",
  CardWidth[Size.extra_large],
  undefined,
  {
    getOnInit: true
  }
);

export function useTopologyCardWidth(): [string, (width: string) => void] {
  const [topologyCardSize, setTopologyCardSize] = useAtom(
    topologyCardWidthAtom
  );

  const value = useMemo(() => {
    const v = parseInt(topologyCardSize, 10);
    if (isNaN(v)) {
      return CardWidth[Size.extra_large];
    } else {
      return `${v}px`;
    }
  }, [topologyCardSize]);

  return [value, setTopologyCardSize];
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
    <>
      <style jsx>{`
        input[type="range"] {
          /* fix for FF unable to apply focus style bug  */
          border: 1px solid white;

          /*required for proper track sizing in FF*/
          width: 256px;
        }

        input[type="range"]::-moz-range-track {
          width: 256px;
          height: 10px;
          background: #9ca3af;
          border: none;
          border-radius: 6px;
        }

        input[type="range"]::-moz-range-thumb {
          border: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: rgb(29 78 216);
        }

        /*hide the outline behind the border*/
        input[type="range"]:-moz-focusring {
          outline: 1px solid white;
          outline-offset: -1px;
        }

        input[type="range"]:focus::-moz-range-track {
          background: #9ca3af;
        }
      `}</style>
      <div ref={popoverRef as LegacyRef<HTMLDivElement>}>
        <ClickableSvg className="ml-4 mt-1 cursor-pointer md:mt-0">
          <FaCog
            className="h-6 w-6 content-center"
            onClick={() => setIsPopoverActive((val) => !val)}
          />
        </ClickableSvg>
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          className={clsx(
            "absolute right-0 z-50 mt-5 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white capitalize shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            isPopoverActive ? "display-block" : "hidden"
          )}
        >
          <div className="py-1">
            <div className="flex items-center justify-between px-4 py-2 text-base">
              <span className="font-bold text-gray-700">{title}</span>
            </div>
          </div>
          <div className="py-1" role="none">
            <div className="flex items-center px-4 py-3">
              <label
                htmlFor="topology-card-width-slider"
                className="mr-3 inline-block text-xs text-gray-700"
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
            <div className="flex items-center px-4 py-4">
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
                className="h-5 w-64 cursor-pointer rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
