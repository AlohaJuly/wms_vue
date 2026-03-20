<template>
  <div class="header-bar">
    <div class="header-left" @click="emit('toggle-aside')">
      <el-icon><Menu /></el-icon>
    </div>

    <div class="header-center">
      <span>欢迎</span>
    </div>

    <div class="header-right">
      <span style="font-size: 1.3em;">{{ displayName }}</span>
      <el-dropdown>
        <el-icon class="right-icon">
          <Burger />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toUser">个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Burger } from '@element-plus/icons-vue'
import { Menu } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  (e: 'toggle-aside'): void
}>()

const router = useRouter()
const displayName = ref('未登录')

const parseDisplayName = () => {
  const raw = localStorage.getItem('user')
  if (!raw) {
    displayName.value = '未登录'
    return
  }

  try {
    const user = JSON.parse(raw)
    displayName.value =
      user?.name ||
      user?.realName ||
      user?.username ||
      user?.userName ||
      user?.num ||
      user?.account ||
      '未命名用户'
  } catch {
    displayName.value = '未命名用户'
  }
}

parseDisplayName()

const toUser = () => {
  console.log('to user')
  alert('执行查看逻辑')
}

const logout = async () => {
  try {
    await ElMessageBox.confirm('确认退出当前账号吗？', '退出登录', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  localStorage.removeItem('user')
  ElMessage.success('已退出登录')
  await router.replace('/login')
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
  cursor: pointer;
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