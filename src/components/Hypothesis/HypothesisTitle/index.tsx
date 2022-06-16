import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { Avatar } from "../../Avatar";
import { EditableText } from "../../EditableText";
import { Hypothesis } from "../../../api/services/hypothesis";
import { AvatarGroup } from "../../AvatarGroup";

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
    <div className="mt-2 mr-2 mb-2 pr-8 flex flex-nowrap space-x-4 items-center">
      <EditableText
        value={getValues("title")}
        sharedClassName="text-2xl font-semibold text-gray-900 grow"
        onChange={(value: string) => {
          setValue("title", value);
        }}
      />
      <div className="flex">
        <Avatar size="sm" user={node?.created_by} />
        <p className="font-inter text-dark-gray font-normal text-sm ml-1.5 mt-0.5">
          {node?.created_by?.name}
        </p>
      </div>
      {Boolean(involved.length) && (
        <AvatarGroup maxCount={5} users={involved} size="sm" />
      )}
    </div>
  );
};
