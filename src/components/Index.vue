<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside width="" style="height: 100%">
      <el-scrollbar>
       <Aside />
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <Header />
          <span>Tom</span>
        </div>
      </el-header>

      <el-main>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Aside from './Aside.vue'
import Header from './Header.vue'
import Main from './Main.vue'

defineOptions({
  name: 'Index',
})

</script>

<style scoped>
.layout-container-demo .el-header {
  margin: 20px;
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  margin: 20px;
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  margin: 10px;
  padding: 10px;

}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
