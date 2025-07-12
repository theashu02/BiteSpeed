import { MessageSquare } from "lucide-react"

export interface NodeConfig {
  label: string
  description: string
  icon: any
  defaultData: Record<string, any>
}

class NodeRegistry {
  private nodeTypes: Map<string, NodeConfig> = new Map()

  constructor() {
    // default node types
    this.registerNodeType("textNode", {
      label: "Message",
      description: "Send a text message to the user",
      icon: MessageSquare,
      defaultData: {
        text: "Hello! How can I help you today?",
      },
    })

    // Example of how to add more node types using the api calls logic:
    /*
    this.registerNodeType('conditionalNode', {
      label: 'Condition',
      description: 'Branch the conversation based on conditions',
      icon: GitBranch,
      defaultData: {
        condition: '',
        trueMessage: '',
        falseMessage: ''
      }
    })

    this.registerNodeType('apiCallNode', {
      label: 'API Call',
      description: 'Make an external API call',
      icon: Globe,
      defaultData: {
        url: '',
        method: 'GET',
        headers: {}
      }
    })
    */
  }

  registerNodeType(type: string, config: NodeConfig) {
    this.nodeTypes.set(type, config)
  }

  getNodeConfig(type: string): NodeConfig | undefined {
    return this.nodeTypes.get(type)
  }

  getAllNodeTypes(): string[] {
    return Array.from(this.nodeTypes.keys())
  }

  isNodeTypeRegistered(type: string): boolean {
    return this.nodeTypes.has(type)
  }
}

export const nodeRegistry = new NodeRegistry()
