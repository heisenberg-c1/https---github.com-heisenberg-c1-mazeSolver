export const solveMazeByDFSRecursive = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []  // 只记录访问顺序
  const path = []   // 最终路径
  const visited = new Set()  
  
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
  
  const dfs = (row, col) => {
    // 边界检查
    if (row < 0 || row >= height || col < 0 || col >= width) {
      return false
    }
    
    // 墙或已访问
    if (grid[row][col].isWall || visited.has(`${row},${col}`)) {
      return false
    }
    
    // 标记访问并记录步骤
    visited.add(`${row},${col}`)
    steps.push({ row, col })  // 只记录访问的顺序
    
    // 到达终点
    if (row === end.row && col === end.col) {
      path.push({ row, col })  // 添加终点到路径
      return true
    }
    
    // 探索四个方向
    for (const [dr, dc] of directions) {
      if (dfs(row + dr, col + dc)) {
        path.unshift({ row, col })  // 将当前节点添加到路径开头
        return true
      }
    }
    
    return false
  }
  
  dfs(start.row, start.col)
  
  return { steps, path }
}

// export const solveMazeByDFSIterative = (grid, start, end) => {
//   const height = grid.length
//   const width = grid[0].length
//   const steps = []
//   const path = []
//   const visited = new Set()

//   const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
//   const stack = []
//   const dfs = () => {

//   }
//   dfs()
//   return { steps, path }
// }
