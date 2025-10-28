<script setup>
import { ref } from 'vue'
const width = ref(10)
const height = ref(10)
const isAnimate = ref(false)

const props = {
  expandTrigger: 'hover',
}

const solveOptions = [
  {
    value: 'dfs',
    label: 'DFS',
    children: [
      {
        value: 'dfs-recursive',
        label: '递归实现',
      },
      {
        value: 'dfs-iterative',
        label: '递推实现',
      },
    ],
  },
  {
    value: 'bfs',
    label: 'BFS',
    children: [
      {
        value: 'bfs-recursive',
        label: '递归实现',
      },
      {
        value: 'bfs-iterative',
        label: '递推实现',
      },
    ],
  },
  {
    value: 'aStar',
    label: 'A*',
  },
  {
    value: 'dijkstra',
    label: 'Dijkstra',
  },
]

const generateOptions = [
  {
    value: 'prim',
    label: 'Prim',
  },
  {
    value: 'kruskal',
    label: 'Kruskal',
  },
]

const animationSpeed = ref(50)
</script>
<template>
  <!-- 增加 gutter 控制列间距，margin-bottom 控制行间距 -->
  <el-row :gutter="50" class="control-row">
    <el-col :span="12">
      <div style="display: flex; gap: 10px">
        <span>长：</span>
        <el-input-number
          v-model="height"
          :min="2"
          :max="100"
          controls-position="right"
          style="width: 100%"
        />
      </div>
    </el-col>
    <el-col :span="12">
      <div style="display: flex; gap: 10px">
        <span>宽：</span>
        <el-input-number
          v-model="width"
          :min="2"
          :max="100"
          controls-position="right"
          style="width: 100%"
        />
      </div>
    </el-col>
  </el-row>

  <el-row :gutter="50" class="control-row">
    <el-col :span="12">
      <el-button type="primary" style="width: 100%">选择起点</el-button>
    </el-col>
    <el-col :span="12">
      <el-button type="primary" style="width: 100%">选择终点</el-button>
    </el-col>
  </el-row>

  <el-row :gutter="50" class="control-row">
    <el-col :span="12">
      <div class="label-wrap">
        <span>生成算法:</span>
        <el-cascader
          v-model="value"
          :options="generateOptions"
          :props="props"
          style="width: 100%"
        />
      </div>
    </el-col>
    <el-col :span="12">
      <el-button type="primary" style="width: 100%">生成</el-button>
    </el-col>
  </el-row>

  <el-row :gutter="50" class="control-row">
    <el-col :span="12">
      <div class="label-wrap">
        <span>求解算法:</span>
        <el-cascader v-model="value" :options="solveOptions" :props="props" style="width: 100%" />
      </div>
    </el-col>
    <el-col :span="12">
      <el-button type="primary" style="width: 100%">求解</el-button>
    </el-col>
  </el-row>

  <el-row :gutter="50" class="control-row">
    <el-col :span="24">
      <div class="label-wrap">
        <span>动画效果:</span>
        <el-switch v-model="isAnimate" style="margin-left: 10px" />
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="50" class="control-row" v-if="isAnimate">
    <el-col :span="24">
      <div class="label-wrap">
        <span>动画速度:</span>
        <el-slider v-model="animationSpeed" style="margin-left: 10px"/>
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
/* 标签宽度对齐（可选，如需强制标签宽度一致） */
.label-wrap span {
  min-width: 80px; /* 标签最小宽度，确保对齐 */
  text-align: right;
}
/* 按钮、输入框宽度适配列 */
.el-input-number,
.el-cascader,
.el-button {
  width: 100%;
  box-sizing: border-box;
}
/* 行间距统一控制（也可通过 el-row 的 margin-bottom 实现） */
.control-row {
  margin-bottom: 20px;
}
</style>
