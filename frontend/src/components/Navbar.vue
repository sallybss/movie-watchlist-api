<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Navbar",
});
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { hasValidToken, logout } from "../services/api";

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
  if (!hasValidToken()) {
    currentUser.value = "";
    return;
  }

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
      <router-link to="/" class="brand" aria-label="Watchlist home">
        <img src="/logo.png" alt="Watchlist" class="brandLogo" />
      </router-link>

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
  padding: 18px 24px 10px;
  background:
    linear-gradient(90deg, rgba(57, 24, 82, 0.72), rgba(14, 6, 23, 0.84) 68%, rgba(5, 2, 9, 0.92));
  border-bottom: 1px solid rgba(180, 118, 255, 0.15);
}

.left {
  display: flex;
  align-items: center;
  gap: 28px;
  min-width: 0;
}

.brand {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.brandLogo {
  height: 52px;
  width: auto;
  display: block;
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
  background: rgba(255, 255, 255, 0.2);
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
    padding: 14px 16px 8px;
  }

  .brand {
    line-height: 1;
  }

  .brandLogo {
    height: 40px;
  }

  .links {
    display: none;
  }
}
</style>
