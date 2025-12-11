import React from "react";
import ViewSection from "./ViewSection";
import GlobalFiltersForm from "../../audit-report/components/View/GlobalFiltersForm";
import GlobalFilters from "../../audit-report/components/View/GlobalFilters";
import { VIEW_VAR_PREFIX } from "../constants";
import type { ViewResult, ViewVariable } from "../../audit-report/types";

interface ViewWithSectionsProps {
  className?: string;
  viewResult: ViewResult;
  aggregatedVariables?: ViewVariable[];
  currentVariables?: Record<string, string>;
  hideVariables?: boolean;
}

const ViewWithSections: React.FC<ViewWithSectionsProps> = ({
  viewResult,
  className,
  aggregatedVariables,
  currentVariables,
  hideVariables
}) => {
  const { namespace, name, panels, columns } = viewResult;

  const isAggregatorView =
    viewResult.sections &&
    viewResult.sections.length > 0 &&
    !panels &&
    !columns;

  const primaryViewSection = {
    title: viewResult.title || name,
    viewRef: {
      namespace: namespace || "",
      name: name
    }
  };

  const showVariables =
    !hideVariables && aggregatedVariables && aggregatedVariables.length > 0;

  return (
    <div className={className}>
      {showVariables && (
        <GlobalFiltersForm
          variables={aggregatedVariables}
          globalVarPrefix={VIEW_VAR_PREFIX}
          currentVariables={currentVariables}
        >
          <GlobalFilters variables={aggregatedVariables} />
        </GlobalFiltersForm>
      )}

      {showVariables && <hr className="my-4 border-gray-200" />}

      {!isAggregatorView && (
        <div className="mt-2">
          <ViewSection
            key={`${namespace || "default"}:${name}`}
            section={primaryViewSection}
            hideVariables
            variables={currentVariables}
          />
        </div>
      )}

      {viewResult?.sections && viewResult.sections.length > 0 && (
        <>
          {viewResult.sections.map((section) => (
            <div
              key={`${section.viewRef.namespace || "default"}:${section.viewRef.name}`}
              className="mt-4"
            >
              <ViewSection
                section={section}
                hideVariables
                variables={currentVariables}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ViewWithSections;
