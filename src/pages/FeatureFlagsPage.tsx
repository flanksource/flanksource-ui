import { useEffect, useState } from "react";
import { Head } from "../components/Head/Head";
import { SearchLayout } from "../components/Layout";
import { useLoader } from "../hooks";
import { BreadcrumbNav, BreadcrumbRoot } from "../components/BreadcrumbNav";
import { AiFillPlusCircle } from "react-icons/ai";
import { toastError, toastSuccess } from "../components/Toast/toast";
import { useUser } from "../context";
import { Property } from "../services/permissions/permissionsService";
import { FeatureFlagsList } from "../components/FeatureFlags/FeatureFlagList";
import FeatureFlagForm from "../components/FeatureFlags/FeatureFlagForm";
import {
  deleteProperty,
  fetchProperties,
  saveProperty,
  updateProperty
} from "../api/services/properties";
import { useFeatureFlagsContext } from "../context/FeatureFlagsContext";

export function FeatureFlagsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const { loading, setLoading } = useLoader();
  const [editedRow, setEditedRow] = useState<Property>();
  const { refreshFeatureFlags } = useFeatureFlagsContext();

  async function fetchAllProperties() {
    setLoading(true);
    try {
      const response = await fetchProperties();
      if (response.data) {
        setProperties(response.data as unknown as Property[]);
        setLoading(false);
        return;
      }
      toastError(response?.error?.message);
    } catch (ex) {
      toastError((ex as Error).message);
    }
    setLoading(false);
  }

  async function onSubmit(data: Partial<Property>) {
    if (!data.created_at) {
      return onSaveProperty(data);
    } else {
      return onUpdateProperty(data);
    }
  }

  async function onSaveProperty(data: Partial<Property>) {
    setLoading(true);
    try {
      const response = await saveProperty({
        ...data,
        created_by: user.user?.id
      });
      if (response?.data) {
        fetchAllProperties();
        setIsOpen(false);
        setLoading(false);
        toastSuccess("Property added successfully");
        refreshFeatureFlags();
        return;
      }
      toastError(response.error?.message);
    } catch (ex) {
      toastError((ex as Error).message);
    }
    setLoading(false);
  }

  async function onUpdateProperty(data: Partial<Property>) {
    setLoading(true);
    try {
      const response = await updateProperty({
        ...data,
        created_by: user.user?.id
      });
      if (response?.data) {
        fetchAllProperties();
        setIsOpen(false);
        setLoading(false);
        toastSuccess("Property updated successfully");
        refreshFeatureFlags();
        return;
      }
      toastError(response.error?.message);
    } catch (ex) {
      toastError((ex as Error).message);
    }
    setLoading(false);
  }

  async function onDelete(data: Partial<Property>) {
    setLoading(true);
    try {
      const response = await deleteProperty(data);
      setEditedRow(undefined);
      if (response?.data) {
        fetchAllProperties();
        setIsOpen(false);
        setLoading(false);
        toastSuccess("Property removed successfully");
        refreshFeatureFlags();
        return;
      }
      toastError(response?.error?.message);
    } catch (ex) {
      toastError((ex as Error).message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAllProperties();
  }, []);

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
              <BreadcrumbRoot link="/settings/feature-flags">
                Feature Flags
              </BreadcrumbRoot>,
              <button
                type="button"
                className=""
                onClick={() => setIsOpen(true)}
              >
                <AiFillPlusCircle size={32} className="text-blue-600" />
              </button>
            ]}
          />
        }
        onRefresh={() => {
          fetchAllProperties();
        }}
        contentClass="p-0 h-full"
        loading={loading}
      >
        <div className="flex flex-col flex-1 px-6 pb-0 h-full max-w-screen-xl mx-auto">
          <FeatureFlagsList
            className="mt-6 overflow-y-hidden"
            data={properties}
            isLoading={loading}
            onRowClick={(val) => {
              setIsOpen(true);
              setEditedRow(val);
            }}
          />
          <FeatureFlagForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onFeatureFlagSubmit={onSubmit}
            onFeatureFlagDelete={onDelete}
            formValue={editedRow}
          />
        </div>
      </SearchLayout>
    </>
  );
}
