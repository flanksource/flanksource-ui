import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";
import { PiPushPinFill, PiPushPinThin } from "react-icons/pi";

export const configTypesFavorites = atomWithStorage<Record<string, boolean>>(
  "configTypesFavorites",
  {},
  undefined,
  {
    getOnInit: true
  }
);

type ConfigSummaryFavoriteButtonProps = {
  configSummary: ConfigSummary;
  children?: React.ReactNode;
};

export default function ConfigSummaryFavoriteButton({
  configSummary,
  children
}: ConfigSummaryFavoriteButtonProps) {
  const [favorites, setFavorites] = useAtom(configTypesFavorites);

  const isFavorite = favorites[configSummary.type];

  const toggleFavorite = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setFavorites((prev) => {
        // We want to remove the favorite
        if (prev[configSummary.type]) {
          // Avoid mutating the state, use object destructuring to remove the
          // key from the object
          const { [configSummary.type]: _, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          [configSummary.type]: true
        };
      });
    },
    [configSummary.type, setFavorites]
  );

  return (
    <div className="group flex w-full flex-row gap-1">
      <div className="flex-1 overflow-x-hidden text-ellipsis">{children}</div>
      <div
        role="button"
        onClick={toggleFavorite}
        title={isFavorite ? "Unpin" : "Pin"}
        className={clsx(
          "flex-row gap-1 px-1",
          isFavorite ? "flex" : "hidden group-hover:flex"
        )}
      >
        {isFavorite ? (
          <PiPushPinFill className="h-5 w-5 text-amber-300" />
        ) : (
          <PiPushPinThin className="h-5 w-5" />
        )}
      </div>
    </div>
  );
}
