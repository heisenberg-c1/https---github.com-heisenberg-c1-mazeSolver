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

const drawCell = (cell, x, y, cellSize) => {
  // 墙（黑色）
  if (cell.isWall) {
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, cellSize, cellSize)
    return
  }

  // 起点（绿色）
  if (cell.row === store.start.row && cell.col === store.start.col) {
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(x, y, cellSize, cellSize)
    return
  }

  // 终点（红色）
  if (cell.row === store.end.row && cell.col === store.end.col) {
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

// 动画渲染迷宫（基于isWall）
const animateMaze = async () => {
  if (!ctx || !store.grid || !store.solveSteps.length) return

  const { grid, cellSize, solveSteps, animationSpeed } = store
  const offsetX = (canvasWidth.value - grid[0].length * cellSize) / 2
  const offsetY = (canvasHeight.value - grid.length * cellSize) / 2

  // 逐步骤动画
  for (let i = 0; i < solveSteps.length; i++) {
    const step = solveSteps[i]

    // 1. 绘制基础迷宫（墙和路径）
    grid.forEach((row) => {
      row.forEach((cell) => {
        const x = offsetX + cell.col * cellSize
        const y = offsetY + cell.row * cellSize
        drawCell(cell, x, y, cellSize)
      })
    })

    // 2. 绘制已访问格子（淡蓝色）
    step.visited.forEach((visitedCell) => {
      const x = offsetX + visitedCell.col * cellSize
      const y = offsetY + visitedCell.row * cellSize
      ctx.fillStyle = '#E3F2FD'
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2) // 留1px边距
    })

    // 3. 绘制当前探索位置（蓝色）
    if (step.current) {
      const x = offsetX + step.current.col * cellSize
      const y = offsetY + step.current.row * cellSize
      ctx.fillStyle = '#2196F3'
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
    }

    // 4. 最后一步绘制最短路径（橙色）
    if (i === solveSteps.length - 1 && store.shortestPath.length > 0) {
      store.shortestPath.forEach((pathCell) => {
        const x = offsetX + pathCell.col * cellSize
        const y = offsetY + pathCell.row * cellSize
        ctx.fillStyle = '#FF9800'
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
      })
    }

    // 控制动画速度
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))
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
  if (row >= 0 && row < height && col >= 0 && col < width) {
    if (store.selectMode === 'start') {
      store.start = { row, col }
    } else if (store.selectMode === 'end') {
      store.end = { row, col }
    }
    store.setSelectionMode(null)
    // 重新渲染
    store.isAnimate ? animateMaze() : renderMaze()
  }
}

// 监听迷宫数据变化
watch(
  () => store.grid,
  () => {
    if (store.grid) {
      calculateCellSize()
      store.isAnimate ? animateMaze() : renderMaze()
    }
  },
  { deep: true },
)

// 监听窗口大小变化
const handleResize = () => initCanvas()

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
