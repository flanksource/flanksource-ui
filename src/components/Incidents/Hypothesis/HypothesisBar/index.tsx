import { ChevronRightIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useAtomValue, useSetAtom } from "jotai";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BsBraces,
  BsFillBarChartFill,
  BsFillChatSquareTextFill
} from "react-icons/bs";
import { IconBaseProps, IconType } from "react-icons/lib";
import { VscTypeHierarchy } from "react-icons/vsc";
import { EvidenceType } from "../../../../api/types/evidence";
import { Hypothesis } from "../../../../api/types/hypothesis";
import { HypothesisAPIs } from "../../../../pages/incident/IncidentDetails";
import { recentlyAddedHypothesisIdAtom } from "../../../../store/hypothesis.state";
import { AvatarGroup } from "../../../../ui/AvatarGroup";
import { EditableText } from "../../../../ui/FormControls/EditableText";
import { HypothesisBarMenu } from "../HypothesisBarMenu";
import { StatusDropdownContainer } from "../StatusDropdownContainer";

enum CommentInfo {
  Comment = "comment"
}

type InfoType = CommentInfo | EvidenceType;

interface InfoIconProps extends IconBaseProps {
  icon: InfoType;
}

const ICON_MAP: Record<string, IconType> = {
  comment: BsFillChatSquareTextFill,
  config: BsBraces,
  log: BsFillBarChartFill,
  topology: VscTypeHierarchy
};

type IconCounts = { [k in InfoType]: number };

function InfoIcon({ icon, ...props }: InfoIconProps) {
  const Component = ICON_MAP[icon];
  return <Component size={24} {...props} />;
}

interface HypothesisBarProps {
  hypothesis: Hypothesis;
  api: HypothesisAPIs;
  showExpand: boolean;
  expanded: boolean;
  editTitle?: boolean;
  onToggleExpand: (expand: boolean) => void;
  onDisprove: () => void;
}

export function HypothesisBar({
  hypothesis,
  api,
  showExpand,
  expanded,
  editTitle: initEditTitle = false,
  onToggleExpand,
  onDisprove
}: HypothesisBarProps) {
  const {
    title = "",
    created_by: createdBy,
    evidences: evidence,
    comment
  } = hypothesis;

  const [deleting, setDeleting] = useState<boolean>(false);
  const recentlyAddedHypothesisId = useAtomValue(recentlyAddedHypothesisIdAtom);
  const setRecentlyAddedHypothesisId = useSetAtom(
    recentlyAddedHypothesisIdAtom
  );
  const isPartOfDOD = useMemo(() => {
    return (
      (hypothesis.evidences?.filter((item) => item.definition_of_done) ?? [])
        .length > 0
    );
  }, [hypothesis]);

  const handleApiUpdate = useMemo(
    () =>
      debounce((params) => {
        if (api?.updateMutation && hypothesis.id) {
          api.updateMutation.mutate({ id: hypothesis.id, params });
        }
      }, 1000),
    [hypothesis, api]
  );

  const { watch, getValues, setValue } = useForm({
    defaultValues: { title }
  });

  watch();

  const [editTitle, setEditTitle] = useState(initEditTitle);

  useEffect(() => {
    if (!recentlyAddedHypothesisId) {
      return;
    }
    if (hypothesis.id === recentlyAddedHypothesisId) {
      onToggleExpand(hypothesis.id === recentlyAddedHypothesisId);
      setRecentlyAddedHypothesisId(null);
    }
  }, [
    recentlyAddedHypothesisId,
    hypothesis.id,
    onToggleExpand,
    setRecentlyAddedHypothesisId
  ]);

  useEffect(() => {
    const subscription = watch((value) => {
      handleApiUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, handleApiUpdate]);

  const infoIcons = (evidence || [])
    .map((e): InfoType => e.type)
    .concat(comment?.length ? [CommentInfo.Comment] : [])
    .filter((i) => ICON_MAP[i])
    .reduce<Partial<IconCounts>>((acc, i) => {
      return {
        ...acc,
        [i]: ((acc as any)[i] || 0) + 1
      };
    }, {});

  const commentsMap = new Map(
    (comment || []).map((c) => [c?.created_by?.id, c?.created_by])
  );

  createdBy && commentsMap.delete(createdBy.id);
  const involved = [createdBy].concat(Array.from(commentsMap.values()));

  return (
    <div
      className={clsx(
        "focus:outline-non relative flex w-full cursor-pointer justify-between space-x-2 rounded-8px border bg-white shadow-md",
        deleting && "pointer-events-none cursor-not-allowed blur-[2px]",
        isPartOfDOD ? "border-t-2 border-t-blue-600" : ""
      )}
    >
      <div className="my-1 flex w-full flex-grow-0 items-center space-x-2">
        {showExpand && (
          <button
            className="ml-2 flex flex-row items-center py-2"
            onClick={() => onToggleExpand && onToggleExpand(!expanded)}
            type="button"
          >
            <ChevronRightIcon
              className={`h-5 w-5 transform ${expanded && "rotate-90"}`}
            />
          </button>
        )}
        <StatusDropdownContainer
          nodeId={hypothesis?.id}
          status={hypothesis?.status}
          updateMutation={api?.updateMutation}
        />
        {!editTitle ? (
          <div
            onClick={() => onToggleExpand && onToggleExpand(!expanded)}
            className="w-full font-semibold text-gray-900"
          >
            {getValues("title")}
          </div>
        ) : (
          <EditableText
            value={getValues("title")}
            sharedClassName="font-semibold text-gray-900"
            textAreaClassName="focus:outline-none border-none focus:border-none"
            onChange={(value: string) => {
              setValue("title", value);
              setEditTitle(false);
            }}
            isEditableAtStart
            disableEditOnBlur={false}
            onClose={() => setEditTitle(false)}
          />
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex flex-row items-center">
          {Object.entries(infoIcons).map(([typ, count], idx: number) => (
            <span key={`${typ}-${idx}`} className="flex flex-row items-center">
              <InfoIcon
                icon={typ as InfoType}
                className="px-1 text-dark-blue"
              />
              {count > 1 && (
                <span className="-ml-1 mr-1 mt-3 text-xs font-bold text-gray-500">
                  {count}
                </span>
              )}
            </span>
          ))}
        </div>
        <div>
          {createdBy && (
            <AvatarGroup maxCount={5} users={involved as any} size="sm" />
          )}
        </div>
        <div className="flex pt-0.5">
          <HypothesisBarMenu
            hypothesis={hypothesis}
            onDisprove={onDisprove}
            setDeleting={setDeleting}
            onEditTitle={() => setEditTitle(true)}
          />
        </div>
      </div>
    </div>
  );
}
