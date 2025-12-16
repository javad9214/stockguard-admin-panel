<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserService } from '@/api/userService'
import type { AdminUserDTO, UserStatistics } from '@/api/models/user'
import UserDialog from '@/components/UserDialog.vue'
import ResetPasswordDialog from '@/components/ResetPasswordDialog.vue'

const loading = ref(false)
const users = ref<AdminUserDTO[]>([])
const stats = ref<UserStatistics | null>(null)

const page = ref(0)
const size = ref(20)
const total = ref(0)
const search = ref('')
const enabledFilter = ref<boolean | undefined>()
const lockedFilter = ref<boolean | undefined>()

const dialogVisible = ref(false)
const resetPwdVisible = ref(false)
const editData = ref<AdminUserDTO | null>(null)
const resetUserId = ref<number | null>(null)

const isMobile = computed(() => window.innerWidth < 768)

async function loadUsers() {
  loading.value = true
  try {
    const res = await UserService.getAll({
      page: page.value,
      size: size.value,
      search: search.value || undefined,
      enabled: enabledFilter.value,
      locked: lockedFilter.value
    })
    users.value = res.users
    total.value = res.totalElements
  } catch (err: any) {
    ElMessage.error(err.message || 'Failed to load users')
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    stats.value = await UserService.getStatistics()
  } catch (err) {
    console.error('Failed to load stats', err)
  }
}

function openCreate() {
  editData.value = null
  dialogVisible.value = true
}

function openEdit(user: AdminUserDTO) {
  editData.value = user
  dialogVisible.value = true
}

function openResetPassword(user: AdminUserDTO) {
  resetUserId.value = user.id
  resetPwdVisible.value = true
}

async function toggleStatus(user: AdminUserDTO) {
  try {
    await UserService.toggleStatus(user.id)
    ElMessage.success('Status updated')
    loadUsers()
  } catch (err: any) {
    ElMessage.error(err.message || 'Failed')
  }
}

async function unlockUser(user: AdminUserDTO) {
  try {
    await UserService.unlock(user.id)
    ElMessage.success('Account unlocked')
    loadUsers()
  } catch (err: any) {
    ElMessage.error(err.message || 'Failed')
  }
}

async function confirmDelete(user: AdminUserDTO) {
  await ElMessageBox.confirm(`Delete user ${user.fullName}?`, 'Confirm', {
    type: 'warning'
  })
  try {
    await UserService.delete(user.id)
    ElMessage.success('User deleted')
    loadUsers()
  } catch (err: any) {
    ElMessage.error(err.message || 'Failed')
  }
}

function handleSearch() {
  page.value = 0
  loadUsers()
}

function handlePageChange(val: number) {
  page.value = val - 1
  loadUsers()
}

onMounted(() => {
  loadUsers()
  loadStats()
})
</script>

<template>
  <div class="page">
    <!-- Stats Cards -->
    <div v-if="stats" class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-label">Total Users</div>
        <div class="stat-value">{{ stats.totalUsers }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">Active</div>
        <div class="stat-value">{{ stats.activeUsers }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">Locked</div>
        <div class="stat-value">{{ stats.lockedUsers }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">New Today</div>
        <div class="stat-value">{{ stats.newUsersToday }}</div>
      </el-card>
    </div>

    <div class="page__header">
      <h2>Users</h2>
      <el-button type="primary" @click="openCreate">
        <span class="btn-text-full">+ Create User</span>
        <span class="btn-text-short">+</span>
      </el-button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <el-input
        v-model="search"
        placeholder="Search by name or phone"
        clearable
        style="max-width: 300px"
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      />
      <el-select v-model="enabledFilter" placeholder="Status" clearable @change="handleSearch">
        <el-option label="Enabled" :value="true" />
        <el-option label="Disabled" :value="false" />
      </el-select>
      <el-select v-model="lockedFilter" placeholder="Locked" clearable @change="handleSearch">
        <el-option label="Locked" :value="true" />
        <el-option label="Unlocked" :value="false" />
      </el-select>
      <el-button @click="handleSearch">Search</el-button>
    </div>

    <!-- Desktop Table -->
    <el-table :data="users" border class="desktop-table" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="fullName" label="Name" width="150" />
      <el-table-column prop="phoneNumber" label="Phone" width="140" />
      <el-table-column prop="role" label="Role" width="120">
        <template #default="{ row }">
          <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'info'" size="small">
            {{ row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
            {{ row.enabled ? 'Active' : 'Disabled' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Locked" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.accountLocked" type="warning" size="small">Locked</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created" width="180" />
      <el-table-column label="Actions" width="280" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">Edit</el-button>
          <el-button v-if="row.accountLocked" size="small" type="warning" @click="unlockUser(row)">
            Unlock
          </el-button>
          <el-button size="small" @click="openResetPassword(row)">Reset Pwd</el-button>
          <el-button size="small" type="danger" @click="confirmDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Mobile Cards -->
    <div class="mobile-cards" v-loading="loading">
      <el-card v-for="user in users" :key="user.id" class="user-card">
        <div class="card-header">
          <div>
            <h3>{{ user.fullName }}</h3>
            <p class="phone">{{ user.phoneNumber }}</p>
          </div>
          <el-tag :type="user.role === 'ADMIN' ? 'danger' : 'info'" size="small">
            {{ user.role }}
          </el-tag>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span>Status:</span>
            <el-tag :type="user.enabled ? 'success' : 'info'" size="small">
              {{ user.enabled ? 'Active' : 'Disabled' }}
            </el-tag>
          </div>
          <div v-if="user.accountLocked" class="info-row">
            <span>Locked:</span>
            <el-tag type="warning" size="small">Yes</el-tag>
          </div>
        </div>

        <div class="card-actions">
          <el-button size="small" @click="openEdit(user)">Edit</el-button>
          <el-button v-if="user.accountLocked" size="small" type="warning" @click="unlockUser(user)">
            Unlock
          </el-button>
          <el-button size="small" @click="openResetPassword(user)">Reset Pwd</el-button>
          <el-button size="small" type="danger" @click="confirmDelete(user)">Delete</el-button>
        </div>
      </el-card>
    </div>

    <!-- Pagination -->
    <el-pagination
      v-model:current-page="page"
      :page-size="size"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
      style="margin-top: 16px; justify-content: center"
    />
  </div>

  <UserDialog
    :visible="dialogVisible"
    :editData="editData"
    @close="dialogVisible = false"
    @saved="() => { dialogVisible = false; loadUsers(); loadStats() }"
  />

  <ResetPasswordDialog
    :visible="resetPwdVisible"
    :userId="resetUserId"
    @close="resetPwdVisible = false"
  />
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.mobile-cards {
  display: none;
}

.btn-text-short {
  display: none;
}

.phone {
  margin: 4px 0 0 0;
  color: #666;
  font-size: 13px;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .user-card {
    margin-bottom: 12px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .card-header h3 {
    margin: 0;
    font-size: 16px;
  }

  .card-body {
    margin-bottom: 12px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
  }

  .card-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .card-actions .el-button {
    flex: 1;
    min-width: 80px;
  }

  .btn-text-full {
    display: none;
  }

  .btn-text-short {
    display: inline;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>