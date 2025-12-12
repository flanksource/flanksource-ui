import React, { ReactNode } from "react";

interface PanelWrapperProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  children: ReactNode;
}

/**
 * Common wrapper component for all panel types.
 * Provides consistent styling for the panel container, header, and description.
 */
const PanelWrapper: React.FC<PanelWrapperProps> = ({
  title,
  description,
  className = "",
  titleClassName = "",
  children
}) => {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4 ${className}`}
    >
      <h4
        className={`mb-2 text-sm font-medium text-gray-600 ${titleClassName}`}
      >
        {title}
      </h4>
      {description && (
        <p className="mb-3 text-xs text-gray-500">{description}</p>
      )}
      {children}
    </div>
  );
};

export default PanelWrapper;
