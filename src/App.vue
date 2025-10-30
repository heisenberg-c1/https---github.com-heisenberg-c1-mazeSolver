<script setup>
import {Setting, Grid, InfoFilled} from '@element-plus/icons-vue'; 
import StatusDisplay from './components/StatusDisplay.vue';
import ControlPanel from './components/ControlPanel.vue';
import MazeCanvas from './components/MazeCanvas.vue';


</script>

<template>

  <div class="app-container">

    <!-- 页面标题 -->
    <h1 class="page-title">迷宫生成与求解</h1>
  
    <div class="main-container">
      <!-- 迷宫画布区域 -->
      

    
      <div class="maze-show">
        <div shadow="hover" class="maze-card">
          <div class="card-header">
            <el-icon size="18"><Grid /></el-icon>
            <span class="card-title">迷宫画布</span>
          </div>
          <!-- 画布容器-->
          <div class="canvas-container">
            <!-- 这里将放置Canvas元素 -->
            <MazeCanvas />
          </div>
        </div>
      </div>

      <!-- 控制面板+状态显示区域 -->
      <div class="panel-show">

        <!-- 控制面板卡片 -->
        <div class="control-card">
          <div class="card-header">
            <el-icon size="18"><Setting /></el-icon>
            <span class="card-title">控制面板</span>
          </div>
          <div class="control-content">
            <ControlPanel />
          </div>
        </div>

        <!-- 状态显示卡片 -->
        <div class="status-card">
          <div class="card-header">
            <el-icon size="18"><InfoFilled /></el-icon>
            <span class="card-title">运行状态</span>
          </div>
          <div class="status-content">
            <StatusDisplay />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 外层容器：控制整体留白+居中 */
.app-container {
  width: calc(100vw - 40px); /* 左右各留20px空白 */
  height: calc(100vh - 40px); /* 上下各留20px空白 */
  margin: 20px auto; /* 上下左右居中+留白 */
  padding: 0 10px;
  box-sizing: border-box;
  
}

/* 页面标题 */
.page-title {
  text-align: center;
  color: #1989fa; 
  margin-bottom: 20px;
  font-size: 25px;
  font-weight: 600;
  
}

/* 核心布局容器 */
.main-container {
  display: flex;
  gap: 20px; /* 左右分栏间距 */
  height: calc(100% - 60px); /* 减去标题高度 */
}

/* 迷宫画布区域 */
.maze-show {
  flex: 7; /* 占7份（原70%） */
  padding: 0;
}

.maze-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  color: #409eff;
}

.card-title {
  font-size: 20px;
  font-weight: 500;
}

/* 画布容器（后续嵌入Canvas） */
.canvas-container {
  flex: 1; /* 占满卡片剩余高度 */
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  padding:  0 12%;
}



/* 控制面板+状态显示区域 */
.panel-show {
  flex: 3; /* 占3份（原30%） */
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px; /* 两个卡片间距 */
}

/* 控制面板卡片 */
.control-card {
  flex: 1; /* 占上方50%高度 */
  display: flex;
  flex-direction: column;
}

.control-content {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 16px;
  color: #666;
}

/* 状态显示卡片 */
.status-card {
  flex: 1; /* 占下方50%高度 */
  display: flex;
  flex-direction: column;
}

.status-content {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 16px;
  color: #666;
}

/* 卡片基础样式：边框、圆角、内边距 */
.maze-card, .control-card, .status-card {
  border: 1px solid #ebeef5; /* 浅灰色边框，与 Element Plus 风格一致 */
  border-radius: 4px;       /* 圆角优化 */
  padding: 15px;            /* 卡片内边距，确保内容与边框有间距 */
  box-sizing: border-box;   /* 确保 padding 不撑大卡片 */
  transition: box-shadow 0.2s ease-in-out; /* hover 阴影过渡动画 */
}

/* 卡片 hover 效果：增强阴影 */
.maze-card:hover, .control-card:hover, .status-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /*  hover 时阴影加深 */
}


/* 响应式布局 */
@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }

  .maze-show, .panel-show {
    flex: none;
    height: 50%;
  }

  .panel-show {
    flex-direction: row;
  }

  .control-card, .status-card {
    flex: 1;
    margin-right: 10px;
  }

  .status-card {
    margin-right: 0;
  }
}
</style>