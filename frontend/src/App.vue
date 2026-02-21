<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import Navbar from "./components/Navbar.vue"
import { useToast } from "./composables/useToast"

const route = useRoute()
const isAuthRoute = computed(() => route.path === "/login" || route.path === "/register")
const { visible, message, type } = useToast()
</script>

<template>
  <div class="app" :class="{ authMode: isAuthRoute }">
    <Navbar />

    <main class="main">
      <router-view />
    </main>

    <transition name="toast-fade">
      <div v-if="visible" class="toast" :class="`toast--${type}`">
        {{ message }}
      </div>
    </transition>

    <footer class="footer">
      <div class="footer__inner">
        <span>© {{ new Date().getFullYear() }} Watchlist</span>
        <span class="dot">•</span>
        <span>Movie Watchlist API + Vue</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  background: radial-gradient(1200px 700px at 20% 5%, #1b2a57 0%, #0a1224 55%, #050914 100%);
  color: #fff;
}

.app.authMode {
  background: #050914;
}

.app.authMode::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(180deg, rgba(3, 8, 23, 0.64), rgba(3, 8, 23, 0.78)),
    url("https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.app > * {
  position: relative;
  z-index: 1;
}

.main {
  width: 100%;
  margin: 0;
  padding: 26px 32px 60px;
  box-sizing: border-box;
}

.footer {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 16px 0;
  color: rgba(255,255,255,0.7);
}

.toast {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 30;
  max-width: min(360px, calc(100vw - 28px));
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  color: #fff;
  border: 1px solid transparent;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
}

.toast--success {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(52, 211, 153, 0.45);
}

.toast--error {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(248, 113, 113, 0.42);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.footer__inner {
  width: 100%;
  margin: 0;
  padding: 0 32px;
  box-sizing: border-box;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.dot { opacity: 0.5; }

@media (max-width: 640px) {
  .main {
    padding: 20px 16px 48px;
  }

  .footer__inner {
    padding: 0 16px;
  }
}
</style>
