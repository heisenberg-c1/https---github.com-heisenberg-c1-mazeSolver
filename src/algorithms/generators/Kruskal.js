import { disjointSet } from '../../utils/DisjointSet.js'

export const generateMazeByKruskal = (width, height, startRow, startCol) => {
  const grid = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => ({
      row,
      col,
      isWall: true,
    }))
  )

  
  const ds = new disjointSet(width * height)
  const edges = []

  // 辅助函数：二维坐标转一维索引
  const getIndex = (r, c) => r * width + c

  for (let r = 1; r < height; r += 2) {
    for (let c = 1; c < width; c += 2) {
      // 向右连接
      if (c + 2 < width) {
        edges.push({
          from: { row: r, col: c },
          to: { row: r, col: c + 2 },
          wall: { row: r, col: c + 1 },
        })
      }
      // 向下连接
      if (r + 2 < height) {
        edges.push({
          from: { row: r, col: c },
          to: { row: r + 2, col: c },
          wall: { row: r + 1, col: c },
        })
      }
    }
  }

  // 随机打乱边
  edges.sort(() => Math.random() - 0.5)

  for (const edge of edges) {
    const { from, to, wall } = edge
    const idxFrom = getIndex(from.row, from.col)
    const idxTo = getIndex(to.row, to.col)

    if (!ds.isConnected(idxFrom, idxTo)) {
      ds.connect(idxFrom, idxTo)
      grid[from.row][from.col].isWall = false
      grid[to.row][to.col].isWall = false
      grid[wall.row][wall.col].isWall = false
    }
  }

  

  const endRow = height - 2
  const endCol = width - 2
  grid[endRow][endCol].isWall = false
  grid[startRow][startCol].isWall = false

  return grid
}