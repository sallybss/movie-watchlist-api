<script setup lang="ts">
defineProps<{
  movie: {
    _id: string
    title: string
    posterUrl?: string
    genre?: string
    releaseYear?: number
    rating?: number
  }
}>()
</script>

<template>
  <div class="card">
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

.info {
  padding: 20px;
}

.rating {
  color: #facc15;
  font-weight: bold;
}
</style>
