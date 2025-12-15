<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()
const form = reactive({
  phoneNumber: '',
  password: '',
})
const submitting = ref(false)

async function submit() {
  if (!form.phoneNumber || !form.password) {
    ElMessage.warning('Please enter phoneNumber and password')
    return
  }
  submitting.value = true
  try {
    await auth.login(form.phoneNumber, form.password)
    ElMessage.success('Logged in')
    router.replace({ name: 'dashboard' })
  } catch (err) {
    console.error(err)
    ElMessage.error('Login failed. Check credentials or endpoint.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login">
    <div class="login__card">
      <h2>Admin Login</h2>
      <el-form label-position="top" @submit.prevent>
        <el-form-item label="phoneNumber">
          <el-input
            v-model="form.phoneNumber"
            autocomplete="phoneNumber"
            placeholder="admin"
          />
        </el-form-item>

        <el-form-item label="Password">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            show-password
            placeholder="••••••"
          />
        </el-form-item>

        <el-button
          type="primary"
          :loading="submitting || auth.loading"
          style="width: 100%"
          @click="submit"
        >
          Sign in
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff, #f5f7fa);
  padding: 16px;
}

.login__card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
}

.login__card h2 {
  margin: 0 0 16px 0;
  font-weight: 700;
  color: #111827;
}
</style>

