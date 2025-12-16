<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UserService } from '@/api/userService'

const props = defineProps<{
  visible: boolean
  userId: number | null
}>()

const emit = defineEmits(['close'])

const loading = ref(false)
const newPassword = ref('')

watch(() => props.visible, (val) => {
  if (val) {
    newPassword.value = ''
  }
})

async function save() {
  if (!newPassword.value) {
    ElMessage.warning('Enter new password')
    return
  }
  if (!props.userId) return

  loading.value = true
  try {
    await UserService.resetPassword(props.userId, {
      newPassword: newPassword.value
    })
    ElMessage.success('Password reset successfully')
    emit('close')
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
    width="400px"
    title="Reset Password"
  >
    <el-form label-width="120px">
      <el-form-item label="New Password">
        <el-input
          v-model="newPassword"
          type="password"
          show-password
          placeholder="Enter new password"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('close')">Cancel</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        Reset
      </el-button>
    </template>
  </el-dialog>
</template>