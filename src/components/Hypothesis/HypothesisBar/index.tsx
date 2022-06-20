import { MouseEventHandler, useMemo, useState, useCallback } from "react";
import clsx from "clsx";
import {
  BsBraces,
  BsFillBarChartFill,
  BsFillChatSquareTextFill
} from "react-icons/bs";
import { VscTypeHierarchy } from "react-icons/vsc";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import { AiOutlineSearch } from "react-icons/ai";

import { HypothesisStatuses } from "../../../constants/hypothesis-statuses";
import { deleteHypothesis, Hypothesis } from "../../../api/services/hypothesis";
import { AvatarGroup } from "../../AvatarGroup";
import { EvidenceType } from "../../../api/services/evidence";
import { IconBaseProps, IconType } from "react-icons/lib";
import { useQueryClient } from "react-query";
import { createIncidentQueryKey } from "../../query-hooks/useIncidentQuery";
import { HypothesisBarDeleteDialog } from "./HypothesisBarDeleteDialog";

const statusToStatusIconMapping = {
  [HypothesisStatuses.Proven]: {
    StatusIcon: ThumbUpIcon,
    statusColorClass: "text-bright-green"
  },
  [HypothesisStatuses.Likely]: {
    StatusIcon: ThumbUpIcon,
    statusColorClass: "text-warm-green"
  },
  [HypothesisStatuses.Possible]: {
    StatusIcon: ThumbUpIcon,
    statusColorClass: "text-warmer-gray"
  },
  [HypothesisStatuses.Unlikely]: {
    StatusIcon: ThumbDownIcon,
    statusColorClass: "text-warmer-gray"
  },
  [HypothesisStatuses.Improbable]: {
    StatusIcon: ThumbDownIcon,
    statusColorClass: "text-bright-orange"
  },
  [HypothesisStatuses.Disproven]: {
    StatusIcon: ThumbDownIcon,
    statusColorClass: "text-bright-red"
  },
  fallback: {
    StatusIcon: AiOutlineSearch,
    statusColorClass: "text-bright-red"
  }
};

enum CommentInfo {
  Comment = "comment"
}

type InfoType = CommentInfo | EvidenceType;

interface InfoIconProps extends IconBaseProps {
  icon: InfoType;
  key: string;
}

const ICON_MAP: { [key in InfoType]: IconType } = {
  comment: BsFillChatSquareTextFill,
  config: BsBraces,
  log: BsFillBarChartFill,
  topology: VscTypeHierarchy
};

const InfoIcon: React.FC<InfoIconProps> = ({
  icon,
  ...props
}: InfoIconProps) => {
  const Component = ICON_MAP[icon];
  return <Component size={24} {...props} />;
};

interface HypothesisBarProps {
  hypothesis: Hypothesis;
  onTitleClick: MouseEventHandler<HTMLSpanElement>;
  onDisprove: () => void;
}

export const HypothesisBar: React.FunctionComponent<HypothesisBarProps> = ({
  hypothesis,
  onTitleClick,
  onDisprove: onDisproveCb
}: HypothesisBarProps) => {
  const {
    title,
    status,
    created_by: createdBy,
    evidence,
    comment
  } = hypothesis;

  const [deleting, setDeleting] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const { StatusIcon, statusColorClass } = useMemo(
    () =>
      statusToStatusIconMapping[status] || statusToStatusIconMapping.fallback,
    [status]
  );

  const queryClient = useQueryClient();

  const infoIcons: InfoType[] = (evidence || [])
    .map((e): InfoType => e.type)
    .concat(comment?.length ? [CommentInfo.Comment] : []);

  const commentsMap = new Map(
    (comment || []).map((c) => [c?.created_by?.id, c?.created_by])
  );

  createdBy && commentsMap.delete(createdBy.id);
  const involved = [createdBy].concat(Array.from(commentsMap.values()));

  const onDelete = useCallback(() => {
    setDeleting(true);
    const delHypo = async () => {
      try {
        setShowConfirm(false);
        await deleteHypothesis(hypothesis.id);
        const key = createIncidentQueryKey(hypothesis.incident_id);
        await queryClient.invalidateQueries(key);
        setDeleting(false);
      } catch (e) {
        setShowConfirm(false);
        setDeleting(false);
        console.error("Error while deleting", e);
      }
    };
    delHypo();
  }, [hypothesis, queryClient]);

  const onDisprove = () => {
    onDisproveCb();
    setShowConfirm(false);
  };

  return (
    <div
      className={clsx(
        "w-full flex justify-between rounded-8px border focus:outline-none bg-white cursor-pointer",
        deleting && "pointer-events-none cursor-not-allowed blur-[2px]"
      )}
    >
      <div className="flex items-center min-h-12 w-full py-2">
        <div
          className={clsx(
            "ml-2 bg-lighter-gray rounded-full p-2 w-8 h-8 flex-0-0-a",
            statusColorClass
          )}
        >
          <StatusIcon />
        </div>
        <span
          className="ml-3 text-sm font-normal w-full text-left flex-1 min-h-full inline-flex items-center"
          onClick={onTitleClick}
          role="presentation"
        >
          {(title ?? "").trim() || (
            <span className="text-gray-400">"Click to edit"</span>
          )}
        </span>
      </div>
      <div className="flex items-end pb-3.5 pr-3 space-x-4">
        <div className="flex flex-row">
          {infoIcons
            .filter((i) => ICON_MAP[i])
            .map((i) => (
              <InfoIcon key={i} icon={i} className="px-1 text-dark-blue" />
            ))}
        </div>
        <div>
          {createdBy && <AvatarGroup maxCount={5} users={involved} size="sm" />}
        </div>
        <div className="flex">
          <HypothesisBarDeleteDialog
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onDelete={onDelete}
            onDisprove={onDisprove}
            onOpen={() => setShowConfirm(true)}
          />
        </div>
      </div>
    </div>
  );
};
