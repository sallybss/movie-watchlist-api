<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import MovieCard from "../components/MovieCard.vue"
import {
  addFavoriteMovie,
  getAllMovies,
  getFavoriteMovieIds,
  hasValidToken,
  removeFavoriteMovie,
  type Movie as ApiMovie,
} from "../services/api"
import { showToast } from "../composables/useToast"

type Movie = ApiMovie & {
  posterUrl?: string
}

const movies = ref<Movie[]>([])
const search = ref("")
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const isLoggedIn = ref(false)
const favoriteMovieIds = ref<string[]>([])
const activeIndex = ref(0)

function syncAuthState() {
  isLoggedIn.value = hasValidToken()
  if (!isLoggedIn.value) {
    favoriteMovieIds.value = []
  }
}

function onAuthChanged() {
  syncAuthState()
  fetchFavorites()
}

const filteredMovies = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return movies.value
  return movies.value.filter((m) => (m.title || "").toLowerCase().includes(q))
})

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total
}

const normalizedActiveIndex = computed(() => {
  const total = filteredMovies.value.length
  if (!total) return 0
  return wrapIndex(activeIndex.value, total)
})

const activeMovie = computed(() => {
  const list = filteredMovies.value
  if (!list.length) return null
  return list[normalizedActiveIndex.value]
})

const carouselSlides = computed(() => {
  const list = filteredMovies.value
  if (!list.length) return []

  const offsets = [-2, -1, 0, 1, 2]
  return offsets.map((offset) => {
    const index = wrapIndex(normalizedActiveIndex.value + offset, list.length)
    const movie = list[index]!
    return {
      movie,
      offset,
      key: `${movie._id}-${offset}`,
    }
  })
})

watch(filteredMovies, (list) => {
  if (!list.length) {
    activeIndex.value = 0
    return
  }
  activeIndex.value = wrapIndex(activeIndex.value, list.length)
})

function prevSlide() {
  const total = filteredMovies.value.length
  if (!total) return
  activeIndex.value = wrapIndex(activeIndex.value - 1, total)
}

function nextSlide() {
  const total = filteredMovies.value.length
  if (!total) return
  activeIndex.value = wrapIndex(activeIndex.value + 1, total)
}

function setSlideByOffset(offset: number) {
  const total = filteredMovies.value.length
  if (!total) return
  activeIndex.value = wrapIndex(activeIndex.value + offset, total)
}

function slidePositionClass(offset: number) {
  if (offset === 0) return "slide--center"
  if (offset === -1) return "slide--left"
  if (offset === 1) return "slide--right"
  if (offset === -2) return "slide--far-left"
  return "slide--far-right"
}

async function fetchMovies() {
  loading.value = true
  errorMsg.value = null

  try {
    const data = await getAllMovies()
    movies.value = (data as Movie[]) || []
  } catch (err: any) {
    errorMsg.value = err?.message || "Could not fetch movies"
  } finally {
    loading.value = false
  }
}

function isFavoriteMovie(movieId: string) {
  return favoriteMovieIds.value.includes(movieId)
}

async function fetchFavorites() {
  if (!isLoggedIn.value) {
    favoriteMovieIds.value = []
    return
  }

  try {
    favoriteMovieIds.value = await getFavoriteMovieIds()
  } catch {
    favoriteMovieIds.value = []
  }
}

async function onToggleFavorite(movieId: string) {
  try {
    const wasAdded = !isFavoriteMovie(movieId)
    favoriteMovieIds.value = wasAdded
      ? await addFavoriteMovie(movieId)
      : await removeFavoriteMovie(movieId)
    showToast(wasAdded ? "Added to favorites" : "Removed from favorites", "success")
  } catch (err: any) {
    showToast(err?.message || "Could not update favorites", "error")
  }
}

onMounted(() => {
  fetchMovies()
  syncAuthState()
  fetchFavorites()
  window.addEventListener("storage", onAuthChanged)
  window.addEventListener("auth-changed", onAuthChanged)
  window.addEventListener("favorites-changed", fetchFavorites)
})

onUnmounted(() => {
  window.removeEventListener("storage", onAuthChanged)
  window.removeEventListener("auth-changed", onAuthChanged)
  window.removeEventListener("favorites-changed", fetchFavorites)
})
</script>

<template>
  <section class="heroCarousel">
    <button
      class="carouselNav carouselNav--left"
      type="button"
      aria-label="Previous"
      :disabled="!carouselSlides.length"
      @click="prevSlide"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 5 L8 12 L15 19" />
      </svg>
    </button>

    <div class="carouselTrack" aria-live="polite">
      <button
        v-for="slide in carouselSlides"
        :key="slide.key"
        type="button"
        class="slide"
        :class="slidePositionClass(slide.offset)"
        :style="slide.movie.posterUrl ? { backgroundImage: `url(${slide.movie.posterUrl})` } : {}"
        :aria-label="`Open ${slide.movie.title}`"
        @click="setSlideByOffset(slide.offset)"
      ></button>
    </div>

    <button
      class="carouselNav carouselNav--right"
      type="button"
      aria-label="Next"
      :disabled="!carouselSlides.length"
      @click="nextSlide"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 5 L16 12 L9 19" />
      </svg>
    </button>

    <div class="heroInfo">
      <p class="eyebrow">Featured pick</p>
      <h1>{{ activeMovie?.title ?? "Your Next Favorite" }}</h1>

      <div class="meta">
        <span>{{ activeMovie?.rating ?? "-" }} ★</span>
        <span>{{ activeMovie?.releaseYear ?? "-" }}</span>
        <span>{{ activeMovie?.genre ?? "Unknown" }}</span>
      </div>

      <div class="heroActions" v-if="activeMovie">
        <button
          v-if="isLoggedIn"
          class="btnList"
          type="button"
          @click="onToggleFavorite(activeMovie._id)"
        >
          {{ isFavoriteMovie(activeMovie._id) ? "✓ In My List" : "+ Add List" }}
        </button>

        <router-link v-else class="btnList" to="/login">Login to Add</router-link>
      </div>
    </div>
  </section>

  <section class="filterBar">
    <input v-model="search" class="input" placeholder="Search by title..." />
  </section>

  <section class="sectionHead">
    <p v-if="loading">Loading…</p>
    <p v-else>
      {{ filteredMovies.length }} results
      <template v-if="isLoggedIn"> • {{ favoriteMovieIds.length }} favorites</template>
    </p>
  </section>

  <section v-if="errorMsg" class="empty">
    <p class="errorTitle">Could not load movies</p>
    <p class="errorText">{{ errorMsg }}</p>
    <button class="retry" type="button" @click="fetchMovies">Retry</button>
  </section>

  <section v-else-if="!loading && filteredMovies.length === 0" class="empty">
    No movies yet...
  </section>

  <section v-else class="grid">
    <MovieCard
      v-for="m in filteredMovies"
      :key="m._id"
      :movie="m"
      :show-favorite-button="isLoggedIn"
      :is-favorite="isFavoriteMovie(m._id)"
      @toggle-favorite="onToggleFavorite"
    />
  </section>
</template>

<style scoped>
.heroCarousel {
  position: relative;
  min-height: 74vh;
  width: 100%;
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background:
    radial-gradient(900px 420px at 50% 8%, rgba(130, 57, 201, 0.32), rgba(21, 8, 34, 0.08) 58%),
    linear-gradient(180deg, #09040f 0%, #040207 100%);
  overflow: hidden;
}

.carouselTrack {
  position: relative;
  height: clamp(300px, 42vw, 470px);
  display: grid;
  place-items: center;
  perspective: 1200px;
}

.slide {
  position: absolute;
  width: min(300px, 56vw);
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background:
    linear-gradient(180deg, rgba(37, 52, 82, 0.6), rgba(12, 17, 34, 0.9)),
    linear-gradient(130deg, #324d7f, #131d36);
  background-size: cover;
  background-position: center;
  box-shadow: 0 22px 40px rgba(0, 0, 0, 0.45);
  transition: transform 0.35s ease, opacity 0.35s ease, filter 0.35s ease;
  cursor: pointer;
}

.slide--far-left {
  transform: translateX(-64%) scale(0.8) rotateY(26deg);
  opacity: 0.24;
  filter: blur(1px);
}

.slide--left {
  transform: translateX(-35%) scale(0.9) rotateY(14deg);
  opacity: 0.7;
}

.slide--right {
  transform: translateX(35%) scale(0.9) rotateY(-14deg);
  opacity: 0.7;
}

.slide--far-right {
  transform: translateX(64%) scale(0.8) rotateY(-26deg);
  opacity: 0.24;
  filter: blur(1px);
}

.slide--far-left,
.slide--left,
.slide--right,
.slide--far-right {
  pointer-events: auto;
}

.slide--far-left,
.slide--left,
.slide--right,
.slide--far-right {
  z-index: 2;
}

.slide--center {
  z-index: 4;
  opacity: 1;
  transform: translateX(0) scale(1.02);
}

.carouselNav {
  position: absolute;
  top: 42%;
  transform: translateY(-50%);
  z-index: 8;
  width: 58px;
  height: 58px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.38);
  background: rgba(26, 10, 40, 0.5);
  backdrop-filter: blur(6px);
  color: #fff;
  padding: 0;
  display: grid;
  place-items: center;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.42);
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.carouselNav svg {
  width: 24px;
  height: 24px;
  stroke: #ffffff;
  stroke-width: 2.6;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.carouselNav:hover {
  border-color: rgba(255, 255, 255, 0.68);
  background: rgba(42, 16, 63, 0.74);
  transform: translateY(-50%) scale(1.04);
}

.carouselNav:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.carouselNav--left { left: clamp(18px, 3.4vw, 54px); }
.carouselNav--right { right: clamp(18px, 3.4vw, 54px); }

.heroInfo {
  width: min(760px, 100%);
  margin: 8px auto 0;
  text-align: center;
}

.eyebrow {
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

h1 {
  margin: 8px 0 0;
  font-size: 32px;
  line-height: 0.95;
}

.meta {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 700;
  font-size: 13px;
  flex-wrap: wrap;
}

.heroActions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.btnPlay,
.btnList {
  border: none;
  height: 44px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.btnPlay {
  background: #7664d7;
  color: #fff;
}

.btnList {
  background: #f4d139;
  color: #111827;
  padding: 0 10px;
}

.filterBar {
  margin-top: 16px;
  margin-left: 24px;
  margin-right: 24px;
  border-radius: 10px;
  background: rgba(31, 13, 46, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
}

.input {
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  padding: 10px 12px;
  border-radius: 8px;
  outline: none;
  min-height: 44px;
  box-sizing: border-box;
}

.input:focus {
  border-color: rgba(167, 127, 255, 0.62);
  box-shadow: 0 0 0 3px rgba(138, 87, 230, 0.22);
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.sectionHead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 22px 24px 10px;
}

.sectionHead p {
  margin: 0;
  opacity: 0.7;
}

.empty {
  opacity: 0.9;
  padding: 30px 0;
  margin-left: 24px;
  margin-right: 24px;
  text-align: center;
}

.errorTitle {
  margin: 0 0 6px;
  font-weight: 900;
}

.errorText {
  margin: 0 0 14px;
  opacity: 0.8;
}

.retry {
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(118, 100, 215, 0.25);
  color: #fff;
  font-weight: 900;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
  gap: 18px;
  margin-left: 24px;
  margin-right: 24px;
}

@media (max-width: 900px) {
  .heroCarousel {
    min-height: 62vh;
    width: 100%;
    margin: 0;
    padding-top: 20px;
  }

  .carouselTrack {
    height: 320px;
  }

  .slide {
    width: min(220px, 64vw);
  }

  .slide--far-left,
  .slide--far-right {
    opacity: 0;
    pointer-events: none;
  }

  .slide--left {
    transform: translateX(-34%) scale(0.84);
  }

  .slide--right {
    transform: translateX(34%) scale(0.84);
  }

  .slide--center {
    transform: translateX(0) scale(1);
    opacity: 1;
  }

  h1 {
    font-size: clamp(30px, 10vw, 46px);
  }

  .carouselNav {
    width: 46px;
    height: 46px;
  }

  .carouselNav svg {
    width: 20px;
    height: 20px;
  }

  .filterBar,
  .sectionHead,
  .empty,
  .grid {
    margin-left: 16px;
    margin-right: 16px;
  }

}
</style>
