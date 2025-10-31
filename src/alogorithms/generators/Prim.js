const getWallNeighbors = (grid, row, col, height, width) => {
  const walls = []

  // 上方墙（在(row-1, col)位置，连接(row-2, col)）
  if (row > 1 && !grid[row - 2][col].visited) {
    // 确保墙不在上边界

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

  // 使用优先队列（这里用数组模拟，随机选择）
  //TODO：优化为优先队列（最小堆）
  let walls = getWallNeighbors(grid, startRow, startCol, height, width)

  while (walls.length > 0) {
    // 随机选择一面墙
    const randomIndex = Math.floor(Math.random() * walls.length)
    const { wall, neighbor } = walls.splice(randomIndex, 1)[0]

    // 如果邻居未被访问，则打通这面墙
    if (!neighbor.visited) {
      // 打通墙（将墙变为路径）
      grid[wall.row][wall.col].isWall = false
      neighbor.isWall = false
      neighbor.visited = true

      // 添加新墙到候选列表
      const newWalls = getWallNeighbors(grid, neighbor.row, neighbor.col, height, width)
      walls = [...walls, ...newWalls]
    }
  }

  // 设置终点
  const endRow = height - 2
  const endCol = width - 2
  const end = grid[endRow][endCol]
  end.isWall = false

  return { grid, start, end }
}
