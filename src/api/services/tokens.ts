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
  roles?: TokenRole[];
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
