import { IncidentCommander } from "../axios";

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

/*
 * Sample response
 {
   "message" : "success",
   "payload" : [
      {
         "created_at" : "2025-08-05T15:39:31.791334+05:30",
         "id" : "019879b5-268f-a187-78fc-30c76e104d12",
         "name" : "agent-1754388571",
         "person" : {
            "avatar" : "he",
            "id" : "019879af-7e34-2dfa-2669-a462ec054ac5",
            "name" : "yash",
            "properties" : {}
         },
         "person_id" : "019879af-7e34-2dfa-2669-a462ec054ac5"
      },
      {
         "created_at" : "2025-08-05T15:41:37.146117+05:30",
         "id" : "019879b7-103a-e32e-5304-05b029b1a0aa",
         "name" : "agent-1754388697",
         "person" : {
            "id" : "019879af-9703-e9a7-14d8-9015cf5e309d",
            "name" : "aditya",
            "properties" : {}
         },
         "person_id" : "019879af-9703-e9a7-14d8-9015cf5e309d"
      }
   ]
}

 */

export async function getTokensList(): Promise<Token[]> {
  //const response = await IncidentCommander.get<TokensResponse>("/auth/tokens");
  //return response.data.payload ?? [];
  const response = {
    message: "success",
    payload: [
      {
        created_at: "2025-08-05T15:39:31.791334+05:30",
        id: "019879b5-268f-a187-78fc-30c76e104d12",
        name: "claude-code",
        person: {
          avatar: "he",
          id: "019879af-7e34-2dfa-2669-a462ec054ac5",
          name: "yash",
          properties: {}
        },
        person_id: "019879af-7e34-2dfa-2669-a462ec054ac5"
      },
      {
        created_at: "2025-08-05T15:41:37.146117+05:30",
        id: "019879b7-103a-e32e-5304-05b029b1a0aa",
        name: "agent-1754388697",
        person: {
          id: "019879af-9703-e9a7-14d8-9015cf5e309d",
          name: "aditya",
          properties: {}
        },
        person_id: "019879af-9703-e9a7-14d8-9015cf5e309d"
      }
    ]
  };
  return response.payload;
}
