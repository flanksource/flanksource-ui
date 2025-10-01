import {
  addPermission,
  updatePermission
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
import { useMutation } from "@tanstack/react-query";
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

function PermissionActionDropdown() {
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
    />
  );
}

export default function PermissionForm({
  onClose,
  isOpen = false,
  data
}: PermissionFormProps) {
  const isResourceIdProvided = useMemo(() => {
    return (
      data?.component_id ||
      data?.config_id ||
      data?.canary_id ||
      data?.canary_id ||
      data?.playbook_id ||
      data?.connection_id ||
      data?.object
    );
  }, [data]);

  const { user } = useUser();

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
      // do something
      toastSuccess("Permission added");
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
      // do something
      toastSuccess("Permission updated");
      onClose();
    },
    onError: (error: AxiosError) => {
      // do something
      console.error(error);
      toastError(error.message);
    }
  });

  const isLoading = adding || updating;

  return (
    <Modal
      title={data?.id ? "Edit Permission" : "Add Permission"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      helpLink="/reference/permissions"
    >
      <div className="flex flex-1 flex-col gap-2">
        <Formik<Partial<PermissionTable>>
          initialValues={{
            action: data?.action,
            component_id: data?.component_id,
            config_id: data?.config_id,
            canary_id: data?.canary_id,
            playbook_id: data?.playbook_id,
            deny: data?.deny ?? false,
            object: data?.object,
            description: data?.description,
            connection_id: data?.connection_id,
            created_at: data?.created_at,
            created_by: data?.created_by,
            updated_at: data?.updated_at,
            updated_by: data?.updated_by,
            id: data?.id,
            notification_id: data?.notification_id,
            person_id: data?.person_id,
            team_id: data?.team_id,
            subject: data?.subject,
            subject_type: data?.subject_type,
            until: data?.until,
            source: data?.source || "UI",
            tags: data?.tags || {},
            agents: data?.agents || []
          }}
          onSubmit={(v) => {
            if (!data?.id) {
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
            <div className="flex flex-1 flex-col gap-3 p-4">
              <PermissionsSubjectControls />
              {isResourceIdProvided ? (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Resource</label>
                  <PermissionResource />
                </div>
              ) : (
                <FormikPermissionSelectResourceFields />
              )}
              <PermissionActionDropdown />
              <FormikCheckbox name="deny" label="Deny" />
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
                  />
                </div>
              </div>
              <FormikTextArea name="description" label="Description" />
            </div>
            <CanEditResource
              id={data?.id}
              name={"Permission"}
              resourceType={"permissions"}
              source={data?.source}
              className="flex flex-col"
            >
              <AuthorizationAccessCheck
                resource={tables.permissions}
                action="write"
              >
                <div
                  className={clsx(
                    "flex items-center bg-gray-100 px-5 py-4",
                    data?.id ? "justify-between" : "justify-end"
                  )}
                >
                  {data?.id && (
                    <DeletePermission
                      permissionId={data.id}
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
                    text={data?.id ? "Save" : isLoading ? "Saving ..." : "Save"}
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
