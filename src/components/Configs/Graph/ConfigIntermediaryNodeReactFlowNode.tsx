import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import clsx from "clsx";
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from "react-icons/hi";
import { Handle, NodeProps, Position } from "reactflow";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import { ConfigGraphNodes } from "./ConfigRelationshipGraph";

export function ConfigIntermediaryNodeReactFlowNode({
  data,
  sourcePosition,
  targetPosition
}: NodeProps<ConfigGraphNodes>) {
  if (data.data.type === "config") {
    return null;
  }

  return (
    <>
      <style global jsx>{`
        .react-flow__handle {
          opacity: 0;
        }
      `}</style>
      {targetPosition && <Handle type="target" position={targetPosition} />}
      <div
        className={clsx(
          "flex w-auto flex-col justify-center",
          targetPosition === Position.Top ? undefined : "h-[6.05rem]"
        )}
      >
        <div
          className={clsx(
            "card relative flex w-96 cursor-pointer flex-col justify-center gap-2 rounded-md border-0 shadow-card"
          )}
        >
          <div className="flex flex-col gap-2 bg-white p-2">
            <div
              className="flex w-auto flex-row overflow-hidden truncate text-ellipsis align-middle text-15pxinrem font-bold leading-1.21rel"
              title={data.data.configType}
            >
              <div className="flex w-auto flex-1 flex-row gap-2">
                <ConfigsTypeIcon
                  showLabel
                  config={{
                    type: data.data.configType
                  }}
                >
                  <Badge
                    color="gray"
                    text={
                      <span className="text-left">{data.childrenCount}</span>
                    }
                  />
                </ConfigsTypeIcon>
                {data.childrenCount > 3 && (
                  <div className="flex w-auto flex-row items-center justify-end gap-1.5 px-2 text-gray-500">
                    {data.expanded ? (
                      <HiOutlineMinusCircle />
                    ) : (
                      <HiOutlinePlusCircle />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {sourcePosition && <Handle type="source" position={sourcePosition!} />}
    </>
  );
}
