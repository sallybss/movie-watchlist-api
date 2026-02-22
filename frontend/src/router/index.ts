import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

import Home from "../pages/Home.vue"
import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"
import Watchlist from "../pages/Watchlist.vue"
import { hasValidToken } from "../services/api"

const routes: RouteRecordRaw[] = [
  { path: "/", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/watchlist", name: "watchlist", component: Watchlist, meta: { requiresAuth: true } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !hasValidToken()) return { name: "login" }
})

export default router
