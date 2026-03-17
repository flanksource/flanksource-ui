import React, { useMemo, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import View from "../../audit-report/components/View/View";
import { Icon } from "../../../ui/Icons/Icon";
import { ViewSection as Section, ViewResult } from "../../audit-report/types";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import ChangesUISection from "./ChangesUISection";
import ConfigsUISection from "./ConfigsUISection";

const toSafeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");

interface ViewSectionProps {
  section: Section;
  viewData?: ViewResult;
  isLoading?: boolean;
  error?: unknown;
  variables?: Record<string, string>;
}

const ViewSection: React.FC<ViewSectionProps> = React.memo(
  ({ section, viewData, isLoading, error, variables }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const isUIRefSection = !!section.uiRef;
    const isViewRefSection = !!section.viewRef;

    const handleHeaderKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsExpanded(!isExpanded);
      }
    };

    const safeTitle = useMemo(() => toSafeId(section.title), [section.title]);

    const sectionId = useMemo(() => {
      if (section.viewRef) {
        return `section-${section.viewRef.namespace || "default"}-${section.viewRef.name}`;
      }
      if (section.uiRef?.changes) {
        return `section-changes-${safeTitle}`;
      }
      if (section.uiRef?.configs) {
        return `section-configs-${safeTitle}`;
      }
      return `section-${safeTitle}`;
    }, [safeTitle, section.uiRef, section.viewRef]);

    const renderHeader = () => (
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={sectionId}
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
    );

    if (isUIRefSection) {
      return (
        <>
          {renderHeader()}
          {isExpanded && (
            <div id={sectionId}>
              {section.uiRef?.changes && (
                <ChangesUISection
                  filters={section.uiRef.changes}
                  paramPrefix={`changes_${safeTitle}`}
                />
              )}
              {section.uiRef?.configs && (
                <ConfigsUISection
                  filters={section.uiRef.configs}
                  paramPrefix={`configs_${safeTitle}`}
                />
              )}
            </div>
          )}
        </>
      );
    }

    if (!isViewRefSection) {
      return (
        <ErrorViewer
          error="Invalid section: must have either viewRef or uiRef"
          className="max-w-3xl"
        />
      );
    }

    return (
      <>
        {renderHeader()}
        {isExpanded && (
          <div id={sectionId}>
            {isLoading && !viewData ? (
              <div className="animate-pulse">
                <div className="mb-4 h-4 w-32 rounded bg-gray-200"></div>
                <div className="h-64 rounded bg-gray-100"></div>
              </div>
            ) : error ? (
              <ErrorViewer error={error} className="max-w-3xl" />
            ) : !viewData ? (
              <ErrorViewer
                error="Failed to load section"
                className="max-w-3xl"
              />
            ) : (
              <View
                title=""
                namespace={viewData.namespace}
                name={viewData.name}
                columns={viewData.columns}
                columnOptions={viewData.columnOptions}
                panels={viewData.panels}
                table={viewData.table}
                variables={viewData.variables}
                card={viewData.card}
                requestFingerprint={viewData.requestFingerprint}
                currentVariables={variables}
                hideVariables
                debugInjectHeatmap
              />
            )}
          </div>
        )}
      </>
    );
  }
);

export default ViewSection;
