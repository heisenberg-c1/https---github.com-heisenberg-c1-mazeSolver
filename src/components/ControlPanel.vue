<script setup>
import { onMounted } from 'vue'
import { useMazeStore } from '@/stores/MazeStore';
import { storeToRefs } from 'pinia'

const mazeStore = useMazeStore();
// 解构响应式状态（storeToRefs 保持响应式）
const {
  height, width, isAnimate, animationSpeed, genAlgo, solveAlgo,
  isGenerating, isSolving // 新增：用于控制按钮禁用
} = storeToRefs(mazeStore);

// 级联选择器配置
const props = {
  expandTrigger: 'hover',
  value: 'value', // 补充：指定选项值的字段（避免绑定异常）
  label: 'label'  // 补充：指定选项文本的字段
};

// 求解算法选项（保持不变）
const solveOptions = [
  { value: 'DFS', label: 'DFS', children: [{ value: 'dfs-recursive', label: '递归实现' }, { value: 'dfs-iterative', label: '递推实现' }] },
  { value: 'BFS', label: 'BFS', children: [{ value: 'bfs-recursive', label: '递归实现' }, { value: 'bfs-iterative', label: '递推实现' }] },
  { value: 'AStar', label: 'A*' },
  { value: 'Dijkstra', label: 'Dijkstra' }
];

// 生成算法选项（保持不变）
const generateOptions = [
  { value: 'Prim', label: 'Prim' },
  { value: 'Kruskal', label: 'Kruskal' }
];

// 选择起点：调用 Pinia 方法设置选择模式
const handleSelectStart = () => {
  mazeStore.setSelectionMode('start');
  // 可选：添加提示（如“请点击画布选择起点”）
  console.log('请点击迷宫画布选择起点');
};

// 选择终点：调用 Pinia 方法设置选择模式
const handleSelectEnd = () => {
  mazeStore.setSelectionMode('end');
  console.log('请点击迷宫画布选择终点');
};

// 生成迷宫：调用 Pinia 的 generateMaze Action（核心）
const handleGenerate = () => {
  mazeStore.generateMaze(); // 触发生成逻辑，更新 grid/start/end 状态
};

// 求解迷宫：预留方法（后续实现 solveMaze Action 后启用）
const handleSolve = () => {
  if (!mazeStore.grid) {
    console.log('请先生成迷宫');
    return;
  }
  mazeStore.solveMaze(); // 后续补充求解 Action 后生效
};

onMounted(() => {
  console.log("MazeStore", mazeStore);
});
</script>

<template>
  <!-- 尺寸设置行 -->
  <el-row :gutter="50" class="control-row">
    <el-col :span="12">
      <div style="display: flex; gap: 10px; align-items: center;">
        <span>长：</span>
        <el-input-number
          v-model="height"
          :min="2"
          :max="100"
          controls-position="right"
          style="width: 100%"
          :disabled="isGenerating || isSolving" 
        />
      </div>
    </el-col>
    <el-col :span="12">
      <div style="display: flex; gap: 10px; align-items: center;">
        <span>宽：</span>
        <el-input-number
          v-model="width"
          :min="2"
          :max="100"
          controls-position="right"
          style="width: 100%"
          :disabled="isGenerating || isSolving" 
        />
      </div>
    </el-col>
  </el-row>

  <!-- 选择起点/终点行 -->
  <el-row :gutter="50" class="control-row">
    <el-col :span="12">
      <el-button 
        type="primary" 
        style="width: 100%"
        @click="handleSelectStart"
        :disabled="isGenerating || isSolving" 
      >
        选择起点
      </el-button>
    </el-col>
    <el-col :span="12">
      <el-button 
        type="primary" 
        style="width: 100%"
        @click="handleSelectEnd"
        :disabled="isGenerating || isSolving" 
      >
        选择终点
      </el-button>
    </el-col>
  </el-row>

  <!-- 生成迷宫行 -->
  <el-row :gutter="50" class="control-row">
    <el-col :span="12">
      <div class="label-wrap">
        <span>生成算法:</span>
        <el-cascader
          v-model="genAlgo"
          :options="generateOptions"
          :props="props"
          style="width: 100%"
          :disabled="isGenerating || isSolving" 
        />
      </div>
    </el-col>
    <el-col :span="12">
      <el-button 
        type="primary" 
        style="width: 100%"
        @click="handleGenerate"
        :disabled="isGenerating || isSolving" 
      >
        <span v-if="!isGenerating">生成</span>
        <span v-if="isGenerating">生成中...</span> 
      </el-button>
    </el-col>
  </el-row>

  <!-- 求解迷宫行（预留） -->
  <el-row :gutter="50" class="control-row">
    <el-col :span="12">
      <div class="label-wrap">
        <span>求解算法:</span>
        <el-cascader 
          v-model="solveAlgo" 
          :options="solveOptions" 
          :props="props" 
          style="width: 100%"
          :disabled="!mazeStore.grid || isGenerating || isSolving" 
        />
      </div>
    </el-col>
    <el-col :span="12">
      <el-button 
        type="primary" 
        style="width: 100%"
        @click="handleSolve"
        :disabled="!mazeStore.grid || isGenerating || isSolving" 
      >
        <span v-if="!isSolving">求解</span>
        <span v-if="isSolving">求解中...</span>
      </el-button>
    </el-col>
  </el-row>

  <!-- 动画设置行 -->
  <el-row :gutter="50" class="control-row">
    <el-col :span="24">
      <div class="label-wrap">
        <span>动画效果:</span>
        <el-switch 
          v-model="isAnimate" 
          style="margin-left: 10px"
          :disabled="isGenerating || isSolving" 
        />
      </div>
    </el-col>
  </el-row>

  <!-- 动画速度行（仅动画开启时显示） -->
  <el-row :gutter="50" class="control-row" v-if="isAnimate">
    <el-col :span="24">
      <div class="label-wrap">
        <span>动画速度:</span>
        <el-slider 
          v-model="animationSpeed" 
          style="margin-left: 10px; flex: 1" 
          :min="10" 
          :max="300" 
          :step="10"
          :disabled="isGenerating || isSolving" 
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