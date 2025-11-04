import { BinaryHeap } from '../../utils/BinaryHeap.js'

export const solveMazeByAStar = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []
  const path = []
  
  // 二叉堆作为优先队列
  const pq = new BinaryHeap((a, b) => a.f - b.f)
  const isVisited = new Set()
  const gScore = new Map() 
  const fScore = new Map() 
  const parent = new Map()
  
  
  // 曼哈顿距离
  const heuristic = (pos1, pos2) => {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col)
  }
  
  const directions = [
    [-1, 0], 
    [0, 1],  
    [1, 0],  
    [0, -1]  
  ]
  
  const startKey = `${start.row},${start.col}`
  
  parent.set(startKey, null)
  gScore.set(startKey, 0)
  fScore.set(startKey, heuristic(start, end))
  
  const startNode = { 
    row: start.row, 
    col: start.col, 
    f: fScore.get(startKey),
    g: 0
  }
  
  pq.push(startNode)
  
  while (!pq.isEmpty()) {
    const current = pq.pop()
    const { row, col } = current
    const currentKey = `${row},${col}`
    
    if (isVisited.has(currentKey)) {
      continue
    }
    
    steps.push({ row, col })
    
    if (row === end.row && col === end.col) {
      let currentNode = { row, col }
      const tempPath = []
      
      while (currentNode !== null) {
        tempPath.unshift(currentNode)
        const nodeKey = `${currentNode.row},${currentNode.col}`
        const parentNode = parent.get(nodeKey)
        currentNode = parentNode
      }
      
      path.push(...tempPath)
      break
    }
    
    isVisited.add(currentKey)
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      const newKey = `${newRow},${newCol}`
      
      if (newRow < 0 || newRow >= height || newCol < 0 || newCol >= width) {
        continue
      }
      
      if (grid[newRow][newCol].isWall) {
        continue
      }
      
      if (isVisited.has(newKey)) {
        continue
      }
      
      const tentativeGScore = gScore.get(currentKey) + 1
      
      if (!gScore.has(newKey) || tentativeGScore < gScore.get(newKey)) {
        parent.set(newKey, { row, col })
        gScore.set(newKey, tentativeGScore)
        fScore.set(newKey, tentativeGScore + heuristic({row: newRow, col: newCol}, end))
        
        const newNode = {
          row: newRow,
          col: newCol,
          f: fScore.get(newKey),
          g: tentativeGScore
        }
        pq.push(newNode)
      }
    }
  }
  
  return { steps, path }
}