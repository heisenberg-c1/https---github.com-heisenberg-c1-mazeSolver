export const solveMazeByDFSRecursive = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []
  const path = []
  const visited = new Set()
  
  // 四个方向：上、右、下、左
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
  
  const dfs = (row, col, currentPath) => {
    // 边界检查
    if (row < 0 || row >= height || col < 0 || col >= width) {
      return false
    }
    
    // 墙或已访问过的格子
    if (grid[row][col].isWall || visited.has(`${row},${col}`)) {
      return false
    }
    
    // 标记为已访问
    visited.add(`${row},${col}`)
    currentPath.push({ row, col })
    
    // 记录步骤
    steps.push({
      current: { row, col },
      visited: Array.from(visited).map(pos => {
        const [r, c] = pos.split(',').map(Number)
        return { row: r, col: c }
      })
    })
    
    // 到达终点
    if (row === end.row && col === end.col) {
      path.push(...currentPath)
      return true
    }
    
    // 向四个方向递归探索
    for (const [dr, dc] of directions) {
      if (dfs(row + dr, col + dc, [...currentPath])) {
        return true
      }
    }
    
    return false
  }
  
  dfs(start.row, start.col, [])
  
  return { steps, path }
}
