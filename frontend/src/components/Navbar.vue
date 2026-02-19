<template>
  <nav class="navbar">
    <div class="left">
      <router-link to="/" class="brand">WATCHLIST</router-link>

      <div class="links">
        <a class="link is-active" href="#">For you</a>
      </div>
    </div>

    <div class="right">
      <router-link to="/login" class="auth">Login</router-link>
      <router-link to="/register" class="auth auth--cta">Register</router-link>
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

.link.is-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth {
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth--cta {
  color: #0f172a;
  background: #facc15;
  border-color: transparent;
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
