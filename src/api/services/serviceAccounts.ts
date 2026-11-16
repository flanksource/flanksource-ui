import { apiBase, IncidentCommander } from "../axios";
import { RoleBindingDB } from "../types/roleBindings";
import { TokenRole, TokenRoleBinding } from "./tokens";

type PersonInfo = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
};

export type ServiceAccount = {
  id: string;
  name: string;
  created_at: string;
  /** Whoever created it, recorded for audit only. */
  created_by?: PersonInfo | null;
};

export type ServiceAccountDetail = ServiceAccount & {
  /** What it holds of kubernetes-proxy:read and kubernetes-proxy:write */
  kubernetes_proxy?: Record<string, boolean>;
  /** Omitted unless the caller may read RoleBindings */
  role_bindings?: RoleBindingDB[];
};

export type ServiceAccountToken = {
  id: string;
  name: string;
  created_at: string;
  expires_at?: string | null;
  auto_renew?: boolean;
  /** Whoever issued the token */
  issuer?: PersonInfo | null;
  role_bindings?: TokenRoleBinding[];
};

export type CreateServiceAccountTokenRequest = {
  name: string;
  expiry: string;
  autoRenew: boolean;
  roles: TokenRole[];
};

export type CreatedServiceAccountToken = {
  id: string;
  name: string;
  token: string;
  expires_at?: string;
};

// Every route takes service-account:manage, and is refused to a request made with an access token
export async function getServiceAccounts() {
  const { data } = await apiBase.get<ServiceAccount[]>("/service-accounts");
  return data ?? [];
}

export async function getServiceAccount(name: string) {
  const { data } = await apiBase.get<ServiceAccountDetail>(
    `/service-accounts/${encodeURIComponent(name)}`
  );
  return data;
}

export async function createServiceAccount(name: string) {
  const { data } = await apiBase.post<ServiceAccount>("/service-accounts", {
    name
  });
  return data;
}

export async function deleteServiceAccount(name: string) {
  await apiBase.delete(`/service-accounts/${encodeURIComponent(name)}`);
}

export async function getServiceAccountTokens(name: string) {
  const { data } = await apiBase.get<ServiceAccountToken[]>(
    `/service-accounts/${encodeURIComponent(name)}/tokens`
  );
  return data ?? [];
}

export async function createServiceAccountToken(
  name: string,
  request: CreateServiceAccountTokenRequest
) {
  const { data } = await apiBase.post<CreatedServiceAccountToken>(
    `/service-accounts/${encodeURIComponent(name)}/tokens`,
    request
  );
  return data;
}

export async function revokeServiceAccountToken(name: string, id: string) {
  await apiBase.delete(
    `/service-accounts/${encodeURIComponent(name)}/tokens/${id}`
  );
}

/** Issues a new token of the service account, bound to the kubernetes-proxy Role, and returns a kubeconfig that uses it. */
export async function downloadServiceAccountKubeconfig(
  serviceAccount: string,
  options: { name?: string; expiry?: string; autoRenew?: boolean }
) {
  const { data } = await apiBase.get<string>("/kubeconfig", {
    params: {
      serviceAccount,
      ...(options.name ? { name: options.name } : {}),
      ...(options.expiry ? { expiry: options.expiry } : {}),
      ...(options.autoRenew ? { autoRenew: true } : {})
    }
    // The kubeconfig is YAML, which the default JSON parsing leaves as text, while an error's JSON body is still parsed
  });
  return data;
}

/** Names of service accounts, which anyone with read on person may see. Used to pick RoleBinding subjects. */
export async function getServiceAccountNames() {
  const { data } = await IncidentCommander.get<{ name: string }[]>("/people", {
    params: {
      select: "name",
      type: "eq.service_account",
      deleted_at: "is.null",
      order: "name.asc"
    }
  });
  return (data ?? []).map(({ name }) => name);
}
