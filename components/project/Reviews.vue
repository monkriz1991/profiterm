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

<style>
.item-rew {
}
.item-rew-block {
  float: left;
  width: 100%;
}
.item-rew-block-img {
  float: left;
  width: 240px;
  height: 300px;
}
.item-rew-block-img img {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: 17px;
  cursor: pointer;
}
.item-rew-block-desc {
  margin: 0 0 0 280px;
}
.item-rew-block-desc > strong {
  font-size: 20px;
  margin: 0 0 20px;
  float: left;
  width: 100%;
}
.item-rew-block-desc > div {
  font-size: 16px;
  line-height: 1.6;
}
.item-rew > h2 {
  margin: 20px 0 30px;
}
</style>
