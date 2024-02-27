import { PlaybookRunWithActions } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/ui/Button";
import { useMemo, useState } from "react";
import ViewPlaybookParamsModal from "./ViewPlaybookParamsModal";

type ShowPlaybookRunsParamsProps = {
  data: PlaybookRunWithActions;
};

export default function ShowPlaybookRunsParams({
  data
}: ShowPlaybookRunsParamsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isParamsLinkVisible = useMemo(() => {
    return data.parameters && Object.keys(data.parameters).length > 0;
  }, [data]);

  if (!isParamsLinkVisible) {
    return null;
  }

  return (
    <>
      <span className="px-2">
        (
        <Button
          text="Params"
          className="link p-0"
          size="none"
          onClick={() => setIsModalOpen(true)}
        />
        )
      </span>
      <ViewPlaybookParamsModal
        data={data}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}
