import { useEffect } from "react";
import ReactFlow, {
  ConnectionLineType,
  Controls,
  Edge,
  MarkerType,
  Node,
  NodeTypes,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "reactflow";

import { ConfigItemReactFlowNode } from "@flanksource-ui/components/Configs/Graph/ConfigItemReactFlowNode";
import "reactflow/dist/style.css";
import useAutoLayout, { LayoutOptions } from "./Layouts/useAutoLayout";

const nodeTypes: NodeTypes = { configNode: ConfigItemReactFlowNode };

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 }
};

const layoutOption = {
  direction: "LR",
  spacing: [50, 50]
} satisfies LayoutOptions;

type ConfigGraphProps<T> = {
  nodes: Node<T>[];
  edges: Edge<T>[];
};

export function RelationshipGraph<T>({
  nodes: propNodes,
  edges: propEdges
}: ConfigGraphProps<T>) {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<T>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(propNodes);
    setEdges(propEdges);
  }, [propNodes, propEdges, setNodes, setEdges]);

  useAutoLayout(layoutOption);

  // every time our nodes change, we want to center the graph again
  useEffect(() => {
    fitView();
  }, [fitView, nodes]);

  return (
    <div className="flex flex-col h-full w-full">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
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
