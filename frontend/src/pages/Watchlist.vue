<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"
import MovieCard from "../components/MovieCard.vue"
import {
  getFavoriteMovies,
  removeFavoriteMovie,
  type Movie as ApiMovie,
} from "../services/api"
import { showToast } from "../composables/useToast"

type Movie = ApiMovie & {
  posterUrl?: string
}

const movies = ref<Movie[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const favoriteMovies = computed(() => movies.value)
const router = useRouter()

async function fetchMovies() {
  loading.value = true
  errorMsg.value = null

  try {
    const data = await getFavoriteMovies()
    movies.value = (data as Movie[]) || []
  } catch (err: any) {
    const message = err?.message || "Could not fetch movies"
    errorMsg.value = message
    if (message.toLowerCase().includes("session expired")) {
      showToast("Session expired. Please login again.", "error")
      router.push("/login")
    }
  } finally {
    loading.value = false
  }
}

async function onToggleFavorite(movieId: string) {
  try {
    await removeFavoriteMovie(movieId)
    movies.value = movies.value.filter((m) => m._id !== movieId)
    showToast("Removed from favorites", "success")
  } catch (err: any) {
    showToast(err?.message || "Could not update favorites", "error")
  }
}

onMounted(() => {
  fetchMovies()
  window.addEventListener("favorites-changed", fetchMovies)
})

onUnmounted(() => {
  window.removeEventListener("favorites-changed", fetchMovies)
})
</script>

<template>
  <section class="sectionHead">
    <h1>My Movie Watchlist</h1>
    <p v-if="loading">Loading…</p>
    <p v-else>{{ favoriteMovies.length }} favorites</p>
  </section>

  <section v-if="errorMsg" class="empty">
    <p class="errorTitle">Could not load watchlist</p>
    <p class="errorText">{{ errorMsg }}</p>
    <button class="retry" type="button" @click="fetchMovies">Retry</button>
  </section>

  <section v-else-if="!loading && favoriteMovies.length === 0" class="empty">
    <p>No favorites yet.</p>
    <router-link to="/" class="browseLink">Browse movies</router-link>
  </section>

  <section v-else class="grid">
    <MovieCard
      v-for="m in favoriteMovies"
      :key="m._id"
      :movie="m"
      :show-favorite-button="true"
      :is-favorite="true"
      @toggle-favorite="onToggleFavorite"
    />
  </section>
</template>

<style scoped>
.sectionHead {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0 24px 16px;
}

h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.04;
  padding-top: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
  gap: 18px;
  margin: 0 24px;
}

.empty {
  border: 1px dashed rgba(255, 255, 255, 0.24);
  border-radius: 12px;
  padding: 20px;
  margin: 0 24px;
  color: rgba(255, 255, 255, 0.82);
}

.errorTitle {
  margin: 0;
  font-weight: 700;
}

.errorText {
  margin: 8px 0 0;
}

.retry {
  margin-top: 12px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(136, 102, 232, 0.28);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}

.browseLink {
  display: inline-block;
  margin-top: 10px;
}

@media (max-width: 900px) {
  .sectionHead,
  .grid,
  .empty {
    margin-left: 16px;
    margin-right: 16px;
  }
}

</style>
