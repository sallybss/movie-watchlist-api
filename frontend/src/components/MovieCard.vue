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
</script>

<template>
  <div class="card">
    <button
      v-if="showFavoriteButton"
      class="favoriteBtn"
      type="button"
      :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      @click="onToggleFavorite"
    >
      {{ isFavorite ? "♥ Favorited" : "♡ Add to Favorites" }}
    </button>

    <div class="poster" :style="movie.posterUrl ? { backgroundImage: `url(${movie.posterUrl})` } : {}"></div>

    <div class="info">
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.genre ?? "Unknown" }} • {{ movie.releaseYear ?? "-" }}</p>
      <p class="rating">⭐ {{ movie.rating ?? "-" }}/5</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.poster {
  height: 180px;
  background: linear-gradient(45deg, #334155, #1e293b);
  background-size: cover;
  background-position: center;
}

.favoriteBtn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(15, 23, 42, 0.86);
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.info {
  padding: 20px;
}

.rating {
  color: #facc15;
  font-weight: bold;
}
</style>
