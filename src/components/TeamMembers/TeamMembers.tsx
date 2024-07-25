import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
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
import { IconButton } from "../../ui/Buttons/IconButton";
import { Menu } from "../../ui/Menu";
import { Modal } from "../../ui/Modal";
import TableSkeletonLoader from "../../ui/SkeletonLoader/TableSkeletonLoader";
import EmptyState from "../EmptyState";
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
  const { loading, setLoading } = useLoader();

  async function fetchTeamMembers(id: string) {
    setLoading(true);
    const { data } = await getTeamMembers(id);
    try {
      const { data: users, error } = await getPersons();
      setTeamMembers(data || []);
      setAllTeamMembers(
        (users || []).filter(
          (user) => !data?.find((item) => item.id === user.id)
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
      const { error } = await removeUserFromTeam(user.id);
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
    <div className="flex flex-col space-y-8 rounded bg-white p-4 pb-8 shadow">
      {!teamMembers.length && !loading && (
        <div className="flex flex-col">
          <div className="text-center">
            <EmptyState
              header={
                <>
                  <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                  <h2 className="mt-2 text-lg font-medium text-gray-900">
                    Add team members
                  </h2>
                </>
              }
              title="You haven't added any team members to the team yet."
            />
            <button
              type="submit"
              className="btn-primary mt-4"
              onClick={() => openAddMembersModal()}
            >
              Add Members
            </button>
          </div>
        </div>
      )}
      {!Boolean(teamMembers.length) && loading ? (
        <TableSkeletonLoader className="mt-2" />
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row justify-end">
            <button
              type="submit"
              className="btn-primary mt-4 w-36"
              onClick={() => openAddMembersModal()}
            >
              Add Members
            </button>
          </div>
          <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
            {teamMembers.map((teamMember) => {
              return (
                <li
                  key={teamMember.id}
                  className="flex items-center justify-between space-x-3 py-4"
                >
                  <div className="flex min-w-0 flex-1 items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Avatar user={teamMember} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {teamMember.name}
                      </p>
                      <p className="truncate text-sm font-medium text-gray-500">
                        {teamMember.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Menu>
                      <Menu.VerticalIconButton />
                      <Menu.Items className="w-72">
                        <Menu.Item
                          onClick={(e: any) => {
                            removeTeamMember(teamMember);
                          }}
                        >
                          <div className="flex w-full cursor-pointer">
                            <IconButton
                              className="flex items-center bg-transparent"
                              ovalProps={{
                                stroke: "blue",
                                height: "18px",
                                width: "18px",
                                fill: "transparent"
                              }}
                              icon={
                                <BsTrash
                                  className="border-l-1 border-0 border-gray-200 text-gray-600"
                                  size={18}
                                />
                              }
                            />
                            <span className="cursor-pionter block pl-2 text-sm">
                              Remove user
                            </span>
                          </div>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
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
          <MultiSelectList
            className="h-72"
            viewOnly={false}
            options={allTeamMembers}
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
            <button
              className="btn-primary float-right"
              onClick={() => {
                addTeamMembers(selectedMembers);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
