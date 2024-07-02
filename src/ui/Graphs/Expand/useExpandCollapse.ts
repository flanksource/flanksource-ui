import Dagre from "@dagrejs/dagre";
import { useMemo } from "react";
import { Edge, Node, Position } from "reactflow";
import { type NodeData } from "./types";

export type UseExpandCollapseOptions = {
  layoutNodes?: boolean;
  direction?: "LR" | "TB";
};

function filterCollapsedChildren(
  dagre: Dagre.graphlib.Graph,
  node: Node<NodeData>
) {
  // 🚨 The current types for some of dagre's methods are incorrect. In future
  // versions of dagre this should be fixed, but for now we need to cast the return
  // value to keep TypeScript happy.
  const children = dagre.successors(node.id) as unknown as string[] | undefined;

  // Only intermediary nodes can be expanded or collapsed, everything else is
  // expanded by default.
  node.data.expandable = node.data.data.type === "intermediary";

  // debugging purposes
  node.data.childrenCount = children ? children.length : 0;

  // for children with two or less nodes, we want to expand them by default
  node.data.expanded =
    children && children?.length <= 3 ? true : node.data.expanded;

  if (children && children?.length > 1) {
    // If the node is collapsed (ie it is not expanded) then we want to remove all
    // of its children from the graph *and* any of their children.
    // Please note, only intermediary nodes can be expanded or collapsed,
    // everything else is expanded by default.
    if (!node.data.expanded && node.data.expandable) {
      while (children?.length) {
        const child = children.pop()!;
        if (dagre.successors(child)) {
          children.push(...(dagre.successors(child) as unknown as string[]));
          dagre.removeNode(child);
        }
      }
    }
  }
}

function useExpandCollapse(
  nodes: Node[],
  edges: Edge[],
  { layoutNodes = true, direction = "LR" }: UseExpandCollapseOptions = {}
): { nodes: Node[]; edges: Edge[] } {
  return useMemo(() => {
    if (!layoutNodes) return { nodes, edges };

    // 1. Create a new instance of `Dagre.graphlib.Graph` and set some default
    // properties.
    const dagre = new Dagre.graphlib.Graph()
      .setDefaultEdgeLabel(() => ({}))
      .setGraph({
        rankdir: direction,
        ranksep: 120,
        // edgesep: 30,
        nodesep: 100,
        width: 400,
        height: 100,
        ranker: "tight-tree"
      });

    // 2. Add each node and edge to the dagre graph. Instead of using each node's
    // intrinsic width and height, we tell dagre to use the `treeWidth` and
    // `treeHeight` values. This lets you control the space between nodes.
    for (const node of nodes) {
      dagre.setNode(node.id, {
        ...node,
        data: node.data
      } as any);
    }

    for (const edge of edges) {
      dagre.setEdge(edge.source, edge.target);
    }

    // 3. Iterate over the nodes *again* to determine which ones should be hidden
    // based on expand/collapse state. Hidden nodes are removed from the dagre
    // graph entirely.
    for (const node of nodes) {
      filterCollapsedChildren(dagre, node);
    }

    // 4. Run the dagre layouting algorithm.
    Dagre.layout(dagre);

    return {
      // 5. Return a new array of layouted nodes. This will not include any nodes
      // that were removed from the dagre graph in step 3.
      //
      // 💡 `Array.flatMap` can act as a *filter map*. If we want to remove an
      // element from the array, we can return an empty array in this iteration.
      // Otherwise, we can map the element like normal and wrap it in a singleton
      // array.
      nodes: nodes.flatMap((node) => {
        // This node might have been filtered out by `filterCollapsedChildren` if
        // any of its ancestors were collapsed.
        if (!dagre.hasNode(node.id)) return [];

        const { x, y } = dagre.node(node.id);

        const position = { x, y };
        // 🚨 `filterCollapsedChildren` *mutates* the data object of a node. React
        // will not know the data has changed unless we create a new object here.
        const data = { ...node.data };

        node.sourcePosition =
          direction === "LR" ? Position.Right : Position.Bottom;
        node.targetPosition = direction === "LR" ? Position.Left : Position.Top;

        return [{ ...node, position, data }];
      }),
      edges
    };
  }, [layoutNodes, nodes, edges, direction]);
}

export default useExpandCollapse;
