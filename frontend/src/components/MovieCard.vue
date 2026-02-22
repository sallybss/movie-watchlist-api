<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "MovieCard",
})
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    movie: {
      _id: string
      title: string
      posterUrl?: string
      genre?: string
      releaseYear?: number
      rating?: number
    }
    showFavoriteButton?: boolean
    isFavorite?: boolean
  }>(),
  {
    showFavoriteButton: false,
    isFavorite: false,
  }
)

const emit = defineEmits<{
  (e: "toggle-favorite", movieId: string): void
}>()

function onToggleFavorite() {
  emit("toggle-favorite", props.movie._id)
}

function ratingStars(rating?: number) {
  const count = Math.max(0, Math.min(5, Math.round(rating ?? 0)))
  return "★".repeat(count) || "☆☆☆☆☆"
}
</script>

<template>
  <div class="card">
    <p class="label">BEST SELECTION</p>

    <button
      v-if="showFavoriteButton"
      class="favoriteBtn"
      type="button"
      :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      @click.stop="onToggleFavorite"
    >
      {{ isFavorite ? "♥" : "♡" }}
    </button>

    <div class="poster" :style="movie.posterUrl ? { backgroundImage: `url(${movie.posterUrl})` } : {}"></div>

    <div class="info">
      <h3>{{ movie.title }}</h3>
      <p class="meta">{{ movie.genre ?? "Unknown" }} • {{ movie.releaseYear ?? "-" }}</p>
      <p class="rating">{{ ratingStars(movie.rating) }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  background:
    radial-gradient(140% 120% at 50% 0%, rgba(153, 92, 214, 0.28), rgba(21, 11, 32, 0.8) 48%, rgba(11, 7, 18, 0.95) 100%),
    #0d0816;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  padding: 12px 12px 14px;
  min-height: 398px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 34px rgba(0, 0, 0, 0.38);
}

.poster {
  margin-top: 18px;
  height: 250px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(145deg, #3c234e, #131220);
  background-size: cover;
  background-position: center;
  position: relative;
}

.favoriteBtn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(8, 7, 16, 0.7);
  color: #ffd2e7;
  padding: 0;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
}

.label {
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 12px;
  letter-spacing: 0.08em;
  font-weight: 800;
}

.info {
  text-align: center;
  padding: 12px 6px 2px;
}

h3 {
  margin: 0;
  font-size: 21px;
  line-height: 1.15;
}

.meta {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
}

.rating {
  margin: 8px 0 0;
  color: #ffce2f;
  font-size: 12px;
  letter-spacing: 0.2em;
  font-weight: 700;
}
</style>
