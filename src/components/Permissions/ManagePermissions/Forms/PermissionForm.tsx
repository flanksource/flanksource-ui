import {
  addPermission,
  updatePermission,
  fetchPermissionById
} from "@flanksource-ui/api/services/permissions";
import { PermissionTable } from "@flanksource-ui/api/types/permissions";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import FormikKeyValueMapField from "@flanksource-ui/components/Forms/Formik/FormikKeyValueMapField";
import CanEditResource from "@flanksource-ui/components/Settings/CanEditResource";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import clsx from "clsx";
import { Form, Formik, useFormikContext } from "formik";
import { useMemo } from "react";
import { FaSpinner } from "react-icons/fa";
import { AuthorizationAccessCheck } from "../../AuthorizationAccessCheck";
import { getActionsForResourceType, ResourceType } from "../../PermissionsView";
import DeletePermission from "./DeletePermission";
import FormikPermissionSelectResourceFields from "./FormikPermissionSelectResourceFields";
import PermissionResource from "./PermissionResource";
import PermissionsSubjectControls from "./PermissionSubjectControls";
import { useAllAgentNamesQuery } from "../../../../api/query-hooks";

type PermissionFormProps = {
  onClose: () => void;
  isOpen: boolean;
  data?: Partial<PermissionTable>;
};

function PermissionActionDropdown({ isDisabled }: { isDisabled?: boolean }) {
  const { values } = useFormikContext<Partial<PermissionTable>>();

  const resourceType = useMemo<ResourceType | undefined>(() => {
    if (values.playbook_id) return "playbook";
    if (values.config_id) return "catalog";
    if (values.component_id) return "component";
    if (values.connection_id) return "connection";
    if (values.canary_id) return "canary";
    if (values.object) return "global";
    return undefined;
  }, [values]);

  const availableActions = useMemo(
    () => getActionsForResourceType(resourceType),
    [resourceType]
  );

  if (!resourceType) {
    return null;
  }

  return (
    <FormikSelectDropdown
      options={availableActions}
      name="action"
      label="Action"
      isDisabled={isDisabled}
    />
  );
}

function PermissionFormContent({
  isResourceIdProvided,
  agentOptions,
  source
}: {
  isResourceIdProvided: boolean;
  agentOptions: { label: string; value: string }[];
  source?: string;
}) {
  const isReadOnly = source === "KubernetesCRD";

  return (
    <div className="flex flex-col gap-3 p-4">
      <PermissionsSubjectControls />
      {isResourceIdProvided && isReadOnly ? (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Resource</label>
          <PermissionResource />
        </div>
      ) : (
        <FormikPermissionSelectResourceFields />
      )}
      <PermissionActionDropdown isDisabled={isReadOnly} />
      <FormikCheckbox name="deny" label="Deny" disabled={isReadOnly} />
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="space-y-3">
          <FormikKeyValueMapField
            name="tags"
            label="Tags"
            hint="Permission will apply only to resources matching these tags"
          />
          <FormikSelectDropdown
            name="agents"
            label="Agents"
            options={agentOptions}
            isMulti
            placeholder="Select agents..."
            isDisabled={isReadOnly}
          />
        </div>
      </div>
      <FormikTextArea
        name="description"
        label="Description"
        disabled={isReadOnly}
      />
    </div>
  );
}

export default function PermissionForm({
  onClose,
  isOpen = false,
  data
}: PermissionFormProps) {
  const permissionId = data?.id;

  // Fetch full permission data when editing
  const { data: fetchedPermission, isLoading: isFetchingPermission } = useQuery(
    {
      queryKey: ["permission", permissionId],
      queryFn: () => fetchPermissionById(permissionId!),
      enabled: !!permissionId
    }
  );

  // Use fetched data if editing, otherwise use provided data
  const permissionData = permissionId ? fetchedPermission : data;

  const isResourceIdProvided = useMemo(() => {
    return !!(
      permissionData?.component_id ||
      permissionData?.config_id ||
      permissionData?.canary_id ||
      permissionData?.canary_id ||
      permissionData?.playbook_id ||
      permissionData?.connection_id ||
      permissionData?.object
    );
  }, [permissionData]);

  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: agents } = useAllAgentNamesQuery({});

  const agentOptions = useMemo(
    () =>
      (agents || []).map((agent) => ({
        label: agent.name || agent.id,
        value: agent.id
      })),
    [agents]
  );

  const { isLoading: adding, mutate: add } = useMutation({
    mutationFn: async (data: PermissionTable) => {
      const res = await addPermission({
        ...data,
        created_by: user?.id!
      });
      return res.data;
    },
    onSuccess: () => {
      toastSuccess("Permission added");
      queryClient.invalidateQueries({ queryKey: ["permissions_summary"] });
      onClose();
    },
    onError: (error: AxiosError) => {
      // do something
      console.error(error);
      toastError(error.message);
    }
  });

  const { isLoading: updating, mutate: update } = useMutation({
    mutationFn: async (data: PermissionTable) => {
      const res = await updatePermission({
        ...data,
        updated_by: user?.id!
      });
      return res.data;
    },
    onSuccess: () => {
      toastSuccess("Permission updated");
      queryClient.invalidateQueries({ queryKey: ["permissions_summary"] });
      onClose();
    },
    onError: (error: AxiosError) => {
      // do something
      console.error(error);
      toastError(error.message);
    }
  });

  const isLoading = adding || updating;

  if (isFetchingPermission) {
    return (
      <Modal
        title="Edit Permission"
        onClose={onClose}
        open={isOpen}
        bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
        helpLink="/reference/permissions"
      >
        <div className="flex flex-1 items-center justify-center">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={permissionData?.id ? "Edit Permission" : "Add Permission"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      helpLink="/reference/permissions"
    >
      <div className="flex flex-1 flex-col gap-2">
        <Formik<Partial<PermissionTable>>
          initialValues={{
            action: permissionData?.action,
            component_id: permissionData?.component_id,
            config_id: permissionData?.config_id,
            canary_id: permissionData?.canary_id,
            playbook_id: permissionData?.playbook_id,
            deny: permissionData?.deny ?? false,
            object: permissionData?.object,
            description: permissionData?.description,
            connection_id: permissionData?.connection_id,
            created_at: permissionData?.created_at,
            created_by: permissionData?.created_by,
            updated_at: permissionData?.updated_at,
            updated_by: permissionData?.updated_by,
            id: permissionData?.id,
            notification_id: permissionData?.notification_id,
            person_id: permissionData?.person_id,
            team_id: permissionData?.team_id,
            subject: permissionData?.subject,
            subject_type: permissionData?.subject_type,
            until: permissionData?.until,
            source: permissionData?.source || "UI",
            tags: permissionData?.tags || {},
            agents: permissionData?.agents || []
          }}
          onSubmit={(v) => {
            if (!permissionData?.id) {
              return add({
                ...v
              } as PermissionTable);
            } else {
              return update({
                ...v
              } as PermissionTable);
            }
          }}
        >
          <Form className="flex flex-1 flex-col gap-2 overflow-y-auto">
            <div className="flex flex-1 flex-col overflow-y-auto">
              <PermissionFormContent
                isResourceIdProvided={isResourceIdProvided}
                agentOptions={agentOptions}
                source={permissionData?.source}
              />
            </div>
            <CanEditResource
              id={permissionData?.id}
              resourceType={"permissions"}
              source={permissionData?.source}
              className="flex items-center bg-gray-100 px-5 py-4"
            >
              <AuthorizationAccessCheck
                resource={tables.permissions}
                action="write"
              >
                <div
                  className={clsx(
                    "flex items-center bg-gray-100 px-5 py-4",
                    permissionData?.id ? "justify-between" : "justify-end"
                  )}
                >
                  {permissionData?.id && (
                    <DeletePermission
                      permissionId={permissionData.id}
                      onDeleted={onClose}
                    />
                  )}
                  <Button
                    icon={
                      isLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : undefined
                    }
                    type="submit"
                    text={
                      permissionData?.id
                        ? "Save"
                        : isLoading
                          ? "Saving ..."
                          : "Save"
                    }
                    className="btn-primary"
                  />
                </div>
              </AuthorizationAccessCheck>
            </CanEditResource>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
}
