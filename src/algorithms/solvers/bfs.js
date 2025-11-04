export const solveMazeByBFS = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []
  const path = []
  const visited = new Set()
  const queue = [] 
  const parent = new Map() 

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ]

  // 初始化
  const startPos = `${start.row},${start.col}`
  visited.add(startPos)
  queue.push({ row: start.row, col: start.col })
  parent.set(startPos, null) // 起点没有父节点

  // BFS 主循环
  while (queue.length > 0) {
    const current = queue.shift()
    const { row, col } = current

    steps.push({
      row,
      col,
    })

    if (row === end.row && col === end.col) {
      // 重构最短路径
      let currentNode = { row, col }
      const tempPath = []

      // 从终点回溯到起点
      while (currentNode !== null) {
        console.log(currentNode)
        tempPath.unshift(currentNode)
        const nodeKey = `${currentNode.row},${currentNode.col}`
        currentNode = parent.get(nodeKey)
      }

      path.push(...tempPath)
      break // 找到路径，结束搜索
    }

    // 探索四个方向的邻居
    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      const newPos = `${newRow},${newCol}`

      if (newRow < 0 || newRow >= height || newCol < 0 || newCol >= width) {
        continue
      }

      if (grid[newRow][newCol].isWall) {
        continue
      }

      if (visited.has(newPos)) {
        continue
      }

      visited.add(newPos)
      queue.push({ row: newRow, col: newCol })
      parent.set(newPos, { row, col }) // 记录父节点
    }
  }

  return { steps, path }
}
