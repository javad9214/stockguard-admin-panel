// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Versions from '../views/Versions.vue'

const routes = [
  { path: '/', name: 'dashboard', component: Dashboard },
  { path: '/versions', name: 'versions', component: Versions }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
