import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getViewDataByNamespace } from "../../../api/services/views";
import View from "../../audit-report/components/View/View";
import { Icon } from "../../../ui/Icons/Icon";
import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";
import { VIEW_VAR_PREFIX } from "../constants";
import { ViewSection as Section } from "../../audit-report/types";

interface ViewSectionProps {
  section: Section;
  hideVariables?: boolean;
}

const ViewSection: React.FC<ViewSectionProps> = ({
  section,
  hideVariables
}) => {
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

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-4 h-4 w-32 rounded bg-gray-200"></div>
        <div className="h-64 rounded bg-gray-100"></div>
      </div>
    );
  }

  if (error || !sectionViewResult) {
    return (
      <>
        <div className="mb-4 flex items-center">
          {section.icon && (
            <Icon name={section.icon} className="mr-2 h-5 w-5" />
          )}
          <h2 className="text-lg font-semibold">{section.title}</h2>
        </div>
        <div className="text-red-500">
          {error instanceof Error ? error.message : "Failed to load section"}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        {section.icon && <Icon name={section.icon} className="mr-2 h-5 w-5" />}
        <h2 className="text-lg font-semibold">{section.title}</h2>
      </div>
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
    </>
  );
};

export default ViewSection;
