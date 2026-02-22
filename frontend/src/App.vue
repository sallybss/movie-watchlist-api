<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import Navbar from "./components/Navbar.vue"

const route = useRoute()
const isAuthRoute = computed(() => route.path === "/login" || route.path === "/register")
</script>

<template>
  <div class="app" :class="{ authMode: isAuthRoute }">
    <Navbar />

    <main class="main">
      <div class="shell">
        <router-view />
      </div>
    </main>

    <footer class="footer">
      <div class="footer__inner">
        <span> © {{ new Date().getFullYear() }} Watchlist</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(1100px 720px at 16% 4%, #3a1658 0%, #12061f 52%, #040207 100%);
  color: #fff;
}

.app.authMode {
  background: #05020a;
}

.app.authMode::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(180deg, rgba(20, 8, 35, 0.7), rgba(6, 2, 10, 0.84)),
    url("https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: saturate(0.95);
}

.app > * {
  position: relative;
  z-index: 1;
}

.main {
  width: 100%;
  margin: 0;
  padding: 0 0 60px;
  box-sizing: border-box;
}

.shell {
  width: 100%;
  max-width: none;
  margin: 0;
}

.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 0;
  color: rgba(255, 255, 255, 0.7);
}

.footer__inner {
  width: 100%;
  margin: 0;
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.dot {
  opacity: 0.5;
}

@media (max-width: 640px) {
  .main {
    padding: 0 0 48px;
  }

  .footer__inner {
    padding: 0 16px;
  }
}
</style>
