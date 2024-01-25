import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlaybookSpec } from "../../../api/services/playbooks";
import { PlaybookSpec } from "../../../api/types/playbooks";
import { Button } from "../../Button";
import { Icon } from "../../Icon";
import { toastError, toastSuccess } from "../../Toast/toast";
import SubmitPlaybookRunForm from "../Runs/Submit/SubmitPlaybookRunForm";
import PlaybookCardMenu from "./PlaybookCardMenu";
import PlaybookSpecsForm from "./PlaybookSpecsForm";

type PlaybookSpecCardProps = {
  playbook: PlaybookSpec;
  refetch?: () => void;
};

export default function PlaybookSpecCard({
  playbook,
  refetch = () => {}
}: PlaybookSpecCardProps) {
  const [isEditPlaybookFormOpen, setIsEditPlaybookFormOpen] = useState(false);
  const [isSubmitPlaybookRunFormOpen, setIsSubmitPlaybookRunFormOpen] =
    useState(false);

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
      <div className="flex flex-col w-full h-full rounded-8px shadow-card card bg-lightest-gray relative">
        <div className="flex flex-row gap-2 p-2 bg-white items-center">
          <Icon name={playbook.spec.icon} className="w-6 h-6" />
          <h3 className="flex-1 text-lg leading-6 font-medium text-gray-900">
            {playbook.name}
          </h3>
          <PlaybookCardMenu
            onEditPlaybook={() => setIsEditPlaybookFormOpen(true)}
            onDeletePlaybook={() => deletePlaybook(playbook.id)}
          />
        </div>
        <div className="flex flex-col flex-1 p-2">
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
            text="Run"
            onClick={() => setIsSubmitPlaybookRunFormOpen(true)}
          />
        </div>
      </div>

      <PlaybookSpecsForm
        isOpen={isEditPlaybookFormOpen}
        onClose={() => {
          setIsEditPlaybookFormOpen(false);
        }}
        refresh={refetch}
        playbook={playbook}
      />

      <SubmitPlaybookRunForm
        isOpen={isSubmitPlaybookRunFormOpen}
        onClose={() => setIsSubmitPlaybookRunFormOpen(false)}
        playbook={{
          ...playbook,
          parameters: playbook.spec.parameters ?? []
        }}
      />
    </>
  );
}
