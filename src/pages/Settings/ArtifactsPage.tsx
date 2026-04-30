import { fetchArtifacts } from "@flanksource-ui/api/services/artifacts";
import { Artifact } from "@flanksource-ui/api/types/artifacts";
import { ArtifactPreviewModal } from "@flanksource-ui/components/Artifacts/ArtifactPreviewModal";
import { ArtifactsTable } from "@flanksource-ui/components/Artifacts/ArtifactsTable";
import { ArtifactsSummaryCards } from "@flanksource-ui/components/Artifacts/ArtifactsSummaryCards";
import { ReactSelectDropdown } from "@flanksource-ui/components/ReactSelectDropdown";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { TextInputClearable } from "@flanksource-ui/ui/FormControls/TextInputClearable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const contentTypeOptions = [
  { id: "all", value: "all", label: "All", description: "All" },
  {
    id: "application/json",
    value: "application/json",
    label: "JSON",
    description: "JSON"
  },
  {
    id: "application/yaml",
    value: "application/yaml",
    label: "YAML",
    description: "YAML"
  },
  {
    id: "text/plain",
    value: "text/plain",
    label: "Text",
    description: "Text"
  },
  {
    id: "text/markdown",
    value: "text/markdown",
    label: "Markdown",
    description: "Markdown"
  },
  {
    id: "application/sql",
    value: "application/sql",
    label: "SQL",
    description: "SQL"
  },
  {
    id: "text/x-shellscript",
    value: "text/x-shellscript",
    label: "Shell",
    description: "Shell"
  }
];

export function ArtifactsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedArtifact, setSelectedArtifact] = useState<
    Artifact | undefined
  >();

  const contentType = searchParams.get("content_type") ?? "all";
  const filenameSearch = searchParams.get("search") ?? "";

  const [sortState] = useReactTableSortState({
    defaultSorting: [{ id: "created_at", desc: true }]
  });
  const { pageIndex, pageSize } = useReactTablePaginationState();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "artifacts",
      { pageIndex, pageSize, sortState, contentType, filenameSearch }
    ],
    queryFn: () =>
      fetchArtifacts({
        pageIndex,
        pageSize,
        sortBy: sortState,
        contentType,
        filenameSearch: filenameSearch || undefined
      }),
    keepPreviousData: true
  });

  const artifacts = data?.data ?? [];
  const totalEntries = data?.totalEntries ?? 0;
  const pageCount = Math.ceil(totalEntries / pageSize);

  return (
    <>
      <Head prefix="Artifacts" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/settings/artifacts" key="artifacts-root">
                Artifacts
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={() => refetch()}
        contentClass="p-0 h-full"
        loading={isLoading}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <ArtifactsSummaryCards />
          <div className="flex flex-row items-center gap-4 py-4">
            <TextInputClearable
              className="w-80"
              placeholder="Search by filename..."
              value={filenameSearch}
              hideButton
              onChange={(e) => {
                const nextParams = new URLSearchParams(searchParams);
                if (e.target.value) {
                  nextParams.set("search", e.target.value);
                } else {
                  nextParams.delete("search");
                }
                setSearchParams(nextParams);
              }}
              onClear={() => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.delete("search");
                setSearchParams(nextParams);
              }}
            />
            <ReactSelectDropdown
              name="content-type-filter"
              items={contentTypeOptions}
              value={contentType}
              onChange={(value) => {
                const nextParams = new URLSearchParams(searchParams);
                if (!value || value === "all") {
                  nextParams.delete("content_type");
                } else {
                  nextParams.set("content_type", value);
                }
                setSearchParams(nextParams);
              }}
              className="min-w-[180px]"
              dropDownClassNames="w-[200px] left-0"
              hideControlBorder
              prefix={
                <span className="text-xs text-gray-500">Content Type:</span>
              }
            />
          </div>
          <div className="flex h-full flex-col overflow-y-auto pb-6">
            <ArtifactsTable
              artifacts={artifacts}
              isLoading={isLoading}
              pageCount={pageCount}
              totalRowCount={totalEntries}
              onRowClick={setSelectedArtifact}
            />
          </div>
        </div>
        <ArtifactPreviewModal
          artifact={selectedArtifact}
          onClose={() => setSelectedArtifact(undefined)}
        />
      </SearchLayout>
    </>
  );
}
