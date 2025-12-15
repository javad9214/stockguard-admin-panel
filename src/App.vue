<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Menu as MenuIcon } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const drawerVisible = ref(false)

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

function handleMenuClick() {
  drawerVisible.value = false
}
</script>

<template>
  <div v-if="isLoginPage">
    <router-view />
  </div>
  <el-container v-else class="main-container">
    <!-- Desktop Sidebar -->
    <el-aside class="desktop-aside" width="200px">
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/">Dashboard</el-menu-item>
        <el-menu-item index="/users">Users</el-menu-item>
        <el-menu-item index="/versions">Versions</el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Mobile Drawer -->
    <el-drawer v-model="drawerVisible" direction="ltr" size="70%">
      <el-menu :default-active="$route.path" router @select="handleMenuClick">
        <el-menu-item index="/">Dashboard</el-menu-item>
        <el-menu-item index="/users">Users</el-menu-item>
        <el-menu-item index="/versions">Versions</el-menu-item>
      </el-menu>
    </el-drawer>

    <el-container>
      <el-header class="header">
        <!-- Mobile Menu Button -->
        <el-button 
          class="mobile-menu-btn" 
          :icon="MenuIcon" 
          @click="drawerVisible = true"
        />
        
        <h2 class="header-title">StockGuard Admin</h2>
        <el-button size="small" @click="logout">Logout</el-button>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.main-container {
  min-height: 100vh;
}

.desktop-aside {
  background: #f5f7fa;
  padding: 20px;
}

.header {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.header-title {
  margin: 0;
  font-size: 18px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-menu-btn {
  display: none;
}

.main-content {
  padding: 16px;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .desktop-aside {
    display: none;
  }
  
  .mobile-menu-btn {
    display: inline-flex;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .main-content {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 10px 12px;
  }
  
  .header-title {
    font-size: 14px;
  }
}
</style>
