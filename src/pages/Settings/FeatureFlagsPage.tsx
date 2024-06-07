import {
  useAddFeatureFlag,
  useDeleteFeatureFlag,
  useGetFeatureFlagsFromAPI,
  useGetPropertyFromDB,
  useUpdateFeatureFlag
} from "@flanksource-ui/api/query-hooks/useFeatureFlags";
import FeatureFlagAddButton from "@flanksource-ui/components/FeatureFlags/FeatureFlagAddButton";
import FeatureFlagForm from "@flanksource-ui/components/FeatureFlags/FeatureFlagForm";
import { FeatureFlagsList } from "@flanksource-ui/components/FeatureFlags/FeatureFlagList";
import { SearchLayout } from "@flanksource-ui/components/Layout/SearchLayout";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { useFeatureFlagsContext } from "@flanksource-ui/context/FeatureFlagsContext";
import {
  FeatureFlag,
  PropertyDBObject
} from "@flanksource-ui/services/permissions/permissionsService";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { useEffect, useState } from "react";

export function FeatureFlagsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editedRow, setEditedRow] = useState<FeatureFlag>();
  const { refreshFeatureFlags } = useFeatureFlagsContext();

  const {
    data: featureFlags,
    isLoading,
    refetch
  } = useGetFeatureFlagsFromAPI();

  const { mutate: saveFeatureFlag } = useAddFeatureFlag(() => {
    refetch();
    setIsOpen(false);
    refreshFeatureFlags();
  });

  const { mutate: updateFeatureFlag } = useUpdateFeatureFlag(() => {
    refetch();
    setIsOpen(false);
    refreshFeatureFlags();
  });

  const { mutate: deleteFeatureFlag } = useDeleteFeatureFlag(() => {
    refetch();
    setIsOpen(false);
    refreshFeatureFlags();
  });

  const { data: property } = useGetPropertyFromDB(editedRow);

  async function onSubmit(data: Partial<PropertyDBObject>) {
    if (!data.created_at) {
      saveFeatureFlag(data);
    } else {
      updateFeatureFlag(data);
    }
  }

  useEffect(() => {
    if (isOpen) {
      return;
    }
    setEditedRow(undefined);
  }, [isOpen]);

  return (
    <>
      <Head prefix="Feature Flags" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot
                link="/settings/feature-flags"
                key="feature-flags"
              >
                Feature Flags
              </BreadcrumbRoot>,
              <FeatureFlagAddButton
                key={"add-button"}
                onSubmit={onSubmit}
                onDelete={deleteFeatureFlag}
              />
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading}
      >
        <div className="flex flex-col flex-1 px-6 pb-0 h-full max-w-screen-xl mx-auto">
          <FeatureFlagsList
            className="mt-6 overflow-y-hidden"
            data={featureFlags ?? []}
            isLoading={isLoading}
            onRowClick={(val) => {
              if (val.source === "local") {
                toastError("Cannot edit local feature flags");
                return;
              }
              setIsOpen(true);
              setEditedRow(val);
            }}
          />
          {property && (
            <FeatureFlagForm
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              onFeatureFlagSubmit={onSubmit}
              onFeatureFlagDelete={deleteFeatureFlag}
              formValue={property}
              source={editedRow?.source}
            />
          )}
        </div>
      </SearchLayout>
    </>
  );
}
