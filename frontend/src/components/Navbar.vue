<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { logout } from "../services/api";

const router = useRouter();

const currentUser = ref("");

const isLoggedIn = computed(() => currentUser.value.length > 0);

function getNameFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    const payloadPart = parts[1];
    if (!payloadPart) return null;
    const payload = JSON.parse(atob(payloadPart)) as { name?: string };
    return typeof payload?.name === "string" ? payload.name : null;
  } catch {
    return null;
  }
}

function syncAuthState() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token) {
    currentUser.value = "";
    return;
  }

  const storedName = localStorage.getItem("userName");
  const decodedName = getNameFromToken(token);
  const displayName = storedName || decodedName || userId || "";

  if (decodedName && !storedName) {
    localStorage.setItem("userName", decodedName);
  }

  currentUser.value = displayName;
}

function onLogout() {
  logout();
  syncAuthState();
  router.push("/login");
}

onMounted(() => {
  syncAuthState();
  window.addEventListener("storage", syncAuthState);
  window.addEventListener("auth-changed", syncAuthState);
});

onUnmounted(() => {
  window.removeEventListener("storage", syncAuthState);
  window.removeEventListener("auth-changed", syncAuthState);
});
</script>

<template>
  <nav class="navbar">
    <div class="left">
      <router-link to="/" class="brand">WATCHLIST</router-link>

      <div class="links">
        <router-link class="link" to="/">For you</router-link>
        <router-link v-if="isLoggedIn" class="link" to="/watchlist">My Movie Watchlist</router-link>
      </div>
    </div>

    <div class="right">
      <span v-if="isLoggedIn" class="currentUser">Logged in: {{ currentUser }}</span>

      <router-link v-if="!isLoggedIn" to="/login" class="auth">Login</router-link>
      <router-link v-if="!isLoggedIn" to="/register" class="auth auth--cta">Register</router-link>

      <button v-if="isLoggedIn" class="auth auth--logout" type="button" @click="onLogout">
        Logout
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 22px 32px 10px;
}

.left {
  display: flex;
  align-items: center;
  gap: 28px;
  min-width: 0;
}

.brand {
  text-decoration: none;
  color: #7664d7;
  font-weight: 900;
  letter-spacing: 0.08em;
  font-size: 34px;
  line-height: 1;
}

.links {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.82);
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
}

.link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.link.router-link-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.currentUser {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auth {
  font-family: inherit;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
}

.auth--cta {
  color: #0f172a;
  background: #facc15;
  border-color: transparent;
}

.auth--logout {
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.35);
}

@media (max-width: 900px) {
  .navbar {
    padding: 16px 16px 8px;
  }

  .brand {
    font-size: 28px;
  }

  .links {
    display: none;
  }
}
</style>
