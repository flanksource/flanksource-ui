import { Rback } from "../axios";

export type Permission = {
  id?: string;
  subject: string;
  object: string;
  action: string;
  deny?: boolean;
};

export type PermissionsResponse = {
  message: string;
  payload: Permission[];
};

export async function getPermissions(): Promise<Permission[]> {
  //const response = await Rback.get<PermissionsResponse>("/permissions");
  //return response.data.payload ?? [];
  return [
    { subject: "yash", object: "playbook", action: "read" },
    { subject: "yash", object: "catalog", action: "read" },
    { subject: "yash", object: "check", action: "*" }
  ];
}
