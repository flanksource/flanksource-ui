/**
 * Header for the subject permissions view, showing the selected subject and a
 * search box for filtering resources in the matrix.
 */
import { PermissionSubject } from "@flanksource-ui/api/services/permissions";
import SubjectAvatar from "@flanksource-ui/components/Permissions/SubjectAvatar";
import { Input } from "@flanksource-ui/components/ui/input";

type SubjectPermissionsHeaderProps = {
  selectedSubject: PermissionSubject;
  search: string;
  onSearchChange: (value: string) => void;
};

export default function SubjectPermissionsHeader({
  selectedSubject,
  search,
  onSearchChange
}: SubjectPermissionsHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SubjectAvatar subject={selectedSubject} size="md" />
        <div className="flex min-w-0 items-baseline gap-2">
          <div className="truncate text-base font-semibold text-gray-900">
            {selectedSubject.name}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[360px]">
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </div>
  );
}
