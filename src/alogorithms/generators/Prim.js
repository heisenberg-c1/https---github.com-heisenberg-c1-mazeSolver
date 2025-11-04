import { BinaryHeap } from '../../utils/BinaryHeap.js'

const getWallNeighbors = (grid, row, col, height, width) => {
  const walls = []

  // 上方墙（在(row-1, col)位置，连接(row-2, col)）
  if (row > 1 && !grid[row - 2][col].visited) {
    walls.push({
      wall: { row: row - 1, col },
      neighbor: grid[row - 2][col],
    })
  }

  // 下方墙（在(row+1, col)位置，连接(row+2, col)）
  if (row < height - 2 && !grid[row + 2][col].visited) {
    walls.push({
      wall: { row: row + 1, col },
      neighbor: grid[row + 2][col],
    })
  }

  // 左侧墙（在(row, col-1)位置，连接(row, col-2)）
  if (col > 1 && !grid[row][col - 2].visited) {
    walls.push({
      wall: { row, col: col - 1 },
      neighbor: grid[row][col - 2],
    })
  }

  // 右侧墙（在(row, col+1)位置，连接(row, col+2)）
  if (col < width - 2 && !grid[row][col + 2].visited) {
    walls.push({
      wall: { row, col: col + 1 },
      neighbor: grid[row][col + 2],
    })
  }

  return walls
}

export const generateMazeByPrim = (width, height, startRow, startCol) => {
  const grid = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => ({
      row,
      col,
      isWall: true, 
      visited: false,
    })),
  )

  // 起点设为路径（非墙），并标记为已访问
  const start = grid[startRow][startCol]
  start.isWall = false
  start.visited = true
  
  // 使用优先队列替代数组
  // 可以根据不同策略定义优先级，这里使用随机值
  const walls = new BinaryHeap((a, b) => a.priority - b.priority)
  
  const initialWalls = getWallNeighbors(grid, startRow, startCol, height, width)
  initialWalls.forEach(wallInfo => {
    walls.push({
      wall: wallInfo.wall,
      neighbor: wallInfo.neighbor,
      priority: Math.random(), // 随机优先级，保持随机性
      key: `${wallInfo.wall.row},${wallInfo.wall.col}`
    })
  })

  while (!walls.isEmpty()) {
    // 从优先队列中获取优先级最高的墙
    const { wall, neighbor } = walls.pop()

    // 如果邻居未被访问，则打通这面墙
    if (!neighbor.visited) {
      // 打通墙（将墙变为路径）
      grid[wall.row][wall.col].isWall = false
      neighbor.isWall = false
      neighbor.visited = true

      // 添加新墙到优先队列
      const newWalls = getWallNeighbors(grid, neighbor.row, neighbor.col, height, width)
      newWalls.forEach(wallInfo => {
        walls.push({
          wall: wallInfo.wall,
          neighbor: wallInfo.neighbor,
          priority: Math.random(), // 随机优先级
          key: `${wallInfo.wall.row},${wallInfo.wall.col}`
        })
        console.log('Added wall:', walls.heap[walls.heap.length - 1].priority, walls.heap[walls.heap.length - 1].key)
      })
    }
  }

  // 设置终点
  const endRow = height - 2
  const endCol = width - 2
  const end = grid[endRow][endCol]
  end.isWall = false

  return grid
}