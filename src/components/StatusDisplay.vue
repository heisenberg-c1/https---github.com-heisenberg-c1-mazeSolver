<script setup>
import { useMazeStore } from '@/stores/MazeStore';
import { storeToRefs } from 'pinia'
const mazeStore = useMazeStore();



//TODO::时间复杂度动态计算



const {visitedCells, totalEmptyCells, timeTaken, shortestPath, timeComplexity} = storeToRefs(mazeStore)


</script>




<template>
  <div class="status-item visited-item">
    <span class="status-label">Visited:</span>
    <span class="status-value">{{ visitedCells }} / {{ totalEmptyCells }}</span>
  </div>
  <div class="status-item visited-item">
    <span class="status-label">最短路长度:</span>
    <span class="status-value">{{shortestPath.length}}</span>
  </div>
  <!-- 时间复杂度与运行时间分块展示 -->
  <div class="status-row">
    <div class="status-item complexity-item">
      <span class="status-label">求解时间复杂度</span>
      <div class="status-content">
        <span v-html="timeComplexity"></span>
      </div>
    </div>
    <div class="status-item time-item">
      <span class="status-label">寻路时间开销</span>
      <div class="status-content">
        <span>{{ timeTaken.toFixed(4) }} ms</span>
      </div>
    </div>
  </div>

</template>



<style scoped>
/* 整体行容器：控制两列分块 */
.status-row {
  display: flex;
  gap: 15px; /* 两列之间的间距 */
  margin-top: 15px; /* 与上方visited的间距 */
}

/* 每个状态项的基础样式 */
.status-item {
  padding: 12px;
  border-radius: 4px;
  background-color: #f0f2f5;
}

/* Visited项：独占一行，底部加间距 */
.visited-item {
  margin-bottom: 50px; /* 与下方行的间隔 */
}

/* 时间复杂度与时间开销项：各占一半宽度 */
.complexity-item, .time-item {
  flex: 1; /* 平分父容器宽度 */
  text-align: center; /* 内容居中 */
}

/* 标签样式：统一对齐 */
.status-label {
  display: block;
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px; /* 标签与内容的间距 */
}

/* 内容样式：突出显示 */
.status-value, .status-content {
  color: #1989fa; /* 用主题色突出数值 */
  font-size: 16px;
  font-weight: 500;
}

/* LaTeX公式适配（如果使用KaTeX，可能需要调整行高） */
.status-content {
  line-height: 1.5;
}
</style>