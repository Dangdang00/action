// 모든 하위 노드의 ID를 가져오는 함수 (현재 노드 포함)
export const getAllNodeIdList = (node) => {
  const ids = [node.id]
  if (node.children) {
    node.children.forEach((child) => {
      ids.push(...getAllNodeIdList(child))
    })
  }
  return ids
}

// 특정 노드의 부모 노드를 찾는 함수
export const findParentNode = (tree, childId) => {
  for (const node of tree) {
    if (node.children && node.children.find((child) => child.id === childId)) {
      return node
    }
    if (node.children) {
      const parent = findParentNode(node.children, childId)
      if (parent) return parent
    }
  }
  return null
}
