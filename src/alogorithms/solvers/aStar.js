// algorithms/solvers/astar.js
export const solveMazeByAStar = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []
  const path = []
  
  // 优先队列（简单实现，实际项目中可以使用二叉堆）
  const openSet = []
  const closedSet = new Set()
  const gScore = new Map() // 从起点到当前节点的实际距离
  const fScore = new Map() // f = g + h (启发式距离)
  const parent = new Map()
  
  // 计算曼哈顿距离（启发式函数）
  const heuristic = (pos1, pos2) => {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col)
  }
  
  const directions = [
    [-1, 0], // 上
    [0, 1],  // 右
    [1, 0],  // 下
    [0, -1]  // 左
  ]
  
  // 初始化
  const startKey = `${start.row},${start.col}`
  
  parent.set(startKey, null)


  gScore.set(startKey, 0)
  fScore.set(startKey, heuristic(start, end))
  openSet.push({ 
    row: start.row, 
    col: start.col, 
    f: fScore.get(startKey),
    g: 0
  })
  
  while (openSet.length > 0) {
    // 按 fScore 排序，取最小值
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()
    const { row, col } = current
    const currentKey = `${row},${col}`
    
    // 记录步骤
    steps.push({ row, col })
    
    // 到达终点
    if (row === end.row && col === end.col) {
      // 重构路径
      let currentNode = { row, col }
      const tempPath = []
      
      while (currentNode !== null) {
        tempPath.unshift(currentNode)
        const nodeKey = `${currentNode.row},${currentNode.col}`
        currentNode = parent.get(nodeKey)
      }
      
      path.push(...tempPath)
      break
    }
    
    // 添加到已访问集合
    closedSet.add(currentKey)
    
    // 探索邻居
    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      const newKey = `${newRow},${newCol}`
      
      // 边界检查
      if (newRow < 0 || newRow >= height || newCol < 0 || newCol >= width) {
        continue
      }
      
      // 墙检查
      if (grid[newRow][newCol].isWall) {
        continue
      }
      
      // 已访问检查
      if (closedSet.has(newKey)) {
        continue
      }
      
      // 计算新的 gScore
      const tentativeGScore = gScore.get(currentKey) + 1
      
      // 检查是否需要更新
      if (!gScore.has(newKey) || tentativeGScore < gScore.get(newKey)) {
        parent.set(newKey, { row, col })
        gScore.set(newKey, tentativeGScore)
        fScore.set(newKey, tentativeGScore + heuristic({row: newRow, col: newCol}, end))
        
        // 检查是否已在 openSet 中
        const existingIndex = openSet.findIndex(node => 
          node.row === newRow && node.col === newCol
        )
        
        if (existingIndex === -1) {
          openSet.push({
            row: newRow,
            col: newCol,
            f: fScore.get(newKey),
            g: tentativeGScore
          })
        } else {
          openSet[existingIndex].f = fScore.get(newKey)
          openSet[existingIndex].g = tentativeGScore
        }
      }
    }
  }
  
  return { steps, path }
}