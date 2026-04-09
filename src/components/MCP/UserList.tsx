import {
  MCP_SETTINGS_PERMISSION_SOURCE,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import SubjectAccessCard from "@flanksource-ui/components/Permissions/SubjectAccessCard";

const MCP_OBJECT = "mcp";
const MCP_ACTION = "mcp:use";

const TYPE_LABELS: Record<PermissionSubject["type"], string> = {
  person: "person",
  access_token_person: "access token",
  team: "team",
  role: "role",
  permission_subject_group: "group"
};

type GroupedSubject = {
  type: PermissionSubject["type"];
  subjects: PermissionSubject[];
};

type Props = {
  groupedSubjects: GroupedSubject[];
  permissionsByUser: Map<string, PermissionsSummary[]>;
  mutatingSubjectId: string | null;
  onChangeAccess: (
    subject: PermissionSubject,
    access: "allow" | "deny" | "default"
  ) => void;
};

export default function UserList({
  groupedSubjects,
  permissionsByUser,
  mutatingSubjectId,
  onChangeAccess
}: Props) {
  return (
    <div className="flex h-full w-full flex-1 flex-col gap-4 p-6 pb-6">
      {groupedSubjects.map((group) => (
        <div key={group.type} className="space-y-1">
          <div className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 first:pt-0">
            {TYPE_LABELS[group.type] ?? group.type}
          </div>

          <div className="[&>*+*]:border-t [&>*+*]:border-gray-200 [&>*+*]:pt-2 [&>*]:pb-2">
            {group.subjects.map((subject) => {
              const permissions = permissionsByUser.get(subject.id) ?? [];

              const activePermission = permissions.find(
                (permission) =>
                  permission.source === MCP_SETTINGS_PERMISSION_SOURCE
              );

              const access = !activePermission
                ? "default"
                : activePermission.deny === true
                  ? "deny"
                  : "allow";

              return (
                <SubjectAccessCard
                  key={subject.id}
                  user={{
                    id: subject.id,
                    name: subject.name,
                    type: subject.type
                  }}
                  action={MCP_ACTION}
                  object={MCP_OBJECT}
                  access={access}
                  isMutating={mutatingSubjectId === subject.id}
                  onChangeAccess={(access) => onChangeAccess(subject, access)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
