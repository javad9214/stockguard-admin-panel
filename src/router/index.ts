import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Versions from '../views/Versions.vue'
import Login from '../views/Login.vue'
import { useAuthStore } from '@/store/auth'

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/users', name: 'users', component: () => import('../views/Users.vue'), meta: { requiresAuth: true } },
  { path: '/versions', name: 'versions', component: Versions, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const hasToken = !!auth.token

  if (to.name === 'login' && hasToken) {
    next({ name: 'dashboard' })
    return
  }

  if (to.meta.requiresAuth && !hasToken) {
    next({ name: 'login' })
    return
  }

  next()
})

export default router