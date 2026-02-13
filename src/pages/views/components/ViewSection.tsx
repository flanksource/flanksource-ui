import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoChevronDownOutline } from "react-icons/io5";
import { getViewDataByNamespace } from "../../../api/services/views";
import View from "../../audit-report/components/View/View";
import { Icon } from "../../../ui/Icons/Icon";
import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";
import { VIEW_VAR_PREFIX } from "../constants";
import { ViewSection as Section } from "../../audit-report/types";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import ChangesUISection from "./ChangesUISection";
import ConfigsUISection from "./ConfigsUISection";

const toSafeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");

interface ViewSectionProps {
  section: Section;
  hideVariables?: boolean;
  variables?: Record<string, string>;
}

const ViewSection: React.FC<ViewSectionProps> = ({
  section,
  hideVariables,
  variables: defaultVariables
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Determine if this is a native UI section or a view reference section
  const isUIRefSection = !!section.uiRef;
  const isViewRefSection = !!section.viewRef;

  // Use prefixed search params for view variables
  const [viewVarParams] = usePrefixedSearchParams(VIEW_VAR_PREFIX, false);
  const paramVariables = useMemo(
    () => Object.fromEntries(viewVarParams.entries()),
    [viewVarParams]
  );
  const currentViewVariables = useMemo(
    () => ({ ...(defaultVariables ?? {}), ...paramVariables }),
    [defaultVariables, paramVariables]
  );

  // Extract namespace and name for view reference sections
  const namespace = section.viewRef?.namespace ?? "default";
  const name = section.viewRef?.name ?? "";

  // Fetch section view data - only enabled for viewRef sections
  const {
    data: sectionViewResult,
    isLoading,
    error
  } = useQuery({
    queryKey: ["view-result", namespace, name, currentViewVariables],
    queryFn: () =>
      getViewDataByNamespace(namespace, name, currentViewVariables),
    enabled: isViewRefSection && !!name,
    staleTime: 5 * 60 * 1000
  });

  const handleHeaderKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  // TODO: see if safeTitle is only needed for the prefix.
  // If yes then remove this and use something simpler for the prefix.
  const safeTitle = useMemo(() => toSafeId(section.title), [section.title]);

  // Determine the section ID for accessibility
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
  }, [safeTitle, section]);

  // Render section header
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

  // Render native UI section (Changes or Configs)
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

  // Render invalid section error
  if (!isViewRefSection) {
    return (
      <ErrorViewer
        error="Invalid section: must have either viewRef or uiRef"
        className="max-w-3xl"
      />
    );
  }

  // Render view reference section - error state
  if (error || (!isLoading && !sectionViewResult)) {
    return (
      <>
        {renderHeader()}
        {isExpanded && (
          <div id={sectionId}>
            <ErrorViewer
              error={error ?? "Failed to load section"}
              className="max-w-3xl"
            />
          </div>
        )}
      </>
    );
  }

  // Render view reference section - success state
  return (
    <>
      {renderHeader()}
      {isExpanded && (
        <div id={sectionId}>
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
              table={sectionViewResult?.table}
              variables={sectionViewResult?.variables}
              card={sectionViewResult?.card}
              requestFingerprint={sectionViewResult?.requestFingerprint ?? ""}
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
