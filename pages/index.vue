<script setup>
import { Vue3Lottie } from "vue3-lottie";
definePageMeta({
  title: "My index page",
  layout: "default",
});
const descGal = ref("");
const { data: main, pending } = await useFetch(() => "/api/main/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
if (!main.value) {
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
} else {
  for (let item in main.value.one) {
    descGal.value = main.value.one[item]["description"];
  }
}
</script>
<template>
  <div class="container">
    <div class="content index-content">
      <div class="columns">
        <div class="column is-12">
          <div class="video-index" v-for="item in main.one" :key="item">
            <ClientOnly>
              <video
                v-for="itemvideo in item.video"
                :key="itemvideo"
                class=""
                muted=""
                autoplay=""
                loop=""
                webkit-playsinline=""
                playsinline=""
                :poster="itemvideo.img"
                type="video/webm"
                :src="itemvideo.url"
              >
                <source class="video-sourse" src="" type="video/mp4" />
              </video>
            </ClientOnly>
            <div class="video-block-inf">
              <strong>{{ item.title }}</strong>
              <span>{{ item.preview }}</span>

              <ModalForm />
            </div>
          </div>
        </div>
      </div>

      <index-galery v-model:galery="main.two" v-model:description="descGal" />
      <index-video v-model:video="main.three" />
      <index-system />
      <ClientOnly>
        <index-work />
      </ClientOnly>

      <index-reviews />
    </div>
  </div>
</template>

<style>
.video-index {
  float: left;
  width: 100%;
  height: 500px;
  border-radius: 22px;
  overflow: hidden;
  position: relative;
  margin: 0 0 100px;
}
.video-index > video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.video-block-inf {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgb(0 0 0 / 44%);
  display: flex;
  align-items: baseline;
  padding: 0 100px;
  border-radius: 22px;
  color: #fff;
  flex-flow: column;
  justify-content: center;
}
.video-block-inf > strong {
  color: #fff;
  width: 50%;
  font-size: 32px;
  font-weight: 900;
}
.video-block-inf > span {
  width: 50%;
  font-size: 17px;
  font-weight: 500;
  margin: 20px 0;
}
</style>
