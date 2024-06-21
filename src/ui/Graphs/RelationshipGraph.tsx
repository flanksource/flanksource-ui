import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  ConnectionLineType,
  Controls,
  Edge,
  EdgeTypes,
  MarkerType,
  Node,
  NodeMouseHandler,
  NodeTypes,
  getNodesBounds,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi
} from "reactflow";

import ConfigGraphDirectionToggle from "@flanksource-ui/components/Configs/ConfigsListFilters/ConfigGraphDirectionToggle";
import { ConfigIntermediaryNodeReactFlowNode } from "@flanksource-ui/components/Configs/Graph/ConfigIntermediaryNodeReactFlowNode";
import { ConfigItemReactFlowNode } from "@flanksource-ui/components/Configs/Graph/ConfigItemReactFlowNode";
import "reactflow/dist/style.css";
import { Loading } from "../Loading";
import useAnimatedNodes from "./Expand/useAnimatedNodes";
import useExpandCollapse from "./Expand/useExpandCollapse";

const nodeTypes: NodeTypes = {
  configNode: ConfigItemReactFlowNode,
  intermediaryNode: ConfigIntermediaryNodeReactFlowNode
};

const edgeTypes = {} satisfies EdgeTypes;

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 50 }
};

export type GraphDataGenericConstraint = {
  [key: string]: any;
  expanded?: boolean;
  expandable?: boolean;
};

type ConfigGraphProps<T extends GraphDataGenericConstraint> = {
  nodes: Node<T>[];
  edges: Edge<T>[];
  direction?: "LR" | "TB";
};

export function RelationshipGraph<T extends GraphDataGenericConstraint>({
  nodes: propNodes,
  edges: propEdges,
  direction = "LR"
}: ConfigGraphProps<T>) {
  const { setViewport, fitView, getZoom } = useReactFlow();

  // During the initial layout setup, we want to align the nodes vertically
  // centered and horizontally aligned to the left. This is done only once and
  // once the user interacts with the graph, we disable this behavior.
  const [isInitialLayoutSetupDone, setIsInitialLayoutSetupDone] =
    useState(false);

  const [showScreen, setShowScreen] = useState(false);

  const { getState } = useStoreApi();

  const [nodes, setNodes, onNodesChange] = useNodesState<T>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(propNodes);
    setEdges(propEdges);
  }, [propNodes, propEdges, setNodes, setEdges]);

  const { nodes: expandNodes, edges: expandEdges } = useExpandCollapse(
    nodes,
    edges,
    {
      direction
    }
  );

  const { nodes: nodesAnimated } = useAnimatedNodes(expandNodes, {
    animationDuration: 300
  });

  const centerNodeToViewport = useCallback(
    (node: Node<T>) => {
      // when the user interacts with the node, disable auto-aligning of the
      // nodes
      setIsInitialLayoutSetupDone(true);

      if (node.data.expandable) {
        // Set center is not working as expected, fitView with maxZoom and
        // minZoom set is a workaround to center the node without messing up the
        // zoom level
        fitView({
          nodes: [node],
          duration: 200,
          maxZoom: getZoom(),
          minZoom: getZoom()
        });
      }
      setTimeout(() => setShowScreen(false), 150);
    },
    [fitView, getZoom]
  );

  const sendNodesEdgePoint = useCallback(() => {
    // Get the root nodes that are not connected to any other node
    const rootNodes = expandNodes.filter(
      (node) => !expandEdges.some((edge) => edge.target === node.id)
    );
    if (direction === "TB") {
      // Calculate the width of the nodes group
      const { width: nodesGroupWidth } = getNodesBounds(rootNodes);
      const { width: viewPortWidth } = getState();
      setViewport({
        zoom: 1,
        y: 0,
        // Calculate the x position of the nodes group to horizontally center it
        x: (viewPortWidth - nodesGroupWidth) / 3
      });
    } else {
      // Calculate the height of the nodes group
      const { height: nodesGroupHeight } = getNodesBounds(rootNodes);
      const { height: viewPortHeight } = getState();
      setViewport({
        zoom: 1,
        x: 0,
        // Calculate the y position of the nodes group to vertically center it
        y: (viewPortHeight - nodesGroupHeight - 100) / 4
      });
    }
  }, [direction, expandEdges, expandNodes, getState, setViewport]);

  useEffect(() => {
    if (!isInitialLayoutSetupDone) {
      sendNodesEdgePoint();
      // setIsInitialLayoutSetupDone(true);
    }
  }, [isInitialLayoutSetupDone, sendNodesEdgePoint]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (!node.data.expandable) {
        return;
      }
      setShowScreen(true);
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
      setTimeout(() => centerNodeToViewport(node), 350);
    },
    [centerNodeToViewport, setNodes]
  );

  return (
    <div className="flex flex-col h-full w-full relative">
      {showScreen && (
        <div className="absolute inset-0 bg-white bg-opacity-95  top-0 bottom-0 left-0 right-0 z-[999] flex flex-col items-center justify-center">
          <Loading />
        </div>
      )}
      <ReactFlow
        fitView
        onNodeClick={onNodeClick}
        nodes={nodesAnimated}
        edges={expandEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgesUpdatable={false}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={defaultEdgeOptions}
        draggable={false}
        edgeTypes={edgeTypes}
        nodesConnectable={false}
        nodesDraggable={false}
        edgesFocusable={false}
        onEdgeClick={() => {}}
      >
        <Controls position="top-right">
          <ConfigGraphDirectionToggle />
        </Controls>
      </ReactFlow>
    </div>
  );
}
