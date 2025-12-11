<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { ElMessageBox, ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isLoginPage = computed(() => route.name === 'login')

async function logout() {
  const confirmed = await ElMessageBox.confirm('Sign out?', 'Confirm', {
    type: 'warning',
  }).catch(() => false)
  if (!confirmed) return
  auth.logout()
  ElMessage.success('Signed out')
  router.replace({ name: 'login' })
}
</script>

<template>
  <div v-if="isLoginPage">
    <router-view />
  </div>
  <el-container v-else style="min-height: 100vh;">
    <el-aside width="200px" style="background: #f5f7fa; padding: 20px;">
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/">Dashboard</el-menu-item>
        <el-menu-item index="/versions">Versions</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="background: #fff; border-bottom: 1px solid #eee; padding: 12px 20px; display:flex; align-items:center; justify-content:space-between;">
        <h2 style="margin:0;">StockGuard Admin Panel</h2>
        <el-button size="small" @click="logout">Logout</el-button>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
