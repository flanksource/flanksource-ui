import { apiBase } from "../axios";

export type TokenRole = {
  namespace: string;
  name: string;
};

export type Token = {
  id: string;
  name: string;
  created_at: string;
  expires_at?: string | null;
  /** Always the caller: a personal token signs in as its owner. */
  person?: {
    avatar?: string;
    id: string;
    name: string;
    type?: string;
    properties: Record<string, any>;
  };
  person_id: string;
  /** The RoleBindings created with the token, which limit what it may do. */
  role_bindings?: TokenRoleBinding[];
};

/** A RoleBinding that limits a token, as its owner sees it. */
export type TokenRoleBinding = {
  id: string;
  name: string;
  /** The Role, as namespace/name */
  role: string;
  ready: boolean;
  error_reason?: string;
  /** Only present when the owner may read Roles */
  error?: string;
};

export type TokensResponse = {
  message: string;
  payload: Token[];
};

export type CreateTokenRequest = {
  name: string;
  expiry: string;
  auto_renew?: boolean;
  roles: TokenRole[];
};

export type CreateTokenResponse = {
  message: string;
  payload: {
    token: string;
  };
};

export async function createToken(
  request: CreateTokenRequest
): Promise<CreateTokenResponse> {
  const response = await apiBase.post<CreateTokenResponse>(
    "/auth/create_token",
    request
  );
  return response.data;
}

export async function getTokensList(): Promise<Token[]> {
  const response = await apiBase.get<TokensResponse>("/auth/tokens");
  return response.data.payload ?? [];
}

export async function deleteToken(id: string): Promise<void> {
  await apiBase.delete(`/auth/token/${id}`);
}
