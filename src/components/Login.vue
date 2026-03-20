<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title">仓库管理系统</h2>
      <p class="subtitle">请输入账号和密码登录</p>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="账号" prop="num">
          <el-input v-model="form.num" placeholder="请输入账号" clearable />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>

        <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

interface LoginForm {
  num: string
  password: string
}

interface ApiResult {
  code?: number | string
  msg?: string
  data?: Record<string, unknown> | null
  success?: boolean
}

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive<LoginForm>({
  num: '',
  password: '',
})

const rules: FormRules<LoginForm> = {
  num: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const isLoginSuccess = (resp: ApiResult | undefined): boolean => {
  if (!resp) return false
  if (resp.code === 200 || resp.code === '200') return true
  if (resp.code === 1 || resp.code === '1') return true
  if (resp.success === true) return true
  return false
}

const buildLoginFailMessage = (resp: ApiResult | undefined): string => {
  const code = String(resp?.code ?? '')
  const msg = String(resp?.msg ?? '').trim()

  if (code === '400' || msg === '操作失败') {
    return '账号或密码错误，请重新输入'
  }

  if (!msg) {
    return '登录失败，请稍后重试'
  }

  return `登录失败：${msg}`
}

const handleLogin = async () => {
  if (!formRef.value || loading.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    const { data } = await axios.post<ApiResult>('http://localhost:8090/user/login', {
      num: form.num.trim(),
      password: form.password.trim(),
    })

    if (isLoginSuccess(data)) {
      const userInfo = data?.data && typeof data.data === 'object' ? data.data : {}
      localStorage.setItem('user', JSON.stringify(userInfo))
      ElMessage.success('登录成功')
      await router.push('/index')
      return
    }

    ElMessage.error(buildLoginFailMessage(data))
  } catch (error) {
    console.error('登录请求失败:', error)
    ElMessage.error('无法连接后端服务，请检查服务是否启动')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f2f6ff 0%, #d9e8ff 100%);
}

.login-card {
  width: 420px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(31, 56, 88, 0.16);
  padding: 28px 24px 22px;
}

.title {
  text-align: center;
  color: #1f2d3d;
  font-size: 24px;
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: #7f8ea3;
  font-size: 14px;
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  margin-top: 6px;
}
</style>
