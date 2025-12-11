<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { AppVersionRequest, AppVersionResponse } from '@/api/models/version'
import { VersionService } from '@/api/versionService'
    
const props = defineProps<{
  visible: boolean
  editData?: AppVersionResponse | null
}>()
    
const emit = defineEmits(['close', 'saved'])
    
const loading = ref(false)
    
const form = reactive<AppVersionRequest>({
  platform: 'ANDROID',
  minVersionCode: 1,
  lastVersionCode: 1,
  minVersionName: '',
  lastVersionName: '',
  updateUrl: '',
  releaseNotes: '',
  enabled: true,
})
    
function resetForm() {
  Object.assign(form, {
    platform: 'ANDROID',
    minVersionCode: 1,
    lastVersionCode: 1,
    minVersionName: '',
    lastVersionName: '',
    updateUrl: '',
    releaseNotes: '',
    enabled: true,
  })
}

function applyEditData(data: AppVersionResponse) {
  Object.assign(form, {
    platform: data.platform,
    minVersionCode: data.minVersionCode,
    lastVersionCode: data.lastVersionCode,
    minVersionName: data.minVersionName,
    lastVersionName: data.lastVersionName,
    updateUrl: data.updateUrl,
    releaseNotes: data.releaseNotes || '',
    enabled: data.enabled,
  })
}

// Watch for edit mode
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
  loading.value = true
  try {
    if (props.editData) {
      await VersionService.update(props.editData.platform, form)
      ElMessage.success('Version updated')
    } else {
      await VersionService.create(form)
      ElMessage.success('Version created')
    }
    
    emit('saved')
  } catch (err) {
    console.error(err)
    ElMessage.error('Save failed')
  } finally {
    loading.value = false
  }
}
    </script>
    
    <template>
      <el-dialog 
        :model-value="visible" 
        @close="emit('close')" 
        width="600px"
        top="10vh"
      >
        <template #header>
          <h3>{{ props.editData ? "Edit Version" : "Create Version" }}</h3>
        </template>
    
        <el-form label-width="150px">
    
          <el-form-item label="Platform">
            <el-select v-model="form.platform" placeholder="Select" :disabled="!!props.editData">
              <el-option label="Android" value="ANDROID" />
              <el-option label="iOS" value="IOS" />
            </el-select>
          </el-form-item>
    
          <el-form-item label="Min Version Code">
            <el-input-number v-model="form.minVersionCode" />
          </el-form-item>
    
          <el-form-item label="Last Version Code">
            <el-input-number v-model="form.lastVersionCode" />
          </el-form-item>
    
          <el-form-item label="Min Version Name">
            <el-input v-model="form.minVersionName" />
          </el-form-item>
    
          <el-form-item label="Last Version Name">
            <el-input v-model="form.lastVersionName" />
          </el-form-item>
    
          <el-form-item label="Update URL">
            <el-input v-model="form.updateUrl" placeholder="https://example.com/app.apk" />
          </el-form-item>
    
          <el-form-item label="Release Notes">
            <el-input type="textarea" v-model="form.releaseNotes" />
          </el-form-item>
    
          <el-form-item label="Enabled">
            <el-switch v-model="form.enabled" />
          </el-form-item>
    
        </el-form>
    
        <template #footer>
          <el-button @click="emit('close')">Cancel</el-button>
          <el-button 
            type="primary" 
            :loading="loading"
            @click="save"
          >
            Save
          </el-button>
        </template>
      </el-dialog>
    </template>
    