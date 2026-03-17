import React from "react";
import ViewSection from "./ViewSection";
import GlobalFiltersForm from "../../audit-report/components/View/GlobalFiltersForm";
import GlobalFilters from "../../audit-report/components/View/GlobalFilters";
import View from "../../audit-report/components/View/View";
import { VIEW_VAR_PREFIX } from "../constants";
import type { ViewResult, ViewVariable } from "../../audit-report/types";
import type { SectionDataEntry } from "../hooks/useAggregatedViewVariables";

interface ViewContentProps {
  className?: string;
  viewResult: ViewResult;
  sectionData?: Map<string, SectionDataEntry>;
  aggregatedVariables?: ViewVariable[];
  currentVariables?: Record<string, string>;
  hideVariables?: boolean;
}

const ViewContent: React.FC<ViewContentProps> = React.memo(
  ({
    viewResult,
    className,
    sectionData,
    aggregatedVariables,
    currentVariables,
    hideVariables
  }) => {
    const { panels, columns } = viewResult;

    const hasPrimaryContent =
      (Array.isArray(panels) && panels.length > 0) ||
      (Array.isArray(columns) && columns.length > 0);

    const isAggregatorView =
      Boolean(viewResult.sections?.length) && !hasPrimaryContent;

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
            <View
              title=""
              namespace={viewResult.namespace}
              name={viewResult.name}
              columns={viewResult.columns}
              columnOptions={viewResult.columnOptions}
              panels={viewResult.panels}
              table={viewResult.table}
              variables={viewResult.variables}
              card={viewResult.card}
              requestFingerprint={viewResult.requestFingerprint}
              currentVariables={currentVariables}
              hideVariables
              debugInjectHeatmap
            />
          </div>
        )}

        {viewResult?.sections && viewResult.sections.length > 0 && (
          <>
            {viewResult.sections.map((section, index) => {
              const baseKey = section.viewRef
                ? `${section.viewRef.namespace || "default"}:${section.viewRef.name}`
                : section.uiRef?.changes
                  ? `changes:${section.title}`
                  : section.uiRef?.configs
                    ? `configs:${section.title}`
                    : `section:${section.title}`;
              const sectionKey = `${baseKey}:${index}`;
              const viewRefKey = section.viewRef
                ? `${section.viewRef.namespace || ""}:${section.viewRef.name}`
                : undefined;
              const sectionEntry = viewRefKey
                ? sectionData?.get(viewRefKey)
                : undefined;

              return (
                <div key={sectionKey} className="mt-4">
                  <ViewSection
                    section={section}
                    viewData={sectionEntry?.data}
                    isLoading={sectionEntry?.isLoading}
                    error={sectionEntry?.error}
                    variables={currentVariables}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  }
);

export default ViewContent;
