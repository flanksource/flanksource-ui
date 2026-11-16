import {
  createServiceAccount,
  deleteServiceAccount,
  getServiceAccounts,
  ServiceAccount
} from "@flanksource-ui/api/services/serviceAccounts";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import { toastSuccess } from "@flanksource-ui/components/Toast/toast";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

// A service account's name is a DNS-1123 label
const nameRule = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

function CreateServiceAccountModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isLoading, error, reset } = useMutation({
    mutationFn: createServiceAccount,
    onSuccess: (account) => {
      toastSuccess(`Service account ${account.name} created`);
      queryClient.invalidateQueries(["service-accounts"]);
      navigate(`/settings/service-accounts/${account.name}`);
    }
  });

  const close = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Create service account"
      onClose={close}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <Formik
        initialValues={{ name: "" }}
        validateOnMount
        validate={({ name }) => {
          if (!name) {
            return { name: "Name is required" };
          }
          if (name.length > 63 || !nameRule.test(name)) {
            return {
              name: "Use at most 63 lowercase letters, numbers and '-', starting and ending with a letter or number"
            };
          }
          return {};
        }}
        onSubmit={({ name }) => mutate(name)}
      >
        {({ isValid }) => (
          <Form className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <FormikTextInput
                name="name"
                label="Name"
                required
                hint="Names it in RoleBindings. It can't be changed later."
              />
              <p className="text-sm text-gray-500">
                A new service account can do nothing until a RoleBinding names
                it in serviceAccounts. RoleBindings that already name it apply
                at once.
              </p>
              {error != null && <ErrorViewer error={error} />}
            </div>
            <div className="flex items-center justify-end bg-gray-100 px-5 py-4">
              <Button
                type="submit"
                text={isLoading ? "Creating..." : "Create"}
                className="btn-primary"
                disabled={!isValid || isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

/** Asks before deleting a service account, which revokes its tokens; the RoleBindings that name it are left alone. */
export function DeleteServiceAccountDialog({
  account,
  onClose,
  onDeleted
}: {
  account?: string;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate, isLoading, error, reset } = useMutation({
    mutationFn: deleteServiceAccount,
    onSuccess: () => {
      toastSuccess(`Service account ${account} deleted`);
      queryClient.invalidateQueries(["service-accounts"]);
      onDeleted?.();
      onClose();
    }
  });

  return (
    <ConfirmationPromptDialog
      title="Delete service account"
      description={
        <div className="flex flex-col gap-2">
          <p>
            Delete <b>{account}</b>? Its tokens are revoked at once. The
            RoleBindings that name it are kept, and apply to any service account
            created later with the same name.
          </p>
          {error != null && <ErrorViewer error={error} />}
        </div>
      }
      yesLabel="Delete"
      isLoading={isLoading}
      isOpen={!!account}
      onConfirm={() => account && mutate(account)}
      onClose={() => {
        reset();
        onClose();
      }}
    />
  );
}

export default function ServiceAccountsPage() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string>();

  const {
    data: accounts = [],
    isLoading,
    isRefetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["service-accounts"],
    queryFn: getServiceAccounts
  });

  const columns = useMemo<MRT_ColumnDef<ServiceAccount>[]>(
    () => [
      { header: "Name", accessorKey: "name", size: 200 },
      {
        header: "Created",
        accessorKey: "created_at",
        Cell: MRTDateCell,
        sortingFn: "datetime",
        size: 80
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableColumnActions: false,
        maxSize: 30,
        Cell: ({ row }) => (
          <div className="text-right">
            <button
              type="button"
              className="text-red-600 hover:text-red-800"
              onClick={(e) => {
                // Don't open the account behind the confirmation
                e.stopPropagation();
                setAccountToDelete(row.original.name);
              }}
            >
              Delete
            </button>
          </div>
        )
      }
    ],
    []
  );

  return (
    <>
      <Head prefix="Service Accounts" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="root" link="/settings/service-accounts">
                Service Accounts
              </BreadcrumbRoot>,
              <button
                type="button"
                key="add"
                title="Create service account"
                onClick={() => setIsCreateOpen(true)}
              >
                <AiFillPlusCircle size={32} className="text-blue-600" />
              </button>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex h-full w-full flex-1 flex-col gap-4 p-6 pb-0">
          <p className="text-sm text-gray-500">
            Service accounts are subjects for automation, such as CI jobs and
            integrations. They sign in only with their tokens, and get access
            only from RoleBindings that name them.
          </p>
          {error ? (
            <ErrorViewer error={error} />
          ) : (
            <MRTDataTable
              data={accounts}
              columns={columns}
              isLoading={isLoading}
              isRefetching={isRefetching}
              enableServerSideSorting={false}
              onRowClick={(account) =>
                navigate(`/settings/service-accounts/${account.name}`)
              }
            />
          )}
        </div>
      </SearchLayout>

      <CreateServiceAccountModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <DeleteServiceAccountDialog
        account={accountToDelete}
        onClose={() => setAccountToDelete(undefined)}
      />
    </>
  );
}
