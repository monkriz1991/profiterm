<script setup>
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
  <div class="bd-docs-main">
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
  </div>
</template>
<style></style>
