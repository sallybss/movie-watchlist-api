<script setup lang="ts">
import { ref } from "vue"

const email = ref("")
const password = ref("")
</script>

<template>
  <section class="authPage">
    <section class="panel">
      <div class="panel__head">
        <p>Need an account?</p>
        <router-link to="/register" class="switchBtn">Sign up</router-link>
      </div>

      <h1>Sign in</h1>

      <form class="form" @submit.prevent>
        <label>Email</label>
        <input v-model="email" class="input" type="email" placeholder="you@example.com" />

        <label>Password</label>
        <input v-model="password" class="input" type="password" placeholder="Enter password" />

        <button class="submit" type="submit">Continue</button>

        <div class="row">
          <label class="check">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="#" class="help">Forgot password?</a>
        </div>
      </form>
    </section>
  </section>
</template>

<style scoped>
.authPage {
  position: relative;
  min-height: calc(100vh - 160px);
  display: grid;
  place-items: center;
  padding: 24px 16px 36px;
  overflow: hidden;
}

.panel {
  position: relative;
  width: min(460px, 100%);
  z-index: 1;
}

.panel__head {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
}

.switchBtn {
  color: #fff;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #7664d7;
}

h1 {
  margin: 10px 0 16px;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}

.form {
  width: 100%;
}

label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.92);
  margin: 12px 0 6px;
}

.input {
  width: 100%;
  height: 46px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 10px;
  background: rgba(17, 24, 39, 0.7);
  color: #fff;
  padding: 0 12px;
  box-sizing: border-box;
  outline: none;
}

.input:focus {
  border-color: #7664d7;
}

.submit {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 10px;
  margin-top: 16px;
  background: #7664d7;
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
}

.row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.help {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
}

@media (max-width: 640px) {
  h1 {
    font-size: 42px;
  }

  .panel__head {
    justify-content: flex-start;
  }
}
</style>
