import { ConfigGraphNodes } from "@flanksource-ui/components/Configs/Graph/ConfigRelationshipGraph";
import { Node } from "reactflow";

export type NodeData = ConfigGraphNodes;

export type ExpandCollapseNode = Node<NodeData>;
