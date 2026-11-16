import {
  getServiceAccount,
  ServiceAccountDetail
} from "@flanksource-ui/api/services/serviceAccounts";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import { roleBindingsPathForSubject } from "@flanksource-ui/api/types/roleBindings";
import { RbacObjectStatus } from "@flanksource-ui/components/Permissions/Rbac/RbacObjectStatus";
import { summarizeSubjects } from "@flanksource-ui/components/RoleBindings/RoleBindingsTable";
import { useUser } from "@flanksource-ui/context";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Age } from "@flanksource-ui/ui/Age";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash, FaUserShield } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import ServiceAccountKubeconfigModal, {
  KubernetesProxyWarning
} from "./ServiceAccountKubeconfigModal";
import { DeleteServiceAccountDialog } from "./ServiceAccountsPage";
import ServiceAccountTokensTab from "./ServiceAccountTokensTab";

function canUseKubernetesProxy(account?: ServiceAccountDetail) {
  return (
    account?.kubernetes_proxy?.["kubernetes-proxy:read"] === true ||
    account?.kubernetes_proxy?.["kubernetes-proxy:write"] === true
  );
}

// The bindings are read-only here: they're edited on the RoleBindings page
function ServiceAccountRoleBindings({
  account
}: {
  account: ServiceAccountDetail;
}) {
  const bindings = account.role_bindings ?? [];
  const filteredPath = roleBindingsPathForSubject({
    field: "serviceAccounts",
    name: account.name
  });

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-base font-semibold text-gray-900">Role Bindings</h3>
      <p className="text-sm text-gray-500">
        {account.name} can do what these bindings grant. To change its access,
        edit or add a RoleBinding that names it in serviceAccounts.
      </p>
      {bindings.length === 0 ? (
        <div className="rounded-md border border-gray-200 p-4 text-center text-sm text-gray-500">
          No RoleBinding names {account.name}, so it can do nothing.
        </div>
      ) : (
        <table className="w-full table-auto text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-2 py-2 font-medium">Name</th>
              <th className="px-2 py-2 font-medium">Role</th>
              <th className="px-2 py-2 font-medium">Subjects</th>
              <th className="px-2 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bindings.map((binding) => (
              <tr key={binding.id} className="border-b border-gray-100">
                <td className="px-2 py-2">
                  <Link
                    // Opens the binding over the bindings that name the account
                    to={`${filteredPath}&id=${binding.id}`}
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    {binding.name}
                    {binding.namespace && (
                      <Badge text={binding.namespace} color="gray" />
                    )}
                  </Link>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    {binding.role}
                    {binding.deny && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">
                        Deny
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2 text-gray-700">
                  {summarizeSubjects(binding.subjects).join(", ")}
                </td>
                <td className="px-2 py-2">
                  <RbacObjectStatus {...binding} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function ServiceAccountOverview({
  account,
  canReadRoleBindings,
  onDownloadKubeconfig
}: {
  account: ServiceAccountDetail;
  canReadRoleBindings: boolean;
  onDownloadKubeconfig: () => void;
}) {
  const canUseProxy = canUseKubernetesProxy(account);

  return (
    <div className="flex flex-col gap-6 p-4">
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="text-gray-500">Name</dt>
        <dd className="text-gray-900">{account.name}</dd>
        <dt className="text-gray-500">Created</dt>
        <dd>
          <Age from={account.created_at} suffix />
        </dd>
      </dl>

      <section className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-gray-900">Kubeconfig</h3>
        <p className="text-sm text-gray-500">
          A kubeconfig for the Kubernetes proxy, signed in as {account.name}.
          Each download issues a new token.
        </p>
        {!canUseProxy && <KubernetesProxyWarning account={account.name} />}
        <div>
          <Button
            text="Download kubeconfig"
            icon={<IoMdDownload />}
            className="btn-white"
            onClick={onDownloadKubeconfig}
          />
        </div>
      </section>

      {canReadRoleBindings && <ServiceAccountRoleBindings account={account} />}
    </div>
  );
}

export default function ServiceAccountPage({
  tab
}: {
  tab: "Overview" | "Tokens";
}) {
  const { name = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { access } = useUser();
  const roleBindingsRead = access?.[tables.role_bindings]?.read;
  const canReadRoleBindings =
    roleBindingsRead === "all" || roleBindingsRead === "some";

  const [isKubeconfigOpen, setIsKubeconfigOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data: account,
    isLoading,
    isRefetching,
    error
  } = useQuery({
    queryKey: ["service-accounts", name],
    queryFn: () => getServiceAccount(name)
  });

  const basePath = `/settings/service-accounts/${name}`;

  return (
    <>
      <Head prefix={`Service Accounts - ${name}`} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="root" link="/settings/service-accounts">
                Service Accounts
              </BreadcrumbRoot>,
              <BreadcrumbChild key="name">{name}</BreadcrumbChild>
            ]}
          />
        }
        extra={
          account && (
            <div className="flex flex-row gap-2">
              {canReadRoleBindings && (
                <Button
                  text="Manage role bindings"
                  icon={<FaUserShield />}
                  className="btn-white"
                  onClick={() =>
                    navigate(
                      roleBindingsPathForSubject({
                        field: "serviceAccounts",
                        name: account.name
                      })
                    )
                  }
                />
              )}
              <Button
                text="Delete"
                icon={<FaTrash />}
                className="btn-danger"
                onClick={() => setIsDeleteOpen(true)}
              />
            </div>
          )
        }
        onRefresh={() =>
          queryClient.invalidateQueries(["service-accounts", name])
        }
        loading={isLoading || isRefetching}
        contentClass="p-0 h-full overflow-y-hidden"
      >
        <TabbedLinks
          activeTabName={tab}
          tabLinks={[
            { label: "Overview", key: "Overview", path: basePath },
            { label: "Tokens", key: "Tokens", path: `${basePath}/tokens` }
          ]}
          contentClassName="bg-white border border-t-0 border-gray-300 flex-1 overflow-y-auto"
        >
          {isLoading ? (
            <FormSkeletonLoader />
          ) : error || !account ? (
            <div className="p-4">
              <ErrorViewer error={error} />
            </div>
          ) : tab === "Tokens" ? (
            <ServiceAccountTokensTab account={account.name} />
          ) : (
            <ServiceAccountOverview
              account={account}
              canReadRoleBindings={canReadRoleBindings}
              onDownloadKubeconfig={() => setIsKubeconfigOpen(true)}
            />
          )}
        </TabbedLinks>
      </SearchLayout>

      {account && (
        <ServiceAccountKubeconfigModal
          account={account.name}
          canUseProxy={canUseKubernetesProxy(account)}
          isOpen={isKubeconfigOpen}
          onClose={() => setIsKubeconfigOpen(false)}
        />
      )}
      <DeleteServiceAccountDialog
        account={isDeleteOpen ? name : undefined}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={() => navigate("/settings/service-accounts")}
      />
    </>
  );
}
