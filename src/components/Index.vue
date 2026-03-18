<template>
  <el-container class="layout-container-demo" style="margin-left: 0px;">
    <el-aside :width="isCollapse ? '64px' : '200px'" style="height: 100%;">
      <el-scrollbar>
       <Aside :isCollapse="isCollapse" />
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="font-size: 12px;">
          <Header @toggle-aside="toggleAside" />
      </el-header>

      <el-main>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Aside from './Aside.vue'
import Header from './Header.vue'
import Main from './Main.vue'

const isCollapse = ref(false)

const toggleAside = () => {
  isCollapse.value = !isCollapse.value
}

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

.layout-container-demo {
  width: 100%;
  height: 100vh;
}

.layout-container-demo > .el-container {
  min-width: 0;
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  margin: 0px;
  padding: 0px;
  min-width: 0;
}
</style>
