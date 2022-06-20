import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { EditableText } from "../../EditableText";
import { Hypothesis } from "../../../api/services/hypothesis";
import { AvatarGroup } from "../../AvatarGroup";
import { StatusDropdownContainer } from "../StatusDropdownContainer";

interface Props {
  node: Hypothesis;
  api: any;
}

export const HypothesisTitle = ({ node, api }: Props) => {
  const handleApiUpdate = useRef(
    debounce((params) => {
      if (api?.updateMutation && node?.id) {
        api.updateMutation.mutate({ id: node.id, params });
      }
    }, 1000)
  ).current;

  const { watch, setValue, getValues } = useForm({
    defaultValues: {
      title: node?.title?.trim() ?? ""
    }
  });

  watch();

  useEffect(() => {
    const subscription = watch((value) => {
      handleApiUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, handleApiUpdate]);

  const commentsMap = new Map(
    (node.comment || []).map((c) => [c?.created_by?.id, c?.created_by])
  );

  node?.created_by && commentsMap.delete(node?.created_by?.id);
  const involved = Array.from(commentsMap.values());

  return (
    <div className="mt-2 mr-2 mb-2 pr-8 flex flex-nowrap items-center">
      <StatusDropdownContainer
        nodeId={node?.id}
        status={node?.status}
        updateMutation={api?.updateMutation}
      />
      <EditableText
        value={getValues("title")}
        sharedClassName="text-2xl font-semibold text-gray-900 grow"
        onChange={(value: string) => {
          setValue("title", value);
        }}
      />
      {Boolean(involved.length || node?.created_by) && (
        <span className="pl-4">
          <AvatarGroup
            maxCount={5}
            users={[node?.created_by].concat(involved)}
            size="sm"
          />
        </span>
      )}
    </div>
  );
};
