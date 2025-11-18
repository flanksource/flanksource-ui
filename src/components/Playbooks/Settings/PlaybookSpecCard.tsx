import { useGetPlaybookSpecsDetails } from "@flanksource-ui/api/query-hooks/playbooks";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { useUser } from "@flanksource-ui/context";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { hasPlaybookRunPermission } from "@flanksource-ui/utils/playbookPermissions";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlaybookSpec } from "../../../api/services/playbooks";
import { PlaybookNames } from "../../../api/types/playbooks";
import { Button } from "../../../ui/Buttons/Button";
import { Icon } from "../../../ui/Icons/Icon";
import { toastError, toastSuccess } from "../../Toast/toast";
import SubmitPlaybookRunForm from "../Runs/Submit/SubmitPlaybookRunForm";
import PlaybookCardMenu from "./PlaybookCardMenu";
import PlaybookSpecFormModal from "./PlaybookSpecFormModal";

type PlaybookSpecCardProps = {
  playbook: PlaybookNames;
  refetch?: () => void;
};

export default function PlaybookSpecCard({
  playbook,
  refetch = () => {}
}: PlaybookSpecCardProps) {
  const [isEditPlaybookFormOpen, setIsEditPlaybookFormOpen] = useState(false);
  const [isSubmitPlaybookRunFormOpen, setIsSubmitPlaybookRunFormOpen] =
    useState(false);

  const { data: playbookSpec } = useGetPlaybookSpecsDetails(playbook.id, {
    enabled: isEditPlaybookFormOpen || isSubmitPlaybookRunFormOpen
  });

  const { permissions, roles } = useUser();
  const isAdminOrEditor = roles.includes("admin") || roles.includes("editor");
  const canRunPlaybooks =
    isAdminOrEditor || hasPlaybookRunPermission(permissions);

  const navigate = useNavigate();

  const { mutate: deletePlaybook } = useMutation({
    mutationFn: async (id: string) => {
      const res = await deletePlaybookSpec(id);
      return res;
    },
    onSuccess: () => {
      toastSuccess("Playbook Spec updated successfully");
      refetch();
    },
    onError: (err: Error) => {
      toastError("Unable to delete playbook spec: " + err.message);
    }
  });

  return (
    <>
      <div className="card relative flex h-full w-full flex-col rounded-8px border bg-lightest-gray shadow-card">
        <div className="flex flex-row items-center gap-2 rounded-t-2xl bg-white p-2">
          <Icon name={playbook.icon} className="h-6 w-6" />
          <h3 className="flex-1 text-lg font-medium leading-6 text-gray-900">
            {/* For now, default to name, when title isn't there */}
            {playbook.title || playbook.name}
          </h3>
          <AuthorizationAccessCheck
            resource={tables.playbooks}
            action="write"
            key="add-connection"
          >
            <PlaybookCardMenu
              onEditPlaybook={() => setIsEditPlaybookFormOpen(true)}
              onDeletePlaybook={() => deletePlaybook(playbook.id)}
            />
          </AuthorizationAccessCheck>
        </div>
        <div className="flex flex-1 flex-col p-2">
          {playbook.description && (
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>{playbook.description}</p>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between p-2">
          <Button
            text="History"
            onClick={() => {
              navigate(`/playbooks/runs?playbook=${playbook.id}`);
            }}
            className="btn-white"
          />
          <Button
            onClick={() => setIsSubmitPlaybookRunFormOpen(true)}
            disabled={!canRunPlaybooks}
            disabledTooltip={
              !canRunPlaybooks
                ? "You don't have permission to run playbooks"
                : undefined
            }
          >
            Run
          </Button>
        </div>
      </div>

      {playbookSpec && (
        <PlaybookSpecFormModal
          isOpen={isEditPlaybookFormOpen}
          onClose={() => {
            setIsEditPlaybookFormOpen(false);
          }}
          refresh={refetch}
          playbook={playbookSpec}
        />
      )}

      {playbookSpec && (
        <SubmitPlaybookRunForm
          isOpen={isSubmitPlaybookRunFormOpen}
          onClose={() => setIsSubmitPlaybookRunFormOpen(false)}
          playbook={playbookSpec}
        />
      )}
    </>
  );
}
