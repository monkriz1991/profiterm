<script setup>
const route = useRoute();

const breadcrumbLinks = ref([]);
const seoTitle = ref("");
const seoTImg = ref("");
const seoDescription = ref("");
const error = ref(null);
const visible = ref(false);

// Use useLazyAsyncData for non-blocking fetch
const { data: article, pending } = await useAsyncData(
  `article-${route.params.id}`,
  () => $fetch("/api/newsitem/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: route.params.id,
  }),
  {
    server: true,
    getCachedData: (key, nuxtApp) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  }
);

const objectVideo = computed(() => article.value?.video);

// Set SEO data when article loads
watch(article, (newArticle) => {
  if (newArticle) {
    seoTitle.value = newArticle.seo_title || "";
    seoDescription.value = newArticle.seo_description || "";
    seoTImg.value = newArticle.img?.[0]?.url || "";
    
    breadcrumbLinks.value = [
      { label: "Главная", to: "/" },
      { label: "Статьи", to: `/articles/` },
      { label: newArticle.title, to: `/article/${newArticle.kirilica}` },
    ];
  }
}, { immediate: true });

useSeoMeta({
  title: () => seoTitle.value,
  ogTitle: () => seoTitle.value,
  description: () => seoDescription.value,
  ogDescription: () => seoDescription.value,
  ogImage: () => seoTImg.value,
  twitterCard: "summary_large_image",
});

// Lazy load Plyr only when needed
const plyr = async () => {
  const Plyr = await import("plyr");
  new Plyr.default("#y" + objectVideo.value);
};

const openModal = () => {
  visible.value = true;
  nextTick(() => {
    plyr();
  });
};

// Lazy load Fancybox only when needed
const initFancybox = async () => {
  const { Fancybox } = await import("@fancyapps/ui");
  Fancybox.bind("[data-fancybox]");
};

onMounted(() => {
  // Defer Fancybox initialization
  requestIdleCallback?.(() => {
    initFancybox();
  }) || setTimeout(initFancybox, 500);
});

const openGallery = () => {
  const firstImage = document.querySelector(".article-galeery-mini .view-box");
  if (firstImage) {
    firstImage.click();
  }
};
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <div v-if="error">{{ error.message }}</div>
        
        <!-- Loading skeleton -->
        <div v-if="pending" class="article-skeleton">
          <div class="skeleton-loader" style="height: 400px; margin-bottom: 20px;"></div>
          <div class="skeleton-loader" style="height: 24px; width: 60%; margin-bottom: 10px;"></div>
          <div class="skeleton-loader" style="height: 16px; width: 100%; margin-bottom: 8px;"></div>
          <div class="skeleton-loader" style="height: 16px; width: 100%; margin-bottom: 8px;"></div>
          <div class="skeleton-loader" style="height: 16px; width: 80%;"></div>
        </div>

        <template v-else-if="article">
          <ClientOnly>
            <Breadcrumb :links="breadcrumbLinks" />
          </ClientOnly>
          <div class="columns">
            <div class="column is-12">
              <div class="article-top">
                <div class="article-top-img">
                  <NuxtImg
                    v-for="(imgurl, idx) in article.img"
                    :key="imgurl.url || idx"
                    :src="imgurl.url"
                    :loading="idx === 0 ? 'eager' : 'lazy'"
                    decoding="async"
                    format="webp"
                    sizes="sm:100vw md:800px lg:1200px"
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
            <div v-if="article.galery?.length > 0" class="column is-6">
              <div class="article-galeery" @click="openGallery">
                <div class="article-galeery-button">
                  <span>Галерея</span><Icon name="solar:gallery-wide-broken" />
                </div>
                <div
                  v-for="(imgurl, idx) in article.galery"
                  :key="imgurl.url || idx"
                  class="article-galeery-mini"
                  v-show="idx < 4"
                >
                  <NuxtImg
                    :src="imgurl.url"
                    class="view-box"
                    data-fancybox="galery galery"
                    :alt="`Фото проекта ${idx + 1} / ${article.title}`"
                    sizes="sm:150px md:200px lg:300px"
                    loading="lazy"
                    decoding="async"
                    format="webp"
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
        </template>
      </div>
    </div>
    <ClientOnly>
      <el-dialog v-if="visible" class="video-gal article-modal" v-model="visible">
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

<style scoped>
.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
<style></style>
