import { Rback } from "../axios";

export type Permission = {
  subject: string;
  object: string;
  action: string;
  deny?: boolean;
  condition?: string;
  id?: string;
};

export type PermissionsResponse = {
  message: string;
  payload: Permission[];
};

export function permissionHash(p: Permission): string {
  return `sub=${p.subject},obj=${p.object},act=${p.action},d=${p.deny ?? false},con=${p.condition ?? ""},id=${p.id ?? ""}`;
}

export function permissionFromHash(hash: string): Permission {
  const pairs = hash.split(",");
  const permission: Partial<Permission> = {};

  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    switch (key) {
      case "sub":
        permission.subject = value;
        break;
      case "obj":
        permission.object = value;
        break;
      case "act":
        permission.action = value;
        break;
      case "d":
        permission.deny = value === "true";
        break;
      case "con":
        permission.condition = value || undefined;
        break;
      case "id":
        permission.id = value || undefined;
        break;
    }
  });
  return permission as Permission;
}

export async function getPermissions(id: string): Promise<Permission[]> {
  const response = await Rback.get<PermissionsResponse>(
    `/token/${id}/permissions`
  );
  return response.data.payload ?? [];
}
