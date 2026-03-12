<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside width="" style="height: 100%">
      <el-scrollbar>
       <Aside />
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="font-size: 12px;">
          <Header />
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
  display: flex;
  margin: 2px;
  color: var(--el-text-color-primary);
  border-bottom:rgb(139, 135, 135) 1px solid;
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
  margin: 0px;
  padding: 0px;
}
</style>
