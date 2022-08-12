import { ChevronRightIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { debounce } from "lodash";
import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BsBraces,
  BsFillBarChartFill,
  BsFillChatSquareTextFill
} from "react-icons/bs";
import { IconBaseProps, IconType } from "react-icons/lib";
import { VscTypeHierarchy } from "react-icons/vsc";
import { EvidenceType } from "../../../api/services/evidence";
import { Hypothesis } from "../../../api/services/hypothesis";
import { HypothesisAPIs } from "../../../pages/incident/IncidentDetails";
import { AvatarGroup } from "../../AvatarGroup";
import { EditableText } from "../../EditableText";
import { HypothesisBarMenu } from "../HypothesisBarMenu";
import { StatusDropdownContainer } from "../StatusDropdownContainer";

enum CommentInfo {
  Comment = "comment"
}

type InfoType = CommentInfo | EvidenceType;

interface InfoIconProps extends IconBaseProps {
  icon: InfoType;
}

const ICON_MAP: { [key in InfoType]: IconType } = {
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
  onTitleClick: MouseEventHandler<HTMLSpanElement>;
  api: HypothesisAPIs;
  showExpand: boolean;
  expanded: boolean;
  onToggleExpand: (expand: boolean) => void;
  onDisprove: () => void;
  onCreateHypothesis: () => void;
}

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

export function HypothesisBar({
  hypothesis,
  api,
  showExpand,
  expanded,
  onToggleExpand,
  onDisprove,
  onCreateHypothesis
}: HypothesisBarProps) {
  const {
    title = "",
    created_by: createdBy,
    evidences: evidence,
    comment
  } = hypothesis;

  const [deleting, setDeleting] = useState<boolean>(false);

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

  const [editTitle, setEditTitle] = useState(false);

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
        [i]: (acc[i] || 0) + 1
      };
    }, {});

  const counts = Object.entries(infoIcons) as Entries<IconCounts>[];

  const commentsMap = new Map(
    (comment || []).map((c) => [c?.created_by?.id, c?.created_by])
  );

  createdBy && commentsMap.delete(createdBy.id);
  const involved = [createdBy].concat(Array.from(commentsMap.values()));

  return (
    <div
      className={clsx(
        "relative w-full flex justify-between shadow-lg rounded-8px border focus:outline-none bg-zinc-100 cursor-pointer space-x-2",
        deleting && "pointer-events-none cursor-not-allowed blur-[2px]"
      )}
    >
      <div
        onClick={() => onToggleExpand && onToggleExpand(!expanded)}
        className="flex flex-grow-0 items-center space-x-2 my-1 w-full"
      >
        {showExpand && (
          <button
            className="ml-2 py-2 flex flex-row items-center"
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
          <div className="font-semibold text-gray-900 w-full">
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
          {counts.map(([typ, count], idx: number) => (
            <span key={`${typ}-${idx}`} className="flex flex-row items-center">
              <InfoIcon icon={typ} className="px-1 text-dark-blue" />
              {count > 1 && (
                <span className="-ml-1 font-bold mr-1 mt-3 text-gray-500 text-xs">
                  {count}
                </span>
              )}
            </span>
          ))}
        </div>
        <div>
          {createdBy && <AvatarGroup maxCount={5} users={involved} size="sm" />}
        </div>
        <div className="flex pt-0.5">
          <HypothesisBarMenu
            hypothesis={hypothesis}
            onDisprove={onDisprove}
            setDeleting={setDeleting}
            onCreateHypothesis={onCreateHypothesis}
            onEditTitle={() => setEditTitle(true)}
          />
        </div>
      </div>
    </div>
  );
}
