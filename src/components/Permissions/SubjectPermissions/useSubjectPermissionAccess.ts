/**
 * Hook that creates, updates, or removes settings-managed direct permissions for
 * the selected subject/resource/action combination.
 */
import {
  addPermission,
  deletePermission,
  fetchSettingsManagedSubjectPermissions,
  INTERACTIVE_SETTINGS_PERMISSION_SOURCE,
  PermissionSubject,
  updatePermission
} from "@flanksource-ui/api/services/permissions";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { mapSubjectType } from "@flanksource-ui/lib/permissions/mcpPermissionCardMappings";
import {
  AccessValue,
  PermissionResource,
  getObjectSelectorForResource,
  getPermissionActionForResource,
  getRefsForPermission,
  selectorRefMatchesExactResource,
  sortCanonicalPermissions
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import { useCallback, useState } from "react";

type UseSubjectPermissionAccessProps = {
  selectedSubject: PermissionSubject;
  onPermissionsUpdated: () => Promise<unknown>;
};

export default function useSubjectPermissionAccess({
  selectedSubject,
  onPermissionsUpdated
}: UseSubjectPermissionAccessProps) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setPermissionAccess = useCallback(
    async (
      resource: PermissionResource,
      action: string,
      access: AccessValue
    ) => {
      setIsSubmitting(true);

      try {
        const latestPermissions = await fetchSettingsManagedSubjectPermissions(
          selectedSubject.id
        );
        const subjectType = mapSubjectType(selectedSubject.type);
        const permissionAction = getPermissionActionForResource(
          resource,
          action
        );

        const matchingPermissions = sortCanonicalPermissions(
          latestPermissions.filter((permission) => {
            if (
              permission.action !== permissionAction ||
              permission.subject !== selectedSubject.id ||
              permission.subject_type !== subjectType ||
              !permission.id
            ) {
              return false;
            }

            const refs = getRefsForPermission(permission, resource.selectorKey);

            if (resource.kind === "plugin") {
              return refs.some((ref) => ref.name === "*" && !ref.namespace);
            }

            return refs.some((ref) =>
              selectorRefMatchesExactResource(ref, resource)
            );
          })
        );

        if (access === "default") {
          await Promise.all(
            matchingPermissions.map((permission) =>
              deletePermission(permission.id!)
            )
          );
        } else {
          const deny = access === "deny";
          const [primary, ...duplicates] = matchingPermissions;

          if (!primary) {
            await addPermission({
              action: permissionAction,
              object_selector: getObjectSelectorForResource(resource),
              subject: selectedSubject.id,
              subject_type: subjectType,
              deny,
              source: INTERACTIVE_SETTINGS_PERMISSION_SOURCE,
              created_by: user?.id
            } as any);
          } else {
            if (primary.deny !== deny) {
              await updatePermission({ id: primary.id, deny } as any);
            }

            if (duplicates.length > 0) {
              await Promise.all(
                duplicates.map((permission) => deletePermission(permission.id!))
              );
            }
          }
        }

        toastSuccess("Updated permission");
        await onPermissionsUpdated();
      } catch (error) {
        toastError(error as any);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onPermissionsUpdated, selectedSubject.id, selectedSubject.type, user?.id]
  );

  return {
    isSubmitting,
    setPermissionAccess
  };
}
