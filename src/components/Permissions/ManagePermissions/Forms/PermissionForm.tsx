import {
  addPermission,
  updatePermission,
  fetchPermissionById,
  recheckPermission
} from "@flanksource-ui/api/services/permissions";
import { PermissionTable } from "@flanksource-ui/api/types/permissions";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
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
import { Form, Formik, useFormikContext } from "formik";
import { useMemo } from "react";
import { FaSpinner } from "react-icons/fa";
import { AuthorizationAccessCheck } from "../../AuthorizationAccessCheck";
import { getActionsForResourceType, ResourceType } from "../../PermissionsView";
import DeletePermission from "./DeletePermission";
import FormikPermissionSelectResourceFields from "./FormikPermissionSelectResourceFields";
import PermissionResource from "./PermissionResource";
import PermissionsSubjectControls from "./PermissionSubjectControls";
import { PermissionErrorDisplay } from "../../PermissionErrorDisplay";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";

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
    if (values.object_selector?.views) return "view";
    if (values.object_selector?.scopes) return "global";
    if (values.object) return "global";
    return undefined;
  }, [values]);

  const availableActions = useMemo(() => {
    const actions = getActionsForResourceType(resourceType);

    // Add mcp:run when: playbook resource + specific playbook selected + person/team subject
    if (
      resourceType === "playbook" &&
      values.playbook_id &&
      (values.subject_type === "person" || values.subject_type === "team")
    ) {
      return [...actions, { value: "mcp:run", label: "mcp:run" }];
    }

    return actions;
  }, [resourceType, values.playbook_id, values.subject_type]);

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

function PlaybookRunWarning() {
  const { values } = useFormikContext<Partial<PermissionTable>>();

  // Show warning when resource is a playbook and action is playbook:run or playbook:*
  const shouldShowWarning =
    values.playbook_id &&
    (values.action === "playbook:run" || values.action === "playbook:*");

  if (!shouldShowWarning) {
    return null;
  }

  const crdExample = `apiVersion: mission-control.flanksource.com/v1
kind: Permission
metadata:
  name: allow-playbook-run
  namespace: mc
spec:
  description: allow user John to run the playbook on only monitoring deployments.
  subject:
    person: john@flanksource.com
  actions:
    - playbook:run
  object:
    playbooks:
      - name: scale-deployment
    configs:
      - tagSelector: cluster=dev,namespace=monitoring`;

  return (
    <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
      <p className="font-medium">
        This permission does <span className="font-bold">NOT</span> restrict
        which configs, components, or checks the playbook can run on.
      </p>
      <p className="mt-1">
        The user can attempt to run it on anything they can read.
      </p>
      <p className="mt-1 text-xs italic">
        (Note: The playbook itself may have resource restrictions that further
        limit what it accepts.)
      </p>
      <p className="mt-1">
        If you need granular control over which specific configs, components, or
        checks can run this playbook, use the Kubernetes CRD to define resource
        selectors.
      </p>
      <details className="mt-2">
        <summary className="cursor-pointer font-medium hover:underline">
          View CRD Example
        </summary>
        <div className="mt-2">
          <JSONViewer code={crdExample} format="yaml" />
        </div>
      </details>
    </div>
  );
}

function PermissionFormContent({
  isResourceIdProvided,
  source,
  permissionId
}: {
  isResourceIdProvided: boolean;
  source?: string;
  permissionId?: string;
}) {
  const isReadOnly = source === "KubernetesCRD";

  return (
    <div className="flex flex-col gap-3 p-4">
      {isReadOnly && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
          <p className="font-medium">
            Read-Only Mode: This resource is managed by Kubernetes CRD and
            cannot be edited from the UI.
          </p>
        </div>
      )}

      <div className={isReadOnly ? "pointer-events-none opacity-60" : ""}>
        <PermissionsSubjectControls disabled={isReadOnly} />
      </div>

      <div className={isReadOnly ? "pointer-events-none opacity-60" : ""}>
        {isResourceIdProvided && isReadOnly ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Resource</label>
            <PermissionResource />
          </div>
        ) : (
          <FormikPermissionSelectResourceFields
            key={`permission-resource-${permissionId || "new"}`}
          />
        )}
      </div>

      <div className={isReadOnly ? "pointer-events-none opacity-60" : ""}>
        <PermissionActionDropdown isDisabled={isReadOnly} />
      </div>

      <PlaybookRunWarning />

      <div className={isReadOnly ? "pointer-events-none opacity-60" : ""}>
        <FormikCheckbox name="deny" label="Deny" disabled={isReadOnly} />
      </div>

      <div className={isReadOnly ? "pointer-events-none opacity-60" : ""}>
        <FormikTextArea
          name="description"
          label="Description"
          disabled={isReadOnly}
        />
      </div>
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
      enabled: !!permissionId && isOpen
    }
  );

  // Use fetched data if editing, otherwise use provided data
  const permissionData = permissionId ? fetchedPermission : data;

  // Only show loading when we're actually fetching an existing permission
  const shouldShowLoading = !!permissionId && isFetchingPermission;

  const isResourceIdProvided = useMemo(() => {
    return !!(
      permissionData?.component_id ||
      permissionData?.config_id ||
      permissionData?.canary_id ||
      permissionData?.playbook_id ||
      permissionData?.connection_id
    );
  }, [permissionData]);

  const { user } = useUser();
  const queryClient = useQueryClient();

  const { isLoading: adding, mutate: add } = useMutation({
    mutationFn: async (data: PermissionTable) => {
      const res = await addPermission({
        ...data,
        created_by: user?.id!
      });
      return res.data;
    },
    onSuccess: (result) => {
      toastSuccess("Permission added");
      queryClient.invalidateQueries({ queryKey: ["permissions_summary"] });
      // Invalidate the newly created permission's cache in case it's immediately opened
      if (result?.id) {
        queryClient.invalidateQueries({ queryKey: ["permission", result.id] });
      }
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
    onSuccess: (_, data) => {
      toastSuccess("Permission updated");
      queryClient.invalidateQueries({ queryKey: ["permissions_summary"] });
      queryClient.invalidateQueries({ queryKey: ["permission", data.id] });
      onClose();
    },
    onError: (error: AxiosError) => {
      // do something
      console.error(error);
      toastError(error.message);
    }
  });

  const { isLoading: rechecking, mutate: recheck } = useMutation({
    mutationFn: async (id: string) => {
      const res = await recheckPermission(id);
      return res.data;
    },
    onSuccess: (result, id) => {
      toastSuccess("Re-evaluated successfully");
      queryClient.invalidateQueries({ queryKey: ["permissions_summary"] });
      queryClient.invalidateQueries({ queryKey: ["permission", id] });
      // Don't close the modal - let user see the result
    },
    onError: (error: AxiosError) => {
      console.error(error);
      toastError(error.message);
    }
  });

  const isLoading = adding || updating || rechecking;

  if (shouldShowLoading) {
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
            object_selector: permissionData?.object_selector,
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
            error: permissionData?.error
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
                source={permissionData?.source}
                permissionId={permissionData?.id}
              />
            </div>
            <PermissionErrorDisplay
              error={permissionData?.error}
              showRecheckButton={
                !!permissionData?.id && !!permissionData?.error
              }
              onRecheck={() => permissionData?.id && recheck(permissionData.id)}
              isRechecking={rechecking}
            />
            <CanEditResource
              id={permissionData?.id}
              resourceType={"permissions"}
              source={permissionData?.source}
              className="flex items-center justify-between bg-gray-100 px-5 py-4"
            >
              <div className="flex items-center gap-2">
                {permissionData?.id && permissionData.source === "UI" && (
                  <AuthorizationAccessCheck
                    resource={tables.permissions}
                    action="write"
                  >
                    <DeletePermission
                      permissionId={permissionData.id}
                      onDeleted={onClose}
                    />
                  </AuthorizationAccessCheck>
                )}
              </div>
              <AuthorizationAccessCheck
                resource={tables.permissions}
                action="write"
              >
                <Button
                  type="submit"
                  text={permissionData?.id ? "Save" : "Create"}
                  className="btn-primary"
                  icon={
                    isLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : undefined
                  }
                  disabled={isLoading}
                />
              </AuthorizationAccessCheck>
            </CanEditResource>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
}
