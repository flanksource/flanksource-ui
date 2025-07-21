import React from "react";
import { Application } from "../../types";
import { Info } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";

interface ApplicationDetailsProps {
  application: Application;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application
}) => {
  // Filter properties that should be displayed in this section
  const displayProperties =
    application.properties
      ?.filter((prop) => prop.label && (prop.text || prop.value))
      .sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  return (
    <>
      <div>
        <h3 className="mb-4 flex items-center text-xl font-semibold">
          <Info className="mr-2 text-teal-600" size={20} />
          Application Details
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-4">
            {displayProperties.map((property, index) => (
              <div key={index}>
                <div className="mb-2 flex items-center text-sm text-gray-500">
                  <DynamicIcon
                    name={(property.icon as IconName) || "info"}
                    className="mr-1.5"
                    color={property.color || "gray"}
                    size={16}
                  />
                  {property.label}
                </div>
                <p className="text-sm">{property.text || property.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center text-sm text-gray-500">
                <Info className="mr-1.5 text-gray-400" size={16} />
                Description
              </div>
              <p className="text-sm">{application.description}</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />
    </>
  );
};

export default ApplicationDetails;
