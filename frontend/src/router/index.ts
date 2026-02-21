// frontend/src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

import Home from "../pages/Home.vue"
import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"

const routes: RouteRecordRaw[] = [
  { path: "/", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * OPTIONAL (later):
 * If you add pages that require login, you can mark them:
 * { path: "/protected", component: X, meta: { requiresAuth: true } }
 *
 * Then enable this guard:
 */
// router.beforeEach((to) => {
//   const token = localStorage.getItem("token")
//   if (to.meta.requiresAuth && !token) return { name: "login" }
// })

export default router