import { CardSize } from "../TopologyCard";

export const TopologyPreference = ({
  title,
  cardSize,
  setCardWidth
}: {
  title?: string;
  cardSize?: CardSize;
  setCardWidth?: (width: string) => void;
}) => {
  return (
    <>
      <div className="py-1">
        <div className="flex items-center justify-between px-4 py-2 text-base">
          <span className="font-bold text-gray-700">{title}</span>
        </div>
      </div>
      <div className="py-1" role="none">
        <div className="px-4 py-4">
          <label
            htmlFor="topology-card-width-slider"
            className="inline-block mr-3 text-xs text-gray-700"
          >
            Card Width:
          </label>
          <input
            step={2}
            min="250"
            max="768"
            type="range"
            value={parseInt(cardSize ?? 'medium', 10)}
            id="topology-card-width-slider"
            onChange={(e) => setCardWidth?.(e.target.value)}
            className="inline-block w-64 mb-4 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};
