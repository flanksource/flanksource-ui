import { Node } from "reactflow";

export type NodeData = {
  expanded: boolean;
  expandable: boolean;
};

export type ExpandCollapseNode = Node<NodeData>;
