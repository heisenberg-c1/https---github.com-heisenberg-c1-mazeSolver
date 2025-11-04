export const solveMazeByDFSRecursive = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []  // 只记录访问顺序
  const path = []   // 最终路径
  const visited = new Set()  
  
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
  
  const dfs = (row, col) => {
    if (row < 0 || row >= height || col < 0 || col >= width) {
      return false
    }
    
    if (grid[row][col].isWall || visited.has(`${row},${col}`)) {
      return false
    }
    
    visited.add(`${row},${col}`)
    steps.push({ row, col })  // 只记录访问的顺序
    
    if (row === end.row && col === end.col) {
      path.push({ row, col })  // 添加终点到路径
      return true
    }
    
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




export const solveMazeByDFSIterative = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []  
  const path = []   
  const visited = new Set()
  
  const stack = [{ row: start.row, col: start.col, parent: null }]
  
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
  
  const parentMap = new Map()
  
  while (stack.length > 0) {
    const { row, col, parent } = stack.pop()
    const key = `${row},${col}`
    
    if (visited.has(key)) {
      continue
    }
    
    visited.add(key)
    steps.push({ row, col })
    
    if (parent !== null) {
      parentMap.set(key, parent)
    }
    
    if (row === end.row && col === end.col) {
      let currentKey = `${end.row},${end.col}`
      while (currentKey) {
        const [r, c] = currentKey.split(',').map(Number)
        path.unshift({ row: r, col: c })
        currentKey = parentMap.get(currentKey)
      }
      break
    }
    
    // 为了保持DFS的特性应该按相反顺序压入栈
    for (let i = directions.length - 1; i >= 0; i--) {
      const [dr, dc] = directions[i]
      const newRow = row + dr
      const newCol = col + dc
      const newKey = `${newRow},${newCol}`
      
      if (
        newRow >= 0 && newRow < height &&
        newCol >= 0 && newCol < width &&
        !grid[newRow][newCol].isWall &&
        !visited.has(newKey)
      ) {
        stack.push({ 
          row: newRow, 
          col: newCol, 
          parent: key 
        })
      }
    }
  }
  
  return { steps, path }
}