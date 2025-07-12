"use client"
import type React from "react";
import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "sonner"

import { NodesPanel } from "@/app/components/node-pannel";
import { SettingsPanel } from "@/app/components/settting-pannel";
import { TextNode } from "@/app/components/text-node";
import { SaveButton } from "@/app/components/save-button";
import { nodeRegistry } from "@/lib/node-registry";
import { validateFlow } from "@/lib/flow-validation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: "1",
    type: "textNode",
    position: { x: 250, y: 100 },
    data: { text: "Welcome to our chatbot!" },
  },
];

const initialEdges: Edge[] = [];

function ChatbotFlowBuilderInner() {
  const [nodes, setNodes, onNodesChange]: [Node[], any, OnNodesChange] =
    useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange]: [Edge[], any, OnEdgesChange] =
    useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  // Register custom node types - extensible design allows easy addition of new node types
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      textNode: TextNode,
      // Future node types can be easily added here:
      // ConditionalNode,
      // ApiCallNode,
    }),
    []
  );

  // Handle new connections between nodes
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      // Validate that source handles only have one outgoing edge
      const existingEdge = edges.find(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );

      if (existingEdge) {
        // Remove existing edge before adding new one (source handle constraint)
        setEdges((eds: any) => eds.filter((edge : any) => edge.id !== existingEdge.id));
      }

      setEdges((eds: any) => addEdge(params, eds));
      setValidationError(null);
    },
    [edges, setEdges]
  );

  // node selection for settings panel
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // clicking on empty canvas to deselect nodes
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Update node data
  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds: any) =>
        nds.map((node: any) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Handle drag over event for the React Flow
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop event when dragging from nodes panel
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is a valid node type
      if (typeof nodeType === "undefined" || !nodeType) {
        return;
      }

      const nodeConfig = nodeRegistry.getNodeConfig(nodeType);
      if (!nodeConfig) return;

      // Convert screen coordinates to flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: { ...nodeConfig.defaultData },
      };

      setNodes((nds: any) => [...nds, newNode]);
      setValidationError(null);
    },
    [screenToFlowPosition, setNodes]
  );

  // Save flow with validation
  const saveFlow = useCallback(() => {
    const validation = validateFlow(nodes, edges);

    if (!validation.isValid) {
      setValidationError(validation.error!);
      return;
    }

    console.log("Saving flow:", { nodes, edges });
    console.log("Flow saved successfully!");
    setValidationError(null);
    // alert("Flow saved successfully!");
    toast("Flow saved successfully!")
  }, [nodes, edges]);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;

  return (
    <div className="h-screen flex">
      {/* Main flow canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        <div className="absolute top-4 right-4 z-10">
          <SaveButton onSave={saveFlow} />
        </div>

        {/* Validation error display */}
        {validationError && (
          <div className="absolute top-16 right-4 z-10 w-80">
            <Alert
              variant="destructive"
              className="flex items-center justify-between"
            >
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-16 w-16" />
                <AlertDescription>{validationError}</AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setValidationError(null)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="w-80 border-l bg-white">
        {selectedNode ? (
          <SettingsPanel
            node={selectedNode}
            onUpdateNode={updateNodeData}
            onClose={() => setSelectedNodeId(null)}
          />
        ) : (
          <NodesPanel />
        )}
      </div>
    </div>
  );
}

export default function ChatbotFlowBuilder() {
  return (
    <ReactFlowProvider>
      <ChatbotFlowBuilderInner />
    </ReactFlowProvider>
  );
}
