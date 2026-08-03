import {
  addExternalUserAlias,
  mergeExternalUsers,
  searchExternalUsers
} from "@flanksource-ui/api/services/configAccess";
import {
  ConfigAccessSummaryByUser,
  ExternalUser
} from "@flanksource-ui/api/types/configs";
import useCurrentUserID from "@flanksource-ui/components/Authentication/useCurrentUser";
import { DropdownWithActions } from "@flanksource-ui/components/Dropdown/DropdownWithActions";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import { Input } from "@flanksource-ui/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  DotsVerticalIcon,
  LinkIcon,
  UserGroupIcon
} from "@heroicons/react/solid";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaCircleNotch } from "react-icons/fa";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function auditUserID(userID?: string) {
  return userID && uuidPattern.test(userID) ? userID : undefined;
}

function userLabel(user: {
  name?: string | null;
  email?: string | null;
  id: string;
}) {
  return user.name || user.email || user.id;
}

async function invalidateExternalUserQueries(
  queryClient: ReturnType<typeof useQueryClient>
) {
  await queryClient.invalidateQueries({
    queryKey: ["config", "access-summary"]
  });
}

export type ExternalUserAction = "alias" | "merge";

export function ExternalUserActionsMenu({
  user,
  onAction
}: {
  user: ConfigAccessSummaryByUser;
  onAction: (
    action: ExternalUserAction,
    user: ConfigAccessSummaryByUser
  ) => void;
}) {
  return (
    <div
      className="relative"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <Menu>
        <MenuButton
          className="min-w-7 rounded-full p-0.5 text-gray-400 hover:text-gray-600"
          aria-label={`Actions for ${userLabel({
            id: user.external_user_id,
            name: user.user,
            email: user.email
          })}`}
        >
          <DotsVerticalIcon className="h-6 w-6" />
        </MenuButton>
        <MenuItems
          portal
          anchor="bottom end"
          className="z-50 w-64 rounded-md bg-white py-1 shadow-card focus:outline-none"
        >
          <MenuItem
            as="button"
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100"
            onClick={() => onAction("alias", user)}
          >
            <LinkIcon className="h-4 w-4" />
            Add alias
          </MenuItem>
          <MenuItem
            as="button"
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100"
            onClick={() => onAction("merge", user)}
          >
            <UserGroupIcon className="h-4 w-4" />
            Merge duplicate into this user
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}

export function AddExternalUserAliasDialog({
  user,
  open,
  onOpenChange
}: {
  user?: ConfigAccessSummaryByUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [alias, setAlias] = useState("");
  const currentUserID = useCurrentUserID();
  const queryClient = useQueryClient();
  const normalizedAlias = alias.trim().toLowerCase();

  const mutation = useMutation({
    mutationFn: addExternalUserAlias,
    onSuccess: async () => {
      await invalidateExternalUserQueries(queryClient);
      toastSuccess(`Alias ${normalizedAlias} was added`);
      onOpenChange(false);
    }
  });

  useEffect(() => {
    if (open) {
      setAlias("");
      mutation.reset();
    }
    // mutation is intentionally omitted: its identity changes as state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.external_user_id]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!user || !normalizedAlias || mutation.isLoading) return;

    mutation.mutate({
      externalUserId: user.external_user_id,
      alias: normalizedAlias,
      createdBy: auditUserID(currentUserID)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Add external user alias</DialogTitle>
            <DialogDescription>
              Future scrapes using this alias will resolve to{" "}
              {user
                ? userLabel({
                    id: user.external_user_id,
                    name: user.user,
                    email: user.email
                  })
                : "this user"}{" "}
              instead of creating another external user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-5">
            <label htmlFor="external-user-alias" className="form-label">
              Alias
            </label>
            <Input
              id="external-user-alias"
              autoFocus
              value={alias}
              onChange={(event) => setAlias(event.target.value)}
              placeholder="github://username"
              disabled={mutation.isLoading}
            />
            {alias && normalizedAlias !== alias && (
              <p className="text-xs text-gray-500">
                Stored as <span className="font-mono">{normalizedAlias}</span>
              </p>
            )}
            {mutation.error ? <ErrorViewer error={mutation.error} /> : null}
          </div>

          <DialogFooter>
            <button
              type="button"
              className="btn btn-white"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!normalizedAlias || mutation.isLoading}
            >
              {mutation.isLoading && (
                <FaCircleNotch className="mr-1 inline animate-spin" />
              )}
              Add alias
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type ExternalUserOption = ExternalUser & {
  value: string;
  description: string;
};

function externalUserOption(user: ExternalUser): ExternalUserOption {
  const name = userLabel(user);
  return {
    ...user,
    value: user.id,
    description:
      user.email && user.email !== name ? `${name} (${user.email})` : name
  };
}

function ExternalUserOptionLabel({ option }: { option: ExternalUserOption }) {
  return (
    <div className="min-w-0">
      <div className="truncate font-medium">{userLabel(option)}</div>
      {option.email && option.email !== option.name && (
        <div className="truncate text-xs text-gray-500">{option.email}</div>
      )}
      {option.aliases && option.aliases.length > 0 && (
        <div className="truncate text-xs text-gray-500">
          {option.aliases.slice(0, 2).join(", ")}
        </div>
      )}
      <div className="truncate font-mono text-xs text-gray-400">
        {option.id}
      </div>
    </div>
  );
}

export function MergeExternalUserDialog({
  primary,
  open,
  onOpenChange
}: {
  primary?: ConfigAccessSummaryByUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [duplicate, setDuplicate] = useState<ExternalUserOption>();
  const currentUserID = useCurrentUserID();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mergeExternalUsers,
    onSuccess: async () => {
      await invalidateExternalUserQueries(queryClient);
      toastSuccess("External users were merged");
      onOpenChange(false);
    }
  });

  useEffect(() => {
    if (open) {
      setDuplicate(undefined);
      mutation.reset();
    }
    // mutation is intentionally omitted: its identity changes as state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, primary?.external_user_id]);

  const findUsers = useCallback(
    async (query: string) => {
      if (!primary) return [];
      try {
        const users = await searchExternalUsers({
          query,
          excludeId: primary.external_user_id
        });
        return users.map(externalUserOption);
      } catch (error) {
        toastError(error);
        return [];
      }
    },
    [primary]
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!primary || !duplicate || mutation.isLoading) return;

    mutation.mutate({
      primaryId: primary.external_user_id,
      duplicateId: duplicate.id,
      createdBy: auditUserID(currentUserID)
    });
  };

  const primaryName = primary
    ? userLabel({
        id: primary.external_user_id,
        name: primary.user,
        email: primary.email
      })
    : "the selected user";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Merge duplicate external user</DialogTitle>
            <DialogDescription>
              Select a duplicate to merge into <strong>{primaryName}</strong>.
              The selected row remains the primary user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-5">
            <div>
              <label htmlFor="duplicate-external-user" className="form-label">
                Duplicate user
              </label>
              <DropdownWithActions<ExternalUserOption>
                label="Duplicate user"
                name="duplicateExternalUser"
                inputId="duplicate-external-user"
                onQuery={findUsers}
                value={duplicate}
                setValue={(_name: string, value?: ExternalUserOption) =>
                  setDuplicate(value?.value ? value : undefined)
                }
                dependentValue={primary?.external_user_id}
                disabled={mutation.isLoading}
                displayOption={({ option }) => (
                  <ExternalUserOptionLabel option={option} />
                )}
              />
            </div>

            {duplicate && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Access grants, reviews, logs, groups, and aliases belonging to
                <strong> {userLabel(duplicate)}</strong> will move to
                <strong> {primaryName}</strong>. The duplicate user will be
                soft-deleted.
              </div>
            )}

            {mutation.error ? <ErrorViewer error={mutation.error} /> : null}
          </div>

          <DialogFooter>
            <button
              type="button"
              className="btn btn-white"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-danger"
              disabled={!duplicate || mutation.isLoading}
            >
              {mutation.isLoading && (
                <FaCircleNotch className="mr-1 inline animate-spin" />
              )}
              Merge users
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
