import type { Style } from 'nuxt/dist/head/runtime/components';
<script setup>
const props = defineProps({
  params: {
    type: String,
    default: "",
  },
});
const { data: reviews, error } = await useFetch("/api/reviews/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { Project: props.params },
});
</script>

<template>
  <div class="item-rew">
    <h2>Отзыв</h2>
    <div v-for="item in reviews" :key="item">
      <div class="item-rew-block">
        <div class="item-rew-block-img">
          <img v-for="itemurl in item.img" :key="itemurl" :src="itemurl.url" />
        </div>
        <div class="item-rew-block-desc">
          <strong>{{ item.name }}</strong>
          <div v-html="item.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
