"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

// Dummy nodes
const initialNodes: Node[] = [
  { id: "1", data: { label: "Node 1" }, position: { x: 0, y: 0 } },
  { id: "2", data: { label: "Node 2" }, position: { x: 200, y: 0 } },
  { id: "3", data: { label: "Node 3" }, position: { x: 100, y: 150 } },
];

// Dummy edges (connectors)
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3" },
];

export default function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // called when you drag‐connect two nodes
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  return (
    <div className="w-full h-[400px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}