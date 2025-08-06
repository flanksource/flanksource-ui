import { apiBase } from "../axios";

export type Token = {
  id: string;
  name: string;
  created_at: string;
  expires_at: string;
  person: {
    avatar?: string;
    id: string;
    name: string;
    properties: Record<string, any>;
  };
  person_id: string;
};

export type TokensResponse = {
  message: string;
  payload: Token[];
};

export type CreateTokenRequest = {
  name: string;
  expiry: string;
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
