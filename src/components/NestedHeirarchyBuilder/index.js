import React, { createRef, useRef, useState } from "react";

const sampleTree = {
  id: 1,
  description: "root",
  hasRating: false,
  rating: 1,
  children: [
    {
      id: 2,
      description: "c1",
      hasRating: true,
      rating: 1,
      children: [
        {
          id: 3,
          description: "c1c1",
          hasRating: true,
          rating: 0,
          children: []
        },
        {
          id: 4,
          description: "c1c2",
          hasRating: true,
          rating: -1,
          children: []
        },
        {
          id: 5,
          description: "c1c3",
          hasRating: false,
          rating: 1,
          children: []
        }
      ]
    },
    {
      id: 6,
      description: "c2",
      hasRating: false,
      rating: -1,
      children: []
    }
  ]
};

export function NestedHeirarchyBuilder({ ...rest }) {
  return (
    <div {...rest}>
      <Node node={sampleTree} />
    </div>
  );
}

function Node({ node }) {
  console.log("node", node);

  return (
    <div key={node.id} className="border border-red-500">
      {node.description || "(empty)"}
      {node.children && node.children.length > 0 && (
        <div className="border border-green-500">
          {node.children.map((child) => (
            <Node node={child} key={child.id} />
          ))}
        </div>
      )}
    </div>
  );
}
