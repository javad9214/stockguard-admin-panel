import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthService } from '@/api/authService'

const TOKEN_KEY = 'admin_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const loading = ref(false)

  async function login(username: string, password: string) {
    loading.value = true
    try {
      const tok = await AuthService.login({ username, password })
      token.value = tok
      localStorage.setItem(TOKEN_KEY, tok)
      return tok
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return { token, loading, login, logout }
})

