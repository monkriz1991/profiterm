<script setup>
const route = useRoute();
import { Fancybox } from "@fancyapps/ui";
const breadcrumbLinks = ref([]);
const seoTitle = ref("");
const seoTImg = ref("");
const seoDescription = ref("");
const error = ref(null);

const article = await $fetch("/api/newsitem/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: route.params.id,
});

const visible = ref(false);
const objectVideo = computed(() => article?.video);

seoTitle.value = article?.seo_title;
seoDescription.value = article?.seo_description;
seoTImg.value = article.img[0].url;
watchEffect(() => {
  if (article) {
    const item = article;
    breadcrumbLinks.value = [
      { label: "Главная", to: "/" },
      { label: "Статьи", to: `/articles/` },
      { label: item.title, to: `/article/${item.kirilica}` },
    ];
  }
});

useSeoMeta({
  title: seoTitle.value,
  ogTitle: seoTitle.value,
  description: seoDescription.value,
  ogDescription: seoDescription.value,
  ogImage: seoTImg.value,
  twitterCard: "summary_large_image",
});
const plyr = async () => {
  const Plyr = await import("plyr");
  new Plyr.default("#y" + objectVideo.value);
};
const openModal = () => {
  visible.value = true;
  plyr();
};

const galleryImages = ref([]);

const openGallery = () => {
  // Ищем первый реальный img внутри .article-galeery
  const firstImage = document.querySelector(".article-galeery-mini .view-box");

  if (firstImage) {
    firstImage.click(); // Имитация клика
  } else {
    console.error("Первое изображение не найдено!");
  }
};
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <div v-if="error">{{ error.message }}</div>

        <ClientOnly>
          <Breadcrumb :links="breadcrumbLinks" />
        </ClientOnly>
        <div class="columns">
          <div class="column is-12">
            <div class="article-top">
              <div class="article-top-img">
                <NuxtImg
                  v-for="imgurl in article.img"
                  :key="imgurl"
                  :src="imgurl.url"
                  loading="lazy"
                  format="wepb"
                  :alt="article.title"
                />
                <div class="article-top-desc">
                  <h1>
                    {{ article.title }}
                  </h1>
                  <strong>{{ article.subtitle }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column is-12">
            <div class="article-desc" v-html="article.description"></div>
          </div>
        </div>
        <div class="columns">
          <div v-if="article.galery.length > 0" class="column is-6">
            <div class="article-galeery" @click="openGallery">
              <div class="article-galeery-button">
                <span>Галерея</span><Icon name="solar:gallery-wide-broken" />
              </div>
              <div
                v-for="(imgurl, idx) in article.galery"
                :key="imgurl"
                class="article-galeery-mini"
                v-show="idx < 4"
              >
                <NuxtImg
                  :src="imgurl.url"
                  class="view-box"
                  ref="galleryImages"
                  data-fancybox="galery galery"
                  :alt="`Фото проекта ${idx + 1} / ${article.title}`"
                  sizes="sm:300px md:300px lg:300px"
                  preload
                />
              </div>
            </div>
          </div>
          <div v-if="article.video" class="column is-6">
            <div class="article-video" @click="openModal()">
              <div class="article-galeery-button">
                <span>Видео</span
                ><Icon name="solar:video-frame-play-horizontal-broken" />
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-12">
            <div class="book-share">
              <strong>Поделиться</strong>
              <div class="book-share-right">
                <Share />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ClientOnly>
      <el-dialog class="video-gal article-modal" v-model="visible">
        <div class="video-gal-item">
          <div
            :id="'y' + objectVideo"
            data-plyr-provider="youtube"
            :data-plyr-embed-id="objectVideo"
          ></div>
        </div>
      </el-dialog>
    </ClientOnly>
  </div>
</template>
<style></style>
