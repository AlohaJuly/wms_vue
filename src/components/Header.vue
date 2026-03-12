<template>
  <div class="header-bar">
    <div class="header-left">
      <el-icon><More /></el-icon>
    </div>

    <div class="header-center">
      <span>欢迎</span>
    </div>

    <div class="header-right">
      <span>Tom</span>
      <el-dropdown>
        <el-icon class="right-icon">
          <Burger />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toUser">个人中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Burger } from '@element-plus/icons-vue'
import { More } from '@element-plus/icons-vue'

const toUser = () => {
  console.log('to user')
  alert('执行查看逻辑')
}
</script>

<style scoped>
.header-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  height: 100%;
}

.header-left {
  justify-self: start;
  font-size: 20px;
  line-height: 10px;
}

.header-center {
  justify-self: center;
  font-size: 25px;
}

.header-right {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 8px;
}

.right-icon {
  margin-top: 2px;
}
</style>
