"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { nodeRegistry } from "@/lib/node-registry"

type NodesPanelProps = {}

// NodesPanel component - displays available node types that can be dragged to the flow
export function NodesPanel({}: NodesPanelProps) {
  const availableNodes = nodeRegistry.getAllNodeTypes()

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="p-4 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Nodes Panel</h2>
        <p className="text-sm text-gray-600 mt-1">Drag and drop nodes to build your chatbot flow</p>
      </div>

      <div className="space-y-3">
        {availableNodes.map((nodeType) => {
          const config = nodeRegistry.getNodeConfig(nodeType)
          if (!config) return null

          return (
            <Card key={nodeType} className="cursor-grab hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div
                  className="w-full justify-start gap-2 h-auto p-3 bg-transparent border border-gray-200 rounded-md hover:bg-gray-50 flex items-center"
                  draggable
                  onDragStart={(event) => onDragStart(event, nodeType)}
                >
                  <config.icon className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">{config.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{config.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Drag nodes from this panel to the canvas, then click on any node to edit its properties.
        </p>
      </div>
    </div>
  )
}
