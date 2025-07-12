import type { Node, Edge } from "reactflow"

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// Flow validation logic
// Validates that all nodes (except start nodes) have incoming connections
export function validateFlow(nodes: Node[], edges: Edge[]): ValidationResult {
  // If there are no nodes, the flow is technically valid empty
  if (nodes.length === 0) {
    return { isValid: true }
  }

  // If there is only one node it is valid start node
  if (nodes.length === 1) {
    return { isValid: true }
  }

  // Find nodes that have no incoming edges
  const nodesWithoutIncoming = nodes.filter((node) => {
    return !edges.some((edge) => edge.target === node.id)
  })

  // If more than one node lacks incoming edges it is invalid
  // We allow one node to be the start node
  if (nodesWithoutIncoming.length > 1) {
    return {
      isValid: false,
      error: `Cannot save flow: ${nodesWithoutIncoming.length} nodes are not connected. Each node (except the start node) must have at least one incoming connection.`,
    }
  }

  // Additional validation rules can be added here like this-
  // - Check for circular dependencies
  // - Validate node-specific requirements
  // - Ensure required fields are filled

  return { isValid: true }
}

// Helper function to find disconnected node groups
export function findDisconnectedGroups(nodes: Node[], edges: Edge[]): Node[][] {
  const visited = new Set<string>()
  const groups: Node[][] = []

  const dfs = (nodeId: string, currentGroup: Node[]) => {
    if (visited.has(nodeId)) return

    visited.add(nodeId)
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      currentGroup.push(node)
    }

    // Find connected nodes
    const connectedEdges = edges.filter((e) => e.source === nodeId || e.target === nodeId)
    connectedEdges.forEach((edge) => {
      const connectedNodeId = edge.source === nodeId ? edge.target : edge.source
      dfs(connectedNodeId, currentGroup)
    })
  }

  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      const group: Node[] = []
      dfs(node.id, group)
      if (group.length > 0) {
        groups.push(group)
      }
    }
  })

  return groups
}
