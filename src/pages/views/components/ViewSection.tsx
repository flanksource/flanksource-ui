import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoChevronDownOutline } from "react-icons/io5";
import { getViewDataByNamespace } from "../../../api/services/views";
import View from "../../audit-report/components/View/View";
import { Icon } from "../../../ui/Icons/Icon";
import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";
import { VIEW_VAR_PREFIX } from "../constants";
import { ViewSection as Section } from "../../audit-report/types";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";

interface ViewSectionProps {
  section: Section;
  hideVariables?: boolean;
}

const ViewSection: React.FC<ViewSectionProps> = ({
  section,
  hideVariables
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { namespace, name } = section.viewRef;

  // Use prefixed search params for view variables
  // NOTE: Backend uses view variables (template parameters) to partition the rows in the view table.
  // We must remove the global query parameters from the URL params.
  const [viewVarParams] = usePrefixedSearchParams(VIEW_VAR_PREFIX, false);
  const currentViewVariables = Object.fromEntries(viewVarParams.entries());

  // Fetch section view data with independent variables
  const {
    data: sectionViewResult,
    isLoading,
    error
  } = useQuery({
    queryKey: ["view-result", namespace, name, currentViewVariables],
    queryFn: () =>
      getViewDataByNamespace(namespace, name, currentViewVariables),
    enabled: !!namespace && !!name,
    staleTime: 5 * 60 * 1000
  });

  const handleHeaderKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  if (error || (!isLoading && !sectionViewResult)) {
    const errorContentId = `section-${namespace}-${name}-error`;
    return (
      <>
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-controls={errorContentId}
          className="mb-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1"
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={handleHeaderKeyDown}
        >
          <IoChevronDownOutline
            className={`h-4 w-4 flex-shrink-0 transform text-gray-600 transition-transform ${!isExpanded ? "-rotate-90" : ""}`}
          />
          {section.icon && (
            <Icon
              name={section.icon}
              className="h-5 w-5 flex-shrink-0 text-gray-600"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-600">
            {section.title}
          </h3>
        </div>
        {isExpanded && (
          <div id={errorContentId}>
            <ErrorViewer
              error={error ?? "Failed to load section"}
              className="max-w-3xl"
            />
          </div>
        )}
      </>
    );
  }

  const contentId = `section-${namespace}-${name}`;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="mb-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={handleHeaderKeyDown}
      >
        <IoChevronDownOutline
          className={`h-4 w-4 flex-shrink-0 transform text-gray-600 transition-transform ${!isExpanded ? "-rotate-90" : ""}`}
        />
        {section.icon && (
          <Icon
            name={section.icon}
            className="h-5 w-5 flex-shrink-0 text-gray-600"
          />
        )}
        <h3 className="text-lg font-semibold text-gray-600">{section.title}</h3>
      </div>
      {isExpanded && (
        <div id={contentId}>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="mb-4 h-4 w-32 rounded bg-gray-200"></div>
              <div className="h-64 rounded bg-gray-100"></div>
            </div>
          ) : (
            <View
              title=""
              namespace={namespace}
              name={name}
              columns={sectionViewResult?.columns}
              columnOptions={sectionViewResult?.columnOptions}
              panels={sectionViewResult?.panels}
              variables={sectionViewResult?.variables}
              card={sectionViewResult?.card}
              requestFingerprint={sectionViewResult.requestFingerprint}
              currentVariables={currentViewVariables}
              hideVariables={hideVariables}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ViewSection;
