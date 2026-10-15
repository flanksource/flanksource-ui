import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FaUsers } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import {
  addUserToTeam,
  getTeamMembers,
  removeUserFromTeam,
  TeamMember
} from "../../api/services/teams";
import { getPersons } from "../../api/services/users";
import { User } from "../../api/types/users";
import { tables } from "../../context/UserAccessContext/permissions";
import { ConfirmationPromptDialog } from "../../ui/AlertDialog/ConfirmationPromptDialog";
import { Avatar } from "../../ui/Avatar";
import { TextInputClearable } from "../../ui/FormControls/TextInputClearable";
import { Modal } from "../../ui/Modal";
import TableSkeletonLoader from "../../ui/SkeletonLoader/TableSkeletonLoader";
import MultiSelectList from "../MultiSelectList/MultiSelectList";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import { toastError, toastSuccess } from "../Toast/toast";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Memberships added outside the UI are re-synced by their source, so removing
// them here would not stick.
const memberSourceLabels: Record<string, string> = {
  KubernetesCRD: "Kubernetes",
  "team-mapper": "SSO",
  shipped: "Built-in"
};

function isManagedOutsideUI(member: TeamMember) {
  return !!member.source && member.source !== "UI";
}

function pluralize(count: number, word: string) {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}

type TeamMembersProps = {
  teamId: string;
};

export function TeamMembers({ teamId }: TeamMembersProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [candidates, setCandidates] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [memberToRemove, setMemberToRemove] = useState<TeamMember>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const filteredCandidates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return candidates;
    }
    return candidates.filter(
      (person) =>
        person.name?.toLowerCase().includes(query) ||
        person.email?.toLowerCase().includes(query)
    );
  }, [candidates, searchQuery]);

  async function fetchTeamMembers(id: string) {
    setIsLoading(true);
    try {
      const [{ data: members }, { data: people, error }] = await Promise.all([
        getTeamMembers(id),
        getPersons()
      ]);
      if (error) {
        toastError(error.message);
      }
      setTeamMembers(members);
      setCandidates(
        (people || []).filter(
          (person) =>
            // Only human users; agents and other service accounts have a type
            !person.type && !members.some((member) => member.id === person.id)
        )
      );
    } catch (ex) {
      toastError(ex as any);
    } finally {
      setIsLoading(false);
    }
  }

  async function removeTeamMember(member: TeamMember) {
    setIsRemoving(true);
    try {
      const { error } = await removeUserFromTeam(teamId, member.id);
      if (error) {
        toastError(error.message);
        return;
      }
      toastSuccess(`Removed ${member.name} from the team`);
      setMemberToRemove(undefined);
      fetchTeamMembers(teamId);
    } catch (ex) {
      toastError(ex as any);
    } finally {
      setIsRemoving(false);
    }
  }

  async function addTeamMembers(people: User[]) {
    setIsAdding(true);
    try {
      const { error } = await addUserToTeam(
        teamId,
        people.map((person) => person.id)
      );
      if (error) {
        toastError(error.message);
        return;
      }
      toastSuccess(
        people.length === 1
          ? `Added ${people[0].name} to the team`
          : `Added ${pluralize(people.length, "member")} to the team`
      );
      setOpen(false);
      fetchTeamMembers(teamId);
    } catch (ex) {
      toastError(ex as any);
    } finally {
      setIsAdding(false);
    }
  }

  const openAddMembersModal = () => {
    setSelectedMembers([]);
    setSearchQuery("");
    setOpen(true);
  };

  const toggleSelected = (person: User) => {
    setSelectedMembers((selected) =>
      selected.some((p) => p.id === person.id)
        ? selected.filter((p) => p.id !== person.id)
        : [...selected, person]
    );
  };

  useEffect(() => {
    if (!teamId) {
      return;
    }
    fetchTeamMembers(teamId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const isInitialLoad = isLoading && !teamMembers.length;

  return (
    <div className="flex flex-col gap-4 px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Members</h3>
          <p className="text-sm text-gray-500">
            {isInitialLoad
              ? "Loading members..."
              : pluralize(teamMembers.length, "member")}
          </p>
        </div>
        <AuthorizationAccessCheck resource={tables.teams} action="update">
          <Button onClick={openAddMembersModal}>
            <Plus />
            Add members
          </Button>
        </AuthorizationAccessCheck>
      </div>

      {isInitialLoad ? (
        <TableSkeletonLoader className="mt-2" />
      ) : !teamMembers.length ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 px-4 py-12 text-center">
          <FaUsers className="h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-900">
            No members yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Add people to this team to manage their access and notifications
            together.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
          {teamMembers.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar user={member} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {member.name}
                  </p>
                  {member.email && (
                    <p className="truncate text-sm text-gray-500">
                      {member.email}
                    </p>
                  )}
                </div>
              </div>
              {isManagedOutsideUI(member) && (
                <Badge variant="secondary" className="font-medium">
                  {memberSourceLabels[member.source!] ?? member.source}
                </Badge>
              )}
              <AuthorizationAccessCheck resource={tables.teams} action="update">
                {isManagedOutsideUI(member) ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* Disabled buttons don't emit hover events */}
                      <span>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled
                          aria-label={`${member.name} can't be removed here`}
                        >
                          <Trash2 />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Managed by{" "}
                      {memberSourceLabels[member.source!] ?? member.source}.
                      Remove this member at the source.
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Remove from team"
                    aria-label={`Remove ${member.name} from team`}
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => setMemberToRemove(member)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </AuthorizationAccessCheck>
            </li>
          ))}
        </ul>
      )}

      <ConfirmationPromptDialog
        isOpen={!!memberToRemove}
        title="Remove member"
        description={
          <>
            Remove <b>{memberToRemove?.name}</b> from this team?
          </>
        }
        yesLabel="Remove"
        isLoading={isRemoving}
        onClose={() => setMemberToRemove(undefined)}
        onConfirm={() => memberToRemove && removeTeamMember(memberToRemove)}
      />

      <Modal
        title="Add members"
        open={open}
        onClose={() => setOpen(false)}
        size="medium"
        bodyClass="flex flex-col"
      >
        <div className="flex flex-col gap-4 p-4">
          <TextInputClearable
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            hideButton
          />
          <div className="h-72 overflow-y-auto">
            {filteredCandidates.length ? (
              <MultiSelectList
                viewOnly={false}
                options={filteredCandidates}
                onOptionSelect={toggleSelected}
                selectedOptions={selectedMembers}
                renderOption={(person) => (
                  <div className="flex" key={person.id}>
                    <Avatar user={person} />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">{person.name}</p>
                      {person.email && (
                        <p className="text-xs text-gray-500">
                          <HiOutlineMail className="inline-block h-4 w-4 pr-1" />
                          {person.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                {searchQuery.trim()
                  ? "No people match your search."
                  : "Everyone is already a member of this team."}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-b bg-gray-100 px-4 py-3">
          <span className="text-sm text-gray-500">
            {selectedMembers.length ? `${selectedMembers.length} selected` : ""}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedMembers.length || isAdding}
              onClick={() => addTeamMembers(selectedMembers)}
            >
              {isAdding
                ? "Adding..."
                : selectedMembers.length
                  ? `Add ${pluralize(selectedMembers.length, "member")}`
                  : "Add members"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
