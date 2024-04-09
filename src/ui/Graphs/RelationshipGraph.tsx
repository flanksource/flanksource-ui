import { useCallback, useEffect } from "react";
import ReactFlow, {
  ConnectionLineType,
  Controls,
  Edge,
  MarkerType,
  Node,
  NodeMouseHandler,
  NodeTypes,
  useEdgesState,
  useNodesState
} from "reactflow";

import { ConfigIntermediaryNodeReactFlowNode } from "@flanksource-ui/components/Configs/Graph/ConfigIntermediaryNodeReactFlowNode";
import { ConfigItemReactFlowNode } from "@flanksource-ui/components/Configs/Graph/ConfigItemReactFlowNode";
import "reactflow/dist/style.css";
import useExpandCollapse from "./Expand/useExpandCollapse";

const nodeTypes: NodeTypes = {
  configNode: ConfigItemReactFlowNode,
  intermediaryNode: ConfigIntermediaryNodeReactFlowNode
};

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 }
};

export type GraphDataGenericConstraint = {
  [key: string]: any;
  expanded?: boolean;
  expandable?: boolean;
};

type ConfigGraphProps<T extends GraphDataGenericConstraint> = {
  nodes: Node<T>[];
  edges: Edge<T>[];
};

export function RelationshipGraph<T extends GraphDataGenericConstraint>({
  nodes: propNodes,
  edges: propEdges
}: ConfigGraphProps<T>) {
  const [nodes, setNodes, onNodesChange] = useNodesState<T>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(propNodes);
    setEdges(propEdges);
  }, [propNodes, propEdges, setNodes, setEdges]);

  const { nodes: expandNodes, edges: expandEdges } = useExpandCollapse(
    nodes,
    edges
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: { ...n.data, expanded: !n.data.expanded }
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  return (
    <div className="flex flex-col h-full w-full">
      <ReactFlow
        fitView
        onNodeClick={onNodeClick}
        nodes={expandNodes}
        edges={expandEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgesUpdatable={false}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={defaultEdgeOptions}
        draggable={false}
        nodesConnectable={false}
        nodesDraggable={false}
        edgesFocusable={false}
      >
        <Controls position="top-right" />
      </ReactFlow>
    </div>
  );
}
