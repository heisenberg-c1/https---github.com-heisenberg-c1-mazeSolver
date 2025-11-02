import { defineStore } from 'pinia'
// import { generateMazeByPrim } from '@/alogorithms/generators/Prim.js'
import { generateMazeByKruskal } from '@/alogorithms/generators/Kruskal.js'
import { solveMazeByDFSRecursive } from '@/alogorithms/solvers/dfs.js'
import { solveMazeByBFS } from '@/alogorithms/solvers/bfs.js'
import { solveMazeByAStar } from '@/alogorithms/solvers/aStar.js'
import { solveMazeByDijkstra } from '@/alogorithms/solvers/dijkstra.js'

export const useMazeStore = defineStore('maze', {
  state: () => ({
    // 迷宫参数
    height: 10,
    width: 15,
    totalCells: 150,
    genAlgo: null, // 生成算法
    solveAlgo: null, // 求解算法
    seed: null,
    isAnimate: false,
    animationSpeed: 50, // 动画延迟（毫秒）

    // 迷宫数据
    grid: null,
    start: {},
    end: {},
    solveSteps: [], // 求解步骤
    shortestPath: [], // 最短路径

    // 状态
    isGenerating: false,
    isSolving: false,
    visitedCount: 0,
    pathLength: 0,
    timeTaken: 0,

    //canvas相关
    cellSize: null,
    selectMode: null,
  }),

  getters: {
    totalCells(state) {
      return state.height * state.width
    },
    visitedCells(state) {
      return state.visitedCount
    },
    totalEmptyCells(state) {
      if (!state.grid) {
        console.log('grid is null')
        return 0
      }
      let count = 0
      for (let row of state.grid) {
        for (let cell of row) {
          if (!cell.isWall) {
            count++
          }
        }
      }
      return count
    },
    timeComplexity(state) {
      switch (state.solveAlgo) {
        case 'dfs-recursive':
          return 'O(N)'
        case 'dfs-iterative':
          return 'O(N)'
        case 'bfs':
          return 'O(N)'
        case 'astar':
          return  'O(N² log N)'
        case 'dijkstra':
          return 'O(N² log N)'
        default:
          return '待选择求解算法'
      }
    }

  },

  actions: {
    setSelectionMode(mode) {
      this.selectMode = mode // 'start' | 'end' | null
    },

    //test
    async generateMaze() {
      this.isGenerating = true
      this.solveSteps = [] 
      this.shortestPath = [] 
      this.visitedCount = 0 

      try {
        const result = generateMazeByKruskal(this.width, this.height, 1, 1)
        this.grid = result 
        this.start = {row: 1, col: 1}
        this.end = {row: this.height - 2, col: this.width - 2}
        console.log(this.grid)
      } catch (error) {
        console.error('迷宫生成失败：', error)
      } finally {
        this.isGenerating = false
      }
    },

    async solveMaze() {
      if (!this.grid || !this.start || !this.end) {
        console.warn('无法求解：缺少迷宫数据或起终点')
        return
      }

      this.isSolving = true
      this.solveSteps = []
      this.shortestPath = []
      
      try {
        let result
        
        const startTime = performance.now()
        
        switch (this.solveAlgo) {
          case 'dfs-recursive':
            result = solveMazeByDFSRecursive(this.grid, this.start, this.end)
            break
          case 'dfs-iterative':
            break
          case 'bfs':
            result = solveMazeByBFS(this.grid, this.start, this.end)
            break
          case 'astar':
            result = solveMazeByAStar(this.grid, this.start, this.end)
            break
          case 'dijkstra':
            result = solveMazeByDijkstra(this.grid, this.start, this.end)
            break
          default:
            return
        }
        
        const endTime = performance.now()
        
        this.solveSteps = result.steps
        
        this.shortestPath = result.path
        this.pathLength = result.path.length
        this.visitedCount = result.steps.length
        this.timeTaken = endTime - startTime
        console.log('求解步骤:', this.solveSteps)
        console.log(`求解完成，耗时: ${this.timeTaken.toFixed(2)}ms`)
        console.log('求解步骤数:', this.solveSteps.length)
        console.log('最短路径长度:', this.shortestPath.length)
        
      } catch (error) {
        console.error('迷宫求解失败：', error)
      } finally {
        this.isSolving = false
      }
    },
  },
})
