export const solveMazeByBFS = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []
  const path = []
  const visited = new Set()
  const queue = [] // BFS 队列
  const parent = new Map() // 用于重构最短路径
  
  // 四个方向：上、右、下、左
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
  
  // 初始化
  const startPos = `${start.row},${start.col}`
  visited.add(startPos)
  queue.push({ row: start.row, col: start.col })
  parent.set(startPos, null) // 起点没有父节点
  
  // BFS 主循环
  while (queue.length > 0) {
    // 从队列前端取出节点
    const current = queue.shift()
    const { row, col } = current
    const currentPos = `${row},${col}`
    
    // 记录当前步骤（用于动画）
    steps.push({
      current: { row, col },
      visited: Array.from(visited).map(pos => {
        const [r, c] = pos.split(',').map(Number)
        return { row: r, col: c }
      })
    })
    
    // 检查是否到达终点
    if (row === end.row && col === end.col) {
      // 重构最短路径
      let currentNode = { row, col }
      const tempPath = []
      
      // 从终点回溯到起点
      while (currentNode !== null) {
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
      
      // 检查边界条件
      if (newRow < 0 || newRow >= height || newCol < 0 || newCol >= width) {
        continue
      }
      
      // 检查是否是墙
      if (grid[newRow][newCol].isWall) {
        continue
      }
      
      // 检查是否已访问
      if (visited.has(newPos)) {
        continue
      }
      
      // 标记为已访问并加入队列
      visited.add(newPos)
      queue.push({ row: newRow, col: newCol })
      parent.set(newPos, { row, col }) // 记录父节点
    }
  }
  
  return { steps, path }
}