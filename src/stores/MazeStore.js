import { defineStore } from 'pinia'
import { generateMaze } from '@/alogorithms/generators/Prim.js'
export const useMazeStore = defineStore('maze', {
  state: () => ({
    // 迷宫参数
    height: 10,
    width: 15,
    totalCells: 150,
    genAlgo: 'Prim', // 生成算法
    solveAlgo: 'dfs-recursive', // 求解算法
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
      return state.solveSteps.length > 0
        ? state.solveSteps[state.solveSteps.length - 1].visited.length
        : 0
    },
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
        const result = generateMaze(this.width, this.height, 1, 1)
        this.grid = result.grid 
        this.start = result.start 
        this.end = result.end 
      } catch (error) {
        console.error('迷宫生成失败：', error)
      } finally {
        this.isGenerating = false
      }
    },
  },
})
