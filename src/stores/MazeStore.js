import { defineStore } from 'pinia';

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
    start: null,
    end: null,
    solveSteps: [], // 求解步骤
    shortestPath: [], // 最短路径

    // 状态
    isGenerating: false,
    isSolving: false,
    visitedCount: 0,
    pathLength: 0,
    timeTaken: 0,
  }),

  getters:{
    totalCells(state){
      return state.height * state.width;
    },
    visitedCells(state){
      return state.solveSteps.length > 0 ? state.solveSteps[state.solveSteps.length -1].visited.length : 0;
    }
  }



  // actions: {
  //   async generateMaze() {
  //     this.isGenerating = true;
  //     this.steps = [];
  //     this.grid = null;

  //     try {
  //       let result;
  //       switch (this.genAlgo) {
  //         case 'dfs':
  //           result = generateMazeDFS(this.rows, this.cols, this.seed);
  //           break;
  //         case 'prim':
  //           result = generateMazePrim(this.rows, this.cols, this.seed);
  //           break;
  //       }

  //       this.grid = result.grid;
  //       this.start = result.start;
  //       this.end = result.end;
  //       this.steps = result.steps;
  //     } catch (error) {
  //       console.error('生成迷宫失败：', error);
  //     } finally {
  //       this.isGenerating = false;
  //     }
  //   },

  //   async solveMaze() {
  //     if (!this.grid) return;
  //     this.isSolving = true;
  //     this.solveSteps = [];
  //     this.shortestPath = [];
  //     //这里的dfs和bfs需要recursive和非recursive两种函数
  //     try {
  //       let result;
  //       switch (this.solveAlgo) {
  //         case 'bfs':
  //           result = solveMazeBFS(this.grid, this.start, this.end);
  //           break;
  //         case 'aStar':
  //           result = solveMazeAStar(this.grid, this.start, this.end);
  //           break;
  //         // case 'dfs':
  //         //   result = solveMazeDFS(this.grid, this.start, this.end);
  //         //   break;

  //       }

  //       this.solveSteps = result.steps;
  //       this.shortestPath = result.path;
  //       this.visitedCount = result.visitedCount;
  //       this.pathLength = result.path.length;
  //       this.timeTaken = result.time;
  //     } catch (error) {
  //       console.error('求解迷宫失败：', error);
  //     } finally {
  //       this.isSolving = false;
  //     }
  //   },

  //   // 重置迷宫
  //   resetMaze() {
  //     this.grid = null;
  //     this.steps = [];
  //     this.solveSteps = [];
  //     this.shortestPath = [];
  //     this.visitedCount = 0;
  //     this.pathLength = 0;
  //   },
  // },
});

