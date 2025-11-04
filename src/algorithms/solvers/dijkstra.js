import { BinaryHeap } from '../../utils/BinaryHeap.js'

export const solveMazeByDijkstra = (grid, start, end) => {
  const height = grid.length
  const width = grid[0].length
  const steps = []
  const path = []
  
  const pq = new BinaryHeap((a, b) => a.distance - b.distance)
  const visited = new Set()
  const distances = new Map()
  const parent = new Map()
  
  const directions = [
    [-1, 0], 
    [0, 1],  
    [1, 0],  
    [0, -1]  
  ]
  
  const startKey = `${start.row},${start.col}`
  
  distances.set(startKey, 0)
  parent.set(startKey, null)
  
  const startNode = {
    key: startKey,
    row: start.row,
    col: start.col,
    distance: 0
  }
  
  pq.push(startNode)
  
  while (!pq.isEmpty()) {
    const current = pq.pop()
    const { row, col } = current
    const currentKey = `${row},${col}`
    
    if (visited.has(currentKey)) {
      continue
    }
    
    visited.add(currentKey)
    steps.push({ row, col })
    
    if (row === end.row && col === end.col) {
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
      
      if (visited.has(newKey)) {
        continue
      }
      
      const newDistance = distances.get(currentKey) + 1
      
      if (!distances.has(newKey) || newDistance < distances.get(newKey)) {
        distances.set(newKey, newDistance)
        parent.set(newKey, { row, col })
        
        const newNode = {
          key: newKey,
          row: newRow,
          col: newCol,
          distance: newDistance
        }
        
        if (pq.has(newKey)) {
          pq.update(newKey, newNode)
        } else {
          pq.push(newNode)
        }
      }
    }
  }
  
  return { steps, path }
}