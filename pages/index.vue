<script setup>
import { useWindowSize } from "@vueuse/core";
definePageMeta({
  title: "My index page",
  layout: "default",
});

const { width } = useWindowSize();
const windowWidth = ref(width.value);
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
    if (main.value.one[item] && main.value.one[item]["description"]) {
      descGal.value = main.value.one[item]["description"];
    }
  }
}

watchEffect(() => {
  windowWidth.value = width.value;
});

const videos = computed(() => {
  return main.value.one.map((item) => {
    const isDesktop = windowWidth.value >= 700;
    return {
      ...item,
      videos: isDesktop ? item.video : item.video_mobail,
      poster:
        isDesktop && item.img[0]
          ? item.img[0].url
          : item.img[1]
          ? item.img[1].url
          : null,
    };
  });
});
useSeoMeta({
  title: "Проектирование, монтаж систем отопления, водоснабжения, канализации",
  ogTitle:
    "Проектирование, монтаж систем отопления, водоснабжения, канализации",
  description:
    "Предлагаем приемлемые цены, гарантию до 5 лет и рассрочку платежа. Высококачественные инженерные системы для комфортного и беззаботного проживания в частном доме.",
  ogDescription:
    "Предлагаем приемлемые цены, гарантию до 5 лет и рассрочку платежа. Высококачественные инженерные системы для комфортного и беззаботного проживания в частном доме.",
  ogImage: "/profiterm.webp",
  twitterCard: "summary_large_image",
  canonical: "https://profiterm.by",
});
</script>

<template>
  <div class="bd-docs-main">
    <div class="cover-video-index">
      <div class="video-index" v-for="item in videos" :key="item">
        <ClientOnly>
          <video
            v-for="itemvideo in item.videos"
            :key="itemvideo"
            class=""
            muted
            autoplay
            loop
            webkit-playsinline
            playsinline
            :poster="item.poster"
            type="video/webm"
            :src="itemvideo.url"
          >
            <source class="video-sourse" src="" type="video/mp4" />
          </video>
        </ClientOnly>
        <div class="container">
          <div class="video-block-inf">
            <h1>{{ item.title }}</h1>
            <h2 v-html="item.preview"></h2>
            <ModalForm />
          </div>
        </div>
        <div class="cover-image-fon"></div>
      </div>
    </div>
    <div class="container">
      <div class="content index-content">
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
