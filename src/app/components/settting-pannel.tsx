"use client";

import { useState, useEffect } from "react";
import type { Node } from "reactflow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { nodeRegistry } from "@/lib/node-registry";

interface SettingsPanelProps {
  node: Node;
  onUpdateNode: (nodeId: string, newData: any) => void;
  onClose: () => void;
}

// SettingsPanel component - allows editing of selected node properties
export function SettingsPanel({
  node,
  onUpdateNode,
  onClose,
}: SettingsPanelProps) {
  const [localData, setLocalData] = useState(node.data);
  const nodeConfig = nodeRegistry.getNodeConfig(node.type!);

  // Update local state when node changes
  useEffect(() => {
    setLocalData(node.data);
  }, [node.data]);

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    // Update the node immediately for real-time
    onUpdateNode(node.id, newData);
  };

  if (!nodeConfig) {
    return (
      <div className="p-4">
        <p className="text-red-500">Unknown node type: {node.type}</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold text-gray-900">Settings Panel</h2>
      </div>

      {/* Node type indicator */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <nodeConfig.icon className="w-4 h-4" />
            {nodeConfig.label}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Dynamic settings based on node type */}
      <div className="space-y-4">
        {/* Text Node Settings */}
        {node.type === "textNode" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="text" className="text-sm font-medium">
                Message Text
              </Label>
              <Textarea
                id="text"
                value={localData.text || ""}
                onChange={(e) => handleInputChange("text", e.target.value)}
                placeholder="Enter the message text..."
                className="mt-1 min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                This text will be sent to users when they reach this node.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Node information */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Node ID:</strong> {node.id}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          <strong>Type:</strong> {node.type}
        </p>
      </div>
    </div>
  );
}

{ /* Future node types can add their settings here */ }
{
  /* Example for conditional node:
        {node.type === 'conditionalNode' && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                value={localData.condition || ''}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                placeholder="Enter condition..."
              />
            </div>
          </div>
        )}
        */
}
