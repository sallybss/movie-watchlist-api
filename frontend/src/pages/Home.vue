<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import MovieCard from "../components/MovieCard.vue"

interface Movie {
  _id: string
  title: string
  posterUrl?: string
  genre?: string
  releaseYear?: number
  rating?: number
}

const movies = ref<Movie[]>([])
const search = ref("")

const filteredMovies = computed(() => {
  return movies.value.filter(m => {
    return m.title.toLowerCase().includes(search.value.toLowerCase())
  })
})

const stackMovies = computed(() => filteredMovies.value.slice(0, 4))

const featuredMovie = computed(() => {
  return filteredMovies.value[0] ?? movies.value[0] ?? null
})

const featuredMediaStyle = computed(() => {
  if (!featuredMovie.value?.posterUrl) return {}
  return { backgroundImage: `url(${featuredMovie.value.posterUrl})` }
})

async function fetchMovies() {
  const res = await fetch("http://localhost:4000/api/movies")
  movies.value = await res.json()
}

onMounted(fetchMovies)
</script>

<template>
  <section class="spotlight">
    <div class="stack" aria-hidden="true">
      <article
        v-for="(m, i) in stackMovies"
        :key="m._id"
        class="stack__card"
        :class="`stack__card--${i + 1}`"
        :style="m.posterUrl ? { backgroundImage: `url(${m.posterUrl})` } : {}"
      ></article>
    </div>

    <article class="featureCard">
      <button class="featureCard__close" type="button" aria-label="Close">✕</button>
      <div class="featureCard__media" :style="featuredMediaStyle"></div>
      <div class="featureCard__overlay">
        <h1>{{ featuredMovie?.title ?? "Your Next Favorite" }}</h1>
        <div class="meta">
          <span>{{ featuredMovie?.rating ?? "-" }} ★</span>
          <span>{{ featuredMovie?.releaseYear ?? "-" }}</span>
          <span>{{ featuredMovie?.genre ?? "Unknown" }}</span>
        </div>
        <p class="featureCard__description">
          Build your collection, track what you watched, and instantly filter the perfect pick.
        </p>

        <div class="featureCard__actions">
          <router-link class="btnPrimary" to="/register">Get access</router-link>
          <router-link class="btnGhost" to="/login">Login</router-link>
        </div>
      </div>
    </article>
  </section>

  <section class="filterBar">
    <input v-model="search" class="input" placeholder="Search title…" />
  </section>

  <section class="sectionHead">
    <h2>Browse</h2>
    <p>{{ filteredMovies.length }} results</p>
  </section>

  <section v-if="filteredMovies.length === 0" class="empty">
    No movies yet...
  </section>

  <section class="grid">
    <MovieCard v-for="m in filteredMovies" :key="m._id" :movie="m" />
  </section>
  
</template>

<style scoped>
.spotlight {
  min-height: 64vh;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: radial-gradient(70% 100% at 65% 20%, rgba(32, 94, 255, 0.2) 0%, rgba(4, 7, 20, 0) 70%);
}

.stack {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.stack__card {
  position: absolute;
  width: min(420px, 66vw);
  aspect-ratio: 3 / 4;
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(4px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  background-size: cover;
  background-position: center;
}

.stack__card--1 {
  transform: translate(-240px, 42px) rotate(-14deg);
  background: linear-gradient(160deg, rgba(243, 74, 74, 0.45), rgba(83, 23, 19, 0.26));
}

.stack__card--2 {
  transform: translate(-170px, 26px) rotate(-8deg);
  background: linear-gradient(160deg, rgba(236, 161, 90, 0.44), rgba(145, 79, 30, 0.3));
}

.stack__card--3 {
  transform: translate(-95px, 12px) rotate(-4deg);
  background: linear-gradient(160deg, rgba(74, 202, 212, 0.48), rgba(16, 57, 73, 0.3));
}

.stack__card--4 {
  transform: translate(-28px, -3px) rotate(-2deg);
  background: linear-gradient(160deg, rgba(157, 213, 255, 0.42), rgba(38, 85, 123, 0.3));
}

.featureCard {
  width: min(680px, 78vw);
  aspect-ratio: 16 / 10;
  margin-left: clamp(160px, 27vw, 360px);
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.6);
  background: #101828;
}

.featureCard__media {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(90% 130% at 78% 10%, rgba(146, 217, 255, 0.45) 0%, rgba(39, 62, 84, 0.18) 58%, transparent 100%),
    linear-gradient(130deg, rgba(25, 35, 64, 0.5), rgba(14, 39, 66, 0.1)),
    linear-gradient(180deg, #6ba3bb 0%, #4c6a75 30%, #1f2937 68%, #0f172a 100%);
}

.featureCard__overlay {
  position: absolute;
  inset: auto 0 0;
  padding: 24px 24px 22px;
  background: linear-gradient(180deg, rgba(2, 8, 23, 0.05) 0%, rgba(2, 8, 23, 0.94) 82%);
}

.featureCard__close {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 999px;
  color: #fff;
  background: rgba(15, 23, 42, 0.44);
  font-size: 18px;
  cursor: default;
}

h1 {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.04;
}

.meta {
  margin-top: 8px;
  display: flex;
  gap: 12px;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 600;
  font-size: 14px;
}

.featureCard__description {
  margin: 12px 0 0;
  opacity: 0.82;
  max-width: 58ch;
}

.featureCard__actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.btnPrimary,
.btnGhost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 900;
}

.btnPrimary {
  background: #ef1d24;
  color: #fff;
}

.btnGhost {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
}

.filterBar {
  margin-top: 16px;
  border-radius: 18px;
  background: rgba(13, 24, 48, 0.64);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px;
  display: block;
}

.input {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  padding: 10px 12px;
  border-radius: 10px;
  outline: none;
  min-height: 44px;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.sectionHead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 22px 2px 10px;
}
.sectionHead h2 { margin: 0; }
.sectionHead p { margin: 0; opacity: 0.7; }

.empty { opacity: 0.8; padding: 30px 0; text-align: center; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

@media (max-width: 1080px) {
  .featureCard {
    width: min(640px, 84vw);
    margin-left: clamp(20px, 18vw, 180px);
  }
}

@media (max-width: 900px) {
  .spotlight {
    min-height: 52vh;
  }

  .stack {
    display: none;
  }

  .featureCard {
    width: 100%;
    margin-left: 0;
  }

  .featureCard__overlay {
    padding: 18px 16px 16px;
  }

  h1 {
    font-size: 30px;
  }
}

</style>
