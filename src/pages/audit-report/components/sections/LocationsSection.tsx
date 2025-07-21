import React from "react";
import { Cloud, Tag, Server, MapPin } from "lucide-react";
import { Icon } from "../Icon";
import { Location } from "../../types";

interface LocationsSectionProps {
  locations: Location[];
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  locations
}) => {
  if (locations.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-4 flex items-center text-xl font-semibold">
        <Cloud className="mr-2 text-teal-600" size={20} />
        Locations
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {locations.map((location, index) => (
          <div
            key={index}
            className="relative max-w-md rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Icon
                  name={location.provider.toLowerCase()}
                  className="h-5 w-5 text-gray-500"
                />
                <span className="font-medium">{location.account}</span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  <Tag size={12} className="mr-1" />
                  {location.purpose}
                </span>

                <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  <Tag size={12} className="mr-1" />
                  {location.name}
                </span>
              </div>
            </div>

            <div className="mt-2">
              <div className="mt-1 grid grid-cols-[auto_max-content_1fr] items-center gap-x-2 gap-y-1 text-sm text-gray-600">
                <MapPin size={12} className="text-gray-400" />
                <span className="text-gray-500">Region:</span>
                <span className="text-gray-700">{location.region}</span>

                <Server size={12} className="text-gray-400" />
                <span className="text-gray-500">Resources:</span>
                <span className="text-gray-700">
                  {location.resourceCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsSection;
