import { Node } from "@ingooutgo/core"

export type NodeRegistration = {
  id: string
  name: string
  create: () => Node
}

export type Catalog = {
  label?: string
  nodes: NodeRegistration[]
  subcategories: {
    [name: string]: Catalog
  }
}

export const nodeRegResolver = (
  id: string,
  rootNodeCatalog: Catalog
): NodeRegistration | undefined => {
  const found = rootNodeCatalog.nodes.find((n) => n.id == id)
  if (found) {
    return found
  }
  for (const sc in rootNodeCatalog.subcategories) {
    const found = nodeRegResolver(id, rootNodeCatalog.subcategories[sc])
    if (found) {
      return found
    }
  }
}

export const nodesInSubCategories = (rootCatalog: Catalog): NodeRegistration[] => {
  return Array.from(
    new Set([
      ...Object.values(rootCatalog.subcategories).flatMap((c) => nodesInSubCategories(c)),
      ...rootCatalog.nodes,
    ])
  )
}
