import { PermissionSubject } from "@flanksource-ui/api/services/permissions";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import { Input } from "@flanksource-ui/components/ui/input";

export type PermissionSubjectGroup = {
  type: PermissionSubject["type"];
  list: PermissionSubject[];
};

type PermissionSubjectPanelProps = {
  subjectSearch: string;
  onSubjectSearchChange: (value: string) => void;
  groupedSubjects: PermissionSubjectGroup[];
  selectedSubjectId: string | null;
  onSelectSubject: (subjectId: string) => void;
};

const TYPE_LABELS: Record<PermissionSubject["type"], string> = {
  person: "person",
  access_token_person: "access token",
  team: "team",
  role: "role",
  playbook: "playbook",
  plugin: "plugin",
  permission_subject_group: "group"
};

const SUBJECT_TYPE_ORDER: Record<PermissionSubject["type"], number> = {
  role: 0,
  permission_subject_group: 1,
  team: 2,
  person: 3,
  access_token_person: 4,
  playbook: 5,
  plugin: 6
};

function sortSubjectGroups(groups: PermissionSubjectGroup[]) {
  return [...groups].sort((left, right) => {
    const leftOrder = SUBJECT_TYPE_ORDER[left.type] ?? Number.MAX_SAFE_INTEGER;
    const rightOrder =
      SUBJECT_TYPE_ORDER[right.type] ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.type.localeCompare(right.type);
  });
}

export default function PermissionSubjectPanel({
  subjectSearch,
  onSubjectSearchChange,
  groupedSubjects,
  selectedSubjectId,
  onSelectSubject
}: PermissionSubjectPanelProps) {
  return (
    <div className="flex w-full min-w-0 flex-col">
      <Input
        placeholder="Search subjects..."
        value={subjectSearch}
        onChange={(event) => onSubjectSearchChange(event.target.value)}
      />

      <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto">
        {sortSubjectGroups(groupedSubjects).map((group) => (
          <div key={group.type} className="space-y-1">
            <div className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {TYPE_LABELS[group.type] ?? group.type}
            </div>

            {group.list.map((subject) => {
              const isActive = subject.id === selectedSubjectId;

              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => onSelectSubject(subject.id)}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-800"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <SubjectAvatar subject={subject} size="xs" />
                  <span className="truncate">{subject.name}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
