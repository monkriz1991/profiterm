<script setup>
import { useWindowSize } from "@vueuse/core";
import { useMainStore } from "~/store/maindata";

definePageMeta({
  title: "My index page",
  layout: "default",
});

// Async components for deferred loading - улучшает First Contentful Paint
const LazyIndexGalery = defineAsyncComponent(() => import("~/components/index/Galery.vue"));
const LazyIndexVideo = defineAsyncComponent(() => import("~/components/index/Video.vue"));
const LazyIndexSystem = defineAsyncComponent(() => import("~/components/index/System.vue"));
const LazyIndexNews = defineAsyncComponent(() => import("~/components/index/News.vue"));
const LazyIndexWork = defineAsyncComponent(() => import("~/components/index/Work.vue"));
const LazyIndexReviews = defineAsyncComponent(() => import("~/components/index/Reviews.vue"));

const mainData = useMainStore();
const monDataNav = ref([]);

// Non-blocking data fetch using lazy
mainData.fetchData();
monDataNav.value = mainData.getMain;

const seoTitle = computed(() =>
  monDataNav.value.length > 0
    ? monDataNav.value[0]?.seo_title
    : "Проектирование, монтаж систем отопления, водоснабжения, канализации"
);
const seoDescription = computed(() =>
  monDataNav.value.length > 0
    ? monDataNav.value[0]?.seo_description
    : "Предлагаем приемлемые цены, гарантию до 5 лет и рассрочку платежа. Высококачественные инженерные системы для комфортного и беззаботного проживания в частном доме."
);

const { width } = useWindowSize();
const windowWidth = ref(width.value);
const descGal = ref("");
const isVideoLoaded = ref(false);
const isContentVisible = ref(false);

// Use lazy fetch to not block initial render
const { data: main, pending } = await useLazyFetch("/api/main/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  server: true,
  transform: (data) => data, // Кэширование данных
});

// Watch for data changes to set descGal
watch(main, (newMain) => {
  if (newMain?.one) {
    for (let item in newMain.one) {
      if (newMain.one[item] && newMain.one[item]["description"]) {
        descGal.value = newMain.one[item]["description"];
        break;
      }
    }
  }
}, { immediate: true });

watchEffect(() => {
  windowWidth.value = width.value;
});

const videos = computed(() => {
  if (!main.value?.one) return [];
  return main.value.one.map((item) => {
    const isDesktop = windowWidth.value >= 700;
    return {
      ...item,
      videos: isDesktop ? item.video : item.video_mobail,
      poster:
        isDesktop && item.img?.[0]
          ? item.img[0].url
          : item.img?.[1]
          ? item.img[1].url
          : null,
    };
  });
});

onMounted(() => {
  // Показываем контент быстрее
  requestAnimationFrame(() => {
    isContentVisible.value = true;
  });
  
  // Отложенная загрузка видео после первого рендера
  requestIdleCallback?.(() => {
    isVideoLoaded.value = true;
  }) || setTimeout(() => {
    isVideoLoaded.value = true;
  }, 800);
});

useSeoMeta({
  title: seoTitle.value,
  ogTitle: seoTitle.value,
  description: seoDescription.value,
  ogDescription: seoDescription.value,
  ogImage: "/profiterm.webp",
  twitterCard: "summary_large_image",
  canonical: "https://profiterm.by/",
});
</script>

<template>
  <div class="bd-docs-main">
    <!-- Hero section with video - показываем постер сразу -->
    <div class="cover-video-index">
      <div class="video-index" v-for="(item, index) in videos" :key="index">
        <!-- Показываем постер как фон пока видео загружается -->
        <div 
          v-if="item.poster && !isVideoLoaded" 
          class="video-poster-fallback"
          :style="{ backgroundImage: `url(${item.poster})` }"
        ></div>
        
        <ClientOnly>
          <video
            v-if="isVideoLoaded && item.videos?.[0]?.url"
            muted
            autoplay
            loop
            webkit-playsinline
            playsinline
            preload="none"
            :poster="item.poster"
          >
            <source :src="item.videos[0].url" type="video/mp4" />
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
    
    <!-- Main content with lazy loaded components -->
    <div class="container">
      <div class="content index-content">
        <Suspense>
          <LazyIndexGalery 
            v-if="main?.two" 
            v-model:galery="main.two" 
            v-model:description="descGal" 
          />
          <template #fallback>
            <div class="skeleton-loader" style="height: 400px;"></div>
          </template>
        </Suspense>

        <Suspense>
          <LazyIndexVideo v-if="main?.three" v-model:video="main.three" />
          <template #fallback>
            <div class="skeleton-loader" style="height: 300px;"></div>
          </template>
        </Suspense>
        
        <Suspense>
          <LazyIndexSystem />
          <template #fallback>
            <div class="skeleton-loader" style="height: 400px;"></div>
          </template>
        </Suspense>
        
        <Suspense>
          <LazyIndexNews />
          <template #fallback>
            <div class="skeleton-loader" style="height: 200px;"></div>
          </template>
        </Suspense>
        
        <div class="index-calk">
          <span
            >Для определения стоимости работ Вы можете совершить предварительный
            расчёт!</span
          >
          <nuxt-link to="/calculator">Перейти к расчёту</nuxt-link>
        </div>
        
        <ClientOnly>
          <Suspense>
            <LazyIndexWork />
            <template #fallback>
              <div class="skeleton-loader" style="height: 300px;"></div>
            </template>
          </Suspense>
        </ClientOnly>
        
        <Suspense>
          <LazyIndexReviews />
          <template #fallback>
            <div class="skeleton-loader" style="height: 300px;"></div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-poster-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.skeleton-loader {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
  margin: 20px 0;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
