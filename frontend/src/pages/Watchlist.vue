<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
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

async function fetchMovies() {
  loading.value = true
  errorMsg.value = null

  try {
    const data = await getFavoriteMovies()
    movies.value = (data as Movie[]) || []
  } catch (err: any) {
    errorMsg.value = err?.message || "Could not fetch movies"
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
  margin-bottom: 16px;
}

h1 {
  margin: 0;
  font-size: clamp(26px, 4vw, 40px);
  line-height: 1.04;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.empty {
  border: 1px dashed rgba(255, 255, 255, 0.24);
  border-radius: 12px;
  padding: 20px;
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
}

.browseLink {
  display: inline-block;
  margin-top: 10px;
}
</style>
