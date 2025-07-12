import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { MessageSquare } from "lucide-react";

// TextNode component - represents a single text message in the chatbot flow
// This component is reusable and follows React Flow node interface

export const TextNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`
      bg-white border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px]
      ${selected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
      hover:border-gray-300 transition-colors
    `}
    >
      <div className="bg-green-100 px-3 py-2 rounded-t-lg border-b border-gray-200 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">Send Message</span>
      </div>

      <div className="p-3">
        <div className="text-sm text-gray-700 break-words">
          {data.text || "Enter your message..."}
        </div>
      </div>

      {/* Target handle multiple incoming connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ left: -6 }}
      />

      {/* Source handle one outgoing connection */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ right: -6 }}
      />
    </div>
  );
});

TextNode.displayName = "TextNode";
