<template>
  <div class="maze-canvas">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      @click="handleCanvasClick"
      class="maze-canvas-element"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useMazeStore } from '@/stores/MazeStore'

const store = useMazeStore()
const canvasRef = ref(null)
let ctx = null

// 计算画布尺寸
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// 初始化画布
const initCanvas = async () => {
  await nextTick()
  if (!canvasRef.value) return

  const container = canvasRef.value.parentElement
  if (!container) return

  // 获取容器尺寸（减去padding）
  const containerRect = container.getBoundingClientRect()
  const computedStyle = window.getComputedStyle(container)
  const paddingLeft = parseFloat(computedStyle.paddingLeft)
  const paddingRight = parseFloat(computedStyle.paddingRight)
  const paddingTop = parseFloat(computedStyle.paddingTop)
  const paddingBottom = parseFloat(computedStyle.paddingBottom)

  canvasWidth.value = containerRect.width - paddingLeft - paddingRight
  canvasHeight.value = containerRect.height - paddingTop - paddingBottom

  ctx = canvasRef.value.getContext('2d')

  // 计算合适的格子大小
  calculateCellSize()
}

// 计算格子大小（自适应）
const calculateCellSize = () => {
  const availableWidth = canvasWidth.value
  const availableHeight = canvasHeight.value

  // 考虑边距
  const margin = 20
  const widthCellSize = Math.floor((availableWidth - margin * 2) / store.width)
  const heightCellSize = Math.floor((availableHeight - margin * 2) / store.height)

  // 取较小值，限制最大/最小值
  const cellSize = Math.min(widthCellSize, heightCellSize, 40)
  store.cellSize = Math.max(cellSize, 5)
}

// 绘制单个格子的函数
const drawCell = (cell, x, y, cellSize, fillColor = null) => {
  // 如果指定了填充颜色，则使用指定颜色
  if (fillColor) {
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y, cellSize, cellSize)
    return
  }

  // 墙（黑色）
  if (cell.isWall) {
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, cellSize, cellSize)
    return
  }

  // 起点（绿色）
  if (store.start && cell.row === store.start.row && cell.col === store.start.col) {
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(x, y, cellSize, cellSize)
    return
  }

  // 终点（红色）
  if (store.end && cell.row === store.end.row && cell.col === store.end.col) {
    ctx.fillStyle = '#F44336'
    ctx.fillRect(x, y, cellSize, cellSize)
    return
  }

  // 其余路径（白色）
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x, y, cellSize, cellSize)
}

// 基础渲染迷宫（无动画）
const renderMaze = () => {
  if (!ctx || !store.grid) return

  const { grid, cellSize } = store
  const offsetX = (canvasWidth.value - grid[0].length * cellSize) / 2
  const offsetY = (canvasHeight.value - grid.length * cellSize) / 2

  // 清空画布
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  // 遍历所有格子绘制
  grid.forEach((row) => {
    row.forEach((cell) => {
      const x = offsetX + cell.col * cellSize
      const y = offsetY + cell.row * cellSize
      drawCell(cell, x, y, cellSize)
    })
  })
}

// 动画渲染迷宫求解过程
const animateSolution = async () => {
  if (!ctx || !store.grid || !store.solveSteps.length) return

  const { grid, cellSize, solveSteps, animationSpeed } = store
  const offsetX = (canvasWidth.value - grid[0].length * cellSize) / 2
  const offsetY = (canvasHeight.value - grid.length * cellSize) / 2

  // 逐步骤动画
  for (let i = 0; i < solveSteps.length; i++) {
    const step = solveSteps[i]

    // 清空画布
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

    // 1. 绘制基础迷宫（墙和路径）
    grid.forEach((row) => {
      row.forEach((cell) => {
        const x = offsetX + cell.col * cellSize
        const y = offsetY + cell.row * cellSize
        drawCell(cell, x, y, cellSize)
      })
    })

    // 2. 绘制已访问格子（浅蓝色 - 表示被探索过的点）
    if (step.visited) {
      step.visited.forEach((visitedCell) => {
        // 跳过起点和终点
        if (
          (store.start && visitedCell.row === store.start.row && visitedCell.col === store.start.col) ||
          (store.end && visitedCell.row === store.end.row && visitedCell.col === store.end.col)
        ) {
          return
        }
        
        const x = offsetX + visitedCell.col * cellSize
        const y = offsetY + visitedCell.row * cellSize
        ctx.fillStyle = '#1E90FF' // 浅蓝色
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2) // 留1px边距
      })
    }

    // 3. 绘制当前探索位置（深蓝色）
    if (step.current) {
      // 跳过起点和终点
      if (
        !(store.start && step.current.row === store.start.row && step.current.col === store.start.col) &&
        !(store.end && step.current.row === store.end.row && step.current.col === store.end.col)
      ) {
        const x = offsetX + step.current.col * cellSize
        const y = offsetY + step.current.row * cellSize
        ctx.fillStyle = '#2196F3' // 深蓝色
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
      }
    }

    // 4. 最后一步绘制最短路径（橙色）
    if (i === solveSteps.length - 1 && store.shortestPath.length > 0) {
      store.shortestPath.forEach((pathCell) => {
        // 跳过起点和终点
        if (
          (store.start && pathCell.row === store.start.row && pathCell.col === store.start.col) ||
          (store.end && pathCell.row === store.end.row && pathCell.col === store.end.col)
        ) {
          return
        }
        
        const x = offsetX + pathCell.col * cellSize
        const y = offsetY + pathCell.row * cellSize
        ctx.fillStyle = '#FF9800' // 橙色
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
      })
    }

    // 控制动画速度
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))
  }
}

// 渲染最终解决方案（包含所有探索过的点和最短路径）
const renderSolution = () => {
  if (!ctx || !store.grid) return

  const { grid, cellSize } = store
  const offsetX = (canvasWidth.value - grid[0].length * cellSize) / 2
  const offsetY = (canvasHeight.value - grid.length * cellSize) / 2

  // 清空画布
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  // 1. 绘制基础迷宫
  grid.forEach((row) => {
    row.forEach((cell) => {
      const x = offsetX + cell.col * cellSize
      const y = offsetY + cell.row * cellSize
      drawCell(cell, x, y, cellSize)
    })
  })

  // 2. 收集所有被访问过的格子（如果有求解步骤）
  const allVisited = new Set()
  
  if (store.solveSteps.length > 0) {
    // 从所有步骤中收集访问过的格子
    store.solveSteps.forEach(step => {
      if (step.visited) {
        step.visited.forEach(cell => {
          const key = `${cell.row},${cell.col}`
          allVisited.add(key)
        })
      }
    })
    
    // 绘制所有访问过的格子
    allVisited.forEach(key => {
      const [row, col] = key.split(',').map(Number)
      
      // 跳过起点和终点
      if (
        (store.start && row === store.start.row && col === store.start.col) ||
        (store.end && row === store.end.row && col === store.end.col)
      ) {
        return
      }
      
      const x = offsetX + col * cellSize
      const y = offsetY + row * cellSize
      ctx.fillStyle = '#1E90FF' 
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
    })
  }

  // 3. 绘制最短路径（橙色）
  if (store.shortestPath.length > 0) {
    store.shortestPath.forEach((pathCell) => {
      // 跳过起点和终点
      if (
        (store.start && pathCell.row === store.start.row && pathCell.col === store.start.col) ||
        (store.end && pathCell.row === store.end.row && pathCell.col === store.end.col)
      ) {
        return
      }
      
      const x = offsetX + pathCell.col * cellSize
      const y = offsetY + pathCell.row * cellSize
      ctx.fillStyle = '#FF9800' // 橙色
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
    })
  }
}

// 处理画布点击
const handleCanvasClick = (event) => {
  if (!ctx || !store.grid) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const { cellSize, width, height } = store
  const offsetX = (canvasWidth.value - width * cellSize) / 2
  const offsetY = (canvasHeight.value - height * cellSize) / 2

  // 计算点击的格子坐标
  const col = Math.floor((x - offsetX) / cellSize)
  const row = Math.floor((y - offsetY) / cellSize)

  // 检查有效性并更新起点/终点
  if (row >= 0 && row < height && col >= 0 && col < width && !store.grid[row][col].isWall) {
    if (store.selectMode === 'start') {
      store.start = { row, col }
    } else if (store.selectMode === 'end') {
      store.end = { row, col }
    }
    store.setSelectionMode(null)
    // 重新渲染
    if (store.shortestPath.length > 0) {
      renderSolution()
    } else {
      renderMaze()
    }
  }
}

// 监听迷宫数据变化
watch(
  () => store.grid,
  () => {
    if (store.grid) {
      calculateCellSize()
      if (store.isAnimate && store.solveSteps.length > 0) {
        animateSolution()
      } else if (store.shortestPath.length > 0) {
        renderSolution()
      } else {
        renderMaze()
      }
    }
  },
  { deep: true }
)

// 监听求解步骤变化（用于动画）
watch(
  () => store.solveSteps,
  () => {
    if (store.solveSteps.length > 0 && store.isAnimate) {
      animateSolution()
    }
  },
  { deep: true }
)

// 监听最短路径变化
watch(
  () => store.shortestPath,
  () => {
    if (store.shortestPath.length > 0 && !store.isAnimate) {
      renderSolution()
    }
  },
  { deep: true }
)

// 监听窗口大小变化
const handleResize = () => {
  initCanvas()
  // 重新渲染当前状态
  if (store.solveSteps.length > 0 && store.isAnimate) {
    animateSolution()
  } else if (store.shortestPath.length > 0) {
    renderSolution()
  } else {
    renderMaze()
  }
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.maze-canvas {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.maze-canvas-element {
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 4px;
  background: #f5f5f5;
  display: block; /* 确保canvas是块级元素 */
}
</style>