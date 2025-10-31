class disjointSet {
    constructor(size) {
        this.parent = new Array(size);
        this.rank = new Array(size);
        for(let i = 0; i < size; i++) {
            this.parent[i] = i;
            this.rank[i] = 1;
        }
    }
    find(x) {
        if (this.parent[x] === x) {
            return this.parent[x];
        }
        //路径压缩
        return this.parent[x] = this.find(this.parent[x]);
    }

    isConnected(x, y) {
        return this.find(x) === this.find(y);
    }

    connect(x, y) {
        let xFather = this.find(x);
        let yFather = this.find(y);
        if (xFather === yFather) {
            return;
        }
        //按秩合并
        if (this.rank[xFather] < this.rank[yFather]) {
            this.parent[xFather] = yFather;
        } else if (this.rank[xFather] > this.rank[yFather]) {
            this.parent[yFather] = xFather;
        } else {
            this.parent[yFather] = xFather;
            this.rank[xFather]++;
        }
    }
}

export const generateMazeByKruskal = (width, height, startRow, startCol) => {
  // 初始化迷宫：所有格子都是墙
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

  // 构造所有可能的边（即两个格子之间的墙）
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

  // 开始构建迷宫
  for (const edge of edges) {
    const { from, to, wall } = edge
    const idxFrom = getIndex(from.row, from.col)
    const idxTo = getIndex(to.row, to.col)

    if (!ds.isConnected(idxFrom, idxTo)) {
      ds.connect(idxFrom, idxTo)
      // 打通格子和中间的墙
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