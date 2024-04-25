import { Badge } from "@flanksource-ui/ui/Badge";
import clsx from "clsx";
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from "react-icons/hi";
import { Handle, NodeProps } from "reactflow";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import { ConfigGraphNodes } from "./ConfigRelationshipGraph";

export function ConfigIntermediaryNodeReactFlowNode({
  data,
  sourcePosition,
  targetPosition
}: NodeProps<ConfigGraphNodes>) {
  if (data.nodeType === "config") {
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
      <div className="flex flex-col h-[6.05rem] w-auto justify-center ">
        <div
          className={clsx(
            "flex flex-col gap-2 w-96 justify-center cursor-pointer shadow-card card border-0 relative rounded-md"
          )}
        >
          <div className="flex flex-col gap-2 bg-white p-2">
            <div
              className="flex flex-row font-bold w-auto overflow-hidden truncate text-ellipsis align-middle text-15pxinrem leading-1.21rel"
              title={data.nodeType}
            >
              <div className="flex flex-1 flex-row w-auto gap-2">
                <ConfigsTypeIcon
                  showLabel
                  config={{
                    type: data.configType
                  }}
                >
                  <Badge
                    color="gray"
                    text={
                      <span className="text-left"> {data.configs.length}</span>
                    }
                  />
                </ConfigsTypeIcon>
                <div className="flex flex-row w-auto justify-end items-center gap-1.5 px-2 text-gray-500">
                  {data.expanded ? (
                    <HiOutlineMinusCircle />
                  ) : (
                    <HiOutlinePlusCircle />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {sourcePosition && <Handle type="source" position={sourcePosition!} />}
    </>
  );
}
