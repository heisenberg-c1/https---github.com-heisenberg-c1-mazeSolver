<script setup>
import { useMazeStore } from '@/stores/MazeStore'
import { storeToRefs } from 'pinia'

const mazeStore = useMazeStore()
const { height, width, isAnimate, animationSpeed, genAlgo, solveAlgo } = storeToRefs(mazeStore)

const props = {
  expandTrigger: 'hover',
  value: 'value',
  label: 'label',
  emitPath: false,
}

// 求解算法
const solveOptions = [
  {
    value: 'dfs',
    label: 'DFS',
    children: [
      { value: 'dfs-recursive', label: '递归实现' },
      { value: 'dfs-iterative', label: '递推实现' },
    ],
  },
  { value: 'bfs', label: 'BFS' },
  { value: 'astar', label: 'A*' },
  { value: 'dijkstra', label: 'Dijkstra' },
]

// 生成算法
const generateOptions = [
  { value: 'prim', label: 'Prim' },
  { value: 'kruskal', label: 'Kruskal' },
]

const handleSelectStart = () => {
  mazeStore.setSelectionMode('start')
}

const handleSelectEnd = () => {
  mazeStore.setSelectionMode('end')
}

const handleGenerate = () => {
  mazeStore.generateMaze()
}

const handleSolve = () => {
  if (!mazeStore.grid) {
    console.log('请先生成迷宫')
    return
  }
  // console.log('开始求解迷宫')
  mazeStore.solveMaze()
}


const handleDimensionChange = (dimension) => {
  if (dimension === 'height') {
    if (height.value % 2 === 0) {
      height.value -= 1;
    }
  } else if (dimension === 'width') {
    if (width.value % 2 === 0) {
      width.value -= 1;
    }
  }
};

</script>

<template>
  <!-- 尺寸设置行 -->
  <el-row :gutter="50" class="control-row">
    <el-col :xs="24" :sm="12" :md="12" :lg="12"> 
      <div style="display: flex; gap: 10px; align-items: center">
        <span>长：</span>
        <el-input-number
          v-model="height"
          :min="2"
          :max="99"
          controls-position="right"
          style="width: 100%"
          :step="2"
          @change="handleDimensionChange('height')"
        />
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12"> 
      <div style="display: flex; gap: 10px; align-items: center">
        <span>宽：</span>
        <el-input-number
          v-model="width"
          :min="2"
          :max="99"
          controls-position="right"
          style="width: 100%"
          :step="2"
          @change="handleDimensionChange('width')"
        />
      </div>
    </el-col>
  </el-row>

  <!-- 选择起点/终点行 -->
  <el-row :gutter="50" class="control-row">
    <el-col :xs="24" :sm="12" :md="12" :lg="12"> 
      <el-button type="primary" style="width: 100%" @click="handleSelectStart">
        选择起点
      </el-button>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12"> 
      <el-button type="primary" style="width: 100%" @click="handleSelectEnd"> 选择终点 </el-button>
    </el-col>
  </el-row>

  <!-- 生成迷宫行 -->
  <el-row :gutter="50" class="control-row">
    <el-col :xs="24" :sm="12" :md="12" :lg="12"> 
      <div class="label-wrap">
        <span>生成算法:</span>
        <el-cascader
          v-model="genAlgo"
          :options="generateOptions"
          :props="props"
          style="width: 100%"
        />
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12"> 
      <el-button type="primary" style="width: 100%" @click="handleGenerate">
        <span>生成</span>
      </el-button>
    </el-col>
  </el-row>

  <!-- 求解迷宫 -->
  <el-row :gutter="50" class="control-row">
    <el-col :xs="24" :sm="12" :md="12" :lg="12"> 
      <div class="label-wrap">
        <span>求解算法:</span>
        <el-cascader
          v-model="solveAlgo"
          :options="solveOptions"
          :props="props"
          style="width: 100%"
        />
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12"> 
      <el-button type="primary" style="width: 100%" @click="handleSolve">
        <span>求解</span>
      </el-button>
    </el-col>
  </el-row>

  <!-- 动画设置行 -->
  <el-row :gutter="50" class="control-row">
    <el-col :xs="24" :sm="12" :md="12" :lg="12"> 
      <div class="label-wrap">
        <span>求解动画效果:</span>
        <el-switch v-model="isAnimate" style="margin-left: 10px" />
      </div>
    </el-col>
  </el-row>

  <!-- 动画速度行（仅动画开启时显示） -->
  <el-row :gutter="50" class="control-row" v-if="isAnimate">
    <el-col :xs="24" :sm="12" :md="12" :lg="24"> 
      <div class="label-wrap">
        <span>动画延迟:</span>
        <el-slider
          v-model="animationSpeed"
          style="margin-left: 10px; flex: 1"
          :min="10"
          :max="300"
          :step="10"
        />
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
/* 标签与组件的同行对齐 */
.label-wrap {
  display: flex;
  align-items: center;
  gap: 10px; /* 标签与组件的间距 */
}
/* 标签宽度对齐，确保所有标签右对齐 */
.label-wrap span {
  min-width: 80px;
  text-align: right;
}
/* 按钮、输入框宽度适配列 */
.el-input-number,
.el-cascader,
.el-button,
.el-slider {
  width: 100%;
  box-sizing: border-box;
}
/* 行间距统一控制 */
.control-row {
  margin-bottom: 20px;
}
</style>
