import { useGetPlaybookSpecsDetails } from "@flanksource-ui/api/query-hooks/playbooks";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { Button } from "@flanksource-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@flanksource-ui/components/ui/card";
import { useUser } from "@flanksource-ui/context";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { hasPlaybookRunPermission } from "@flanksource-ui/utils/playbookPermissions";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlaybookSpec } from "../../../api/services/playbooks";
import { PlaybookNames } from "../../../api/types/playbooks";
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
      <Card className="relative flex h-full w-full flex-col">
        <CardHeader className="flex flex-row items-center gap-2 px-3 py-2">
          <Icon name={playbook.icon} className="h-6 w-6" />
          <CardTitle className="flex-1 text-base">
            {/* For now, default to name, when title isn't there */}
            {playbook.title || playbook.name}
          </CardTitle>
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
        </CardHeader>
        {playbook.description && (
          <CardContent className="px-3 py-1">
            <div className="text-sm text-gray-500">
              <p>{playbook.description}</p>
            </div>
          </CardContent>
        )}
        <CardFooter className="flex flex-row justify-between gap-2 px-3 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigate(`/playbooks/runs?playbook=${playbook.id}`);
            }}
          >
            History
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsSubmitPlaybookRunFormOpen(true)}
            disabled={!canRunPlaybooks}
            title={
              !canRunPlaybooks
                ? "You don't have permission to run playbooks"
                : undefined
            }
          >
            Run
          </Button>
        </CardFooter>
      </Card>

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
