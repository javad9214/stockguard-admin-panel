<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UserService } from '@/api/userService'
import type { AdminUserDTO, CreateUserRequest, UpdateUserRequest } from '@/api/models/user'

const props = defineProps<{
  visible: boolean
  editData?: AdminUserDTO | null
}>()

const emit = defineEmits(['close', 'saved'])

const loading = ref(false)
const isEdit = computed(() => !!props.editData)
const isMobile = computed(() => window.innerWidth < 768)

const form = reactive<CreateUserRequest & UpdateUserRequest>({
  phoneNumber: '',
  password: '',
  fullName: '',
  role: 'USER',
  enabled: true
})

function resetForm() {
  Object.assign(form, {
    phoneNumber: '',
    password: '',
    fullName: '',
    role: 'USER',
    enabled: true
  })
}

function applyEditData(data: AdminUserDTO) {
  Object.assign(form, {
    fullName: data.fullName,
    role: data.role,
    enabled: data.enabled
  })
}

watch(
  () => props.editData,
  (val) => {
    if (val) {
      applyEditData(val)
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

async function save() {
  if (!isEdit.value && !form.password) {
    ElMessage.warning('Password is required')
    return
  }

  loading.value = true
  try {
    if (isEdit.value && props.editData) {
      await UserService.update(props.editData.id, {
        fullName: form.fullName,
        role: form.role,
        enabled: form.enabled
      })
      ElMessage.success('User updated')
    } else {
      await UserService.create(form as CreateUserRequest)
      ElMessage.success('User created')
    }
    emit('saved')
  } catch (err: any) {
    ElMessage.error(err.message || 'Failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    @close="emit('close')"
    :width="isMobile ? '95%' : '500px'"
    :fullscreen="isMobile"
  >
    <template #header>
      <h3>{{ isEdit ? 'Edit User' : 'Create User' }}</h3>
    </template>

    <el-form :label-width="isMobile ? '100px' : '120px'" label-position="left">
      <el-form-item label="Phone" v-if="!isEdit">
        <el-input v-model="form.phoneNumber" placeholder="+1234567890" />
      </el-form-item>

      <el-form-item label="Password" v-if="!isEdit">
        <el-input v-model="form.password" type="password" />
      </el-form-item>

      <el-form-item label="Full Name">
        <el-input v-model="form.fullName" />
      </el-form-item>

      <el-form-item label="Role">
        <el-select v-model="form.role">
          <el-option label="User" value="USER" />
          <el-option label="Admin" value="ADMIN" />
          <el-option label="Premium User" value="PREMIUM_USER" />
        </el-select>
      </el-form-item>

      <el-form-item label="Enabled">
        <el-switch v-model="form.enabled" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="emit('close')">Cancel</el-button>
        <el-button type="primary" :loading="loading" @click="save">
          Save
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .dialog-footer {
    flex-direction: column-reverse;
  }

  .dialog-footer .el-button {
    width: 100%;
  }
}
</style>