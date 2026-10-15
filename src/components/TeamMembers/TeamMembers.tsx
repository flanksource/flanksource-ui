import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FaUsers } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import {
  addUserToTeam,
  getTeamMembers,
  removeUserFromTeam
} from "../../api/services/teams";
import { getPersons } from "../../api/services/users";
import { User } from "../../api/types/users";
import { useLoader } from "../../hooks";
import { Avatar } from "../../ui/Avatar";
import { TextInputClearable } from "../../ui/FormControls/TextInputClearable";
import { Modal } from "../../ui/Modal";
import TableSkeletonLoader from "../../ui/SkeletonLoader/TableSkeletonLoader";
import { Button } from "../ui/button";
import MultiSelectList from "../MultiSelectList/MultiSelectList";
import { toastError, toastSuccess } from "../Toast/toast";

type TeamMembersProps = {
  teamId: string;
};

export function TeamMembers({ teamId }: TeamMembersProps) {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { loading, setLoading } = useLoader();

  const filteredTeamMembers = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTeamMembers;
    }
    const query = searchQuery.toLowerCase();
    return allTeamMembers.filter(
      (member) =>
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
    );
  }, [allTeamMembers, searchQuery]);

  async function fetchTeamMembers(id: string) {
    setLoading(true);
    const { data } = await getTeamMembers(id);
    try {
      const { data: users, error } = await getPersons();
      setTeamMembers(data || []);
      setAllTeamMembers(
        (users || []).filter(
          (user) =>
            // Only human users; agents and other service accounts have a type
            !user.type && !data?.find((item) => item.id === user.id)
        )
      );
      if (error) {
        toastError(error.message);
      }
    } catch (ex) {
      toastError(ex as any);
    }
    setLoading(false);
  }

  async function removeTeamMember(user: User) {
    try {
      const { error } = await removeUserFromTeam(teamId, user.id);
      if (!error) {
        toastSuccess(`${user.name} removed from team successfully`);
        fetchTeamMembers(teamId);
      } else {
        toastError(error.message);
      }
    } catch (ex) {
      toastError(ex as any);
    }
  }

  async function addTeamMembers(selectedUsers: User[]) {
    try {
      const { error } = await addUserToTeam(
        teamId,
        selectedUsers.map((item) => item.id)
      );
      if (!error) {
        toastSuccess(
          `${selectedUsers
            .map((user) => user.name)
            .toString()} added to the team successfully`
        );
        fetchTeamMembers(teamId);
      } else {
        toastError(error.message);
      }
    } catch (ex) {
      toastError(ex as any);
    }
    setOpen(false);
  }

  const openAddMembersModal = () => {
    setSelectedMembers([]);
    setSearchQuery("");
    setOpen(true);
  };

  useEffect(() => {
    if (!teamId) {
      return;
    }
    fetchTeamMembers(teamId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  return (
    <div className="flex flex-col gap-4 px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Members</h3>
          <p className="text-sm text-gray-500">
            {loading && !teamMembers.length
              ? "Loading members..."
              : `${teamMembers.length} ${
                  teamMembers.length === 1 ? "member" : "members"
                }`}
          </p>
        </div>
        <Button onClick={openAddMembersModal}>
          <Plus />
          Add members
        </Button>
      </div>
      {!teamMembers.length && loading ? (
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
          {teamMembers.map((teamMember) => (
            <li
              key={teamMember.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar user={teamMember} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {teamMember.name}
                  </p>
                  {teamMember.email && (
                    <p className="truncate text-sm text-gray-500">
                      {teamMember.email}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                title="Remove from team"
                aria-label={`Remove ${teamMember.name} from team`}
                className="text-gray-500 hover:text-red-600"
                onClick={() => removeTeamMember(teamMember)}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Modal
        title={
          <div className="text-xl font-medium text-gray-800">
            Add users to the team
          </div>
        }
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        size="medium"
        bodyClass=""
      >
        <div
          className="mb-16 flex h-full flex-col overflow-y-auto p-4 py-4"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <TextInputClearable
            className="mb-4"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            hideButton
          />
          <MultiSelectList
            className="h-72"
            viewOnly={false}
            options={filteredTeamMembers}
            onOptionSelect={(teamMember) => {
              setSelectedMembers((val) => {
                if (val.includes(teamMember)) {
                  return val.filter((v) => v.id !== teamMember.id);
                } else {
                  return [...val, teamMember];
                }
              });
            }}
            selectedOptions={selectedMembers}
            renderOption={(teamMember) => {
              return (
                <div className="flex" key={teamMember.id}>
                  <Avatar user={teamMember} />
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">{teamMember.name}</p>
                    {teamMember.email && (
                      <p className="text-xs text-gray-500">
                        <HiOutlineMail className="inline-block h-4 w-4 pr-1" />
                        {teamMember.email}
                      </p>
                    )}
                  </div>
                </div>
              );
            }}
          />
          <div className="absolute bottom-0 left-0 flex w-full justify-end rounded bg-gray-100 px-4 py-2">
            <Button
              disabled={!selectedMembers.length}
              onClick={() => {
                addTeamMembers(selectedMembers);
              }}
            >
              {selectedMembers.length
                ? `Add ${selectedMembers.length} ${
                    selectedMembers.length === 1 ? "member" : "members"
                  }`
                : "Add members"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
