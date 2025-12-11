<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import VersionDialog from '@/components/VersionDialog.vue'
import { VersionService } from '@/api/versionService'
import type { AppVersionResponse } from '@/api/models/version'

const loading = ref(false)
const versions = ref<AppVersionResponse[]>([])

const dialogVisible = ref(false)
const editData = ref<AppVersionResponse | null>(null)

async function loadVersions() {
  loading.value = true
  try {
    versions.value = await VersionService.getAll()
  } catch (err) {
    console.error(err)
    ElMessage.error('Failed to load versions')
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  editData.value = null
  dialogVisible.value = true
}

function openEditDialog(item: AppVersionResponse) {
  editData.value = item
  dialogVisible.value = true
}

async function confirmDelete(item: AppVersionResponse) {
  await ElMessageBox.confirm(
    `Delete ${item.platform} version?`,
    'Confirm',
    { type: 'warning' }
  )

  try {
    await VersionService.delete(item.platform)
    ElMessage.success('Deleted')
    loadVersions()
  } catch (err) {
    console.error(err)
    ElMessage.error('Delete failed')
  }
}

onMounted(() => {
  loadVersions()
})
</script>

<template>
  <div class="page">
    <div class="page__header">
      <h2>App Versions</h2>

      <el-button type="primary" @click="openCreateDialog">
        + Create Version
      </el-button>
    </div>

    <el-table
      :data="versions"
      border
      style="width:100%"
      v-loading="loading"
    >
      <el-table-column prop="platform" label="Platform" width="120" />
      <el-table-column prop="minVersionName" label="Min Version" width="140" />
      <el-table-column prop="lastVersionName" label="Last Version" width="140" />
      <el-table-column prop="updateUrl" label="Update URL" />
      <el-table-column prop="enabled" label="Enabled" width="120">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'">
            {{ row.enabled ? 'Yes' : 'No' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created At" width="180" />

      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">Edit</el-button>

          <el-button
            size="small"
            type="danger"
            @click="confirmDelete(row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <VersionDialog
    :visible="dialogVisible"
    :editData="editData"
    @close="dialogVisible = false"
    @saved="() => { dialogVisible = false; loadVersions() }"
  />
</template>