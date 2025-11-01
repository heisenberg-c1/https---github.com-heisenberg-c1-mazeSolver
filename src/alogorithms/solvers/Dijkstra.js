export const solveMazeByDijkstra = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []
  const path = []
  
  // 优先队列（简单实现）
  const queue = []
  const visited = new Set()
  const distances = new Map() 
  const parent = new Map()
  
  const directions = [
    [-1, 0], // 上
    [0, 1],  // 右
    [1, 0],  // 下
    [0, -1]  // 左
  ]
  
  const startKey = `${start.row},${start.col}`
  
  distances.set(startKey, 0)
  queue.push({ 
    row: start.row, 
    col: start.col, 
    distance: 0 
  })
  
  parent.set(startKey, null)

  while (queue.length > 0) {
    // 按距离排序，取最小值
    queue.sort((a, b) => a.distance - b.distance)
    const current = queue.shift()
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
        console.log(currentNode)
        const nodeKey = `${currentNode.row},${currentNode.col}`
        currentNode = parent.get(nodeKey)
      }
      
      path.push(...tempPath)
      break
    }
    
    // 已访问检查
    if (visited.has(currentKey)) {
      continue
    }
    
    visited.add(currentKey)
    
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
      if (visited.has(newKey)) {
        continue
      }
      
      // 计算新距离
      const newDistance = distances.get(currentKey) + 1
      
      // 更新距离
      if (!distances.has(newKey) || newDistance < distances.get(newKey)) {
        distances.set(newKey, newDistance)
        parent.set(newKey, { row, col })
        
        // 检查是否已在队列中
        const existingIndex = queue.findIndex(node => 
          node.row === newRow && node.col === newCol
        )
        
        if (existingIndex === -1) {
          queue.push({
            row: newRow,
            col: newCol,
            distance: newDistance
          })
        } else {
          queue[existingIndex].distance = newDistance
        }
      }
    }
  }
  
  return { steps, path }
}