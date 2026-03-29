<script setup>
const props = defineProps({
  params: {
    type: String,
    default: "",
  },
});

// Use lazy fetch with caching
const {
  data: reviews,
  error,
  pending,
} = await useLazyFetch("/api/reviews/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { Project: props.params },
  server: true,
});
</script>

<template>
  <div class="item-rew">
    <h2>Отзыв</h2>

    <!-- Loading skeleton -->
    <div
      v-if="pending"
      class="skeleton-loader"
      style="height: 100px; margin: 10px 0"
    ></div>

    <div v-else v-for="item in reviews" :key="item._id || item">
      <div class="item-rew-block">
        <div class="item-rew-block-img">
          <NuxtImg
            v-for="(itemurl, idx) in item.img"
            :key="itemurl.url || idx"
            :src="itemurl.url"
            loading="lazy"
            decoding="async"
            format="webp"
            sizes="sm:100px md:150px lg:200px"
            :alt="`Отзыв ${item.name}`"
          />
        </div>
        <div class="item-rew-block-desc">
          <strong>{{ item.name }}</strong>
          <div v-html="item.description" class="desck-rev-user"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border-radius-md: 8px;

.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: $border-radius-md;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
