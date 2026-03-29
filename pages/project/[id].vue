<script setup>
const route = useRoute();
const router = useRouter();
const visiblePlyr = ref(false);
const breadcrumbLinks = ref([]);
const seoTitle = ref("");
const seoTImg = ref("");
const seoDescription = ref("");
const error = ref(null);

// Lazy async component for video
const LazyProjectVideo = defineAsyncComponent(() => import("~/components/project/Video.vue"));
const LazyProjectReviews = defineAsyncComponent(() => import("~/components/project/Reviews.vue"));

// Use useAsyncData for non-blocking fetch with caching
const { data: project, pending } = await useAsyncData(
  `project-${route.params.id}`,
  () => $fetch("/api/projectitem/", {
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

// Watch for data changes to set SEO
watch(project, (newProject) => {
  if (newProject && newProject.length > 0) {
    const item = newProject[0];
    seoTitle.value = item.seo_title || "";
    seoDescription.value = item.seo_description || "";
    seoTImg.value = item.img?.[0]?.url || "";
    
    breadcrumbLinks.value = [
      { label: "Главная", to: "/" },
      { label: "Раздел", to: `/catalog/${item.category}` },
      { label: item.title, to: `/project/${item.kirilica}` },
    ];
  }
}, { immediate: true });

onMounted(() => {
  // Deferred video player initialization
  requestIdleCallback?.(() => {
    visiblePlyr.value = true;
  }) || setTimeout(() => {
    visiblePlyr.value = true;
  }, 500);
});

useSeoMeta({
  title: () => seoTitle.value,
  ogTitle: () => seoTitle.value,
  description: () => seoDescription.value,
  ogDescription: () => seoDescription.value,
  ogImage: () => seoTImg.value,
  twitterCard: "summary_large_image",
});
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <div v-if="error">{{ error.message }}</div>
        
        <!-- Loading skeleton -->
        <div v-if="pending" class="project-skeleton">
          <div class="skeleton-loader" style="height: 32px; width: 60%; margin-bottom: 20px;"></div>
          <div class="columns is-multiline">
            <div class="column is-6">
              <div class="skeleton-loader" style="height: 300px;"></div>
            </div>
            <div class="column is-6">
              <div class="skeleton-loader" style="height: 140px; margin-bottom: 10px;"></div>
              <div class="skeleton-loader" style="height: 140px;"></div>
            </div>
          </div>
        </div>
        
        <template v-else-if="project">
          <div v-for="(item, index) in project" :key="item._id">
            <ClientOnly>
              <Breadcrumb :links="breadcrumbLinks" />
            </ClientOnly>
            <div class="columns">
              <div class="column is-8">
                <h1 class="h1-project">{{ item.title }}</h1>
              </div>
            </div>

            <div class="project-block">
              <div class="project-item">
                <div class="project-block-city">{{ item.preview }}</div>
                <div class="columns is-multiline">
                  <div class="column is-6">
                    <div class="project-galeery">
                      <NuxtImg
                        v-for="(imgurl, idx) in item.img"
                        :key="imgurl.url || idx"
                        :src="imgurl.url"
                        :alt="`Фото проекта ${item.title}`"
                        class="view-box"
                        sizes="sm:100vw md:400px lg:500px"
                        data-fancybox="galery galery"
                        :loading="idx === 0 ? 'eager' : 'lazy'"
                        decoding="async"
                        format="webp"
                      />
                    </div>
                  </div>
                  <div class="column is-6">
                    <div class="columns is-multiline mobail-colums-gal">
                      <div
                        v-for="(imgurl, idx) in item.galery"
                        :key="imgurl.url || idx"
                        class="project-galeery-mini"
                      >
                        <NuxtImg
                          :src="imgurl.url"
                          class="view-box"
                          data-fancybox="galery galery"
                          :alt="`Фото проекта ${idx + 1} / ${item.title}`"
                          sizes="sm:150px md:200px lg:300px"
                          loading="lazy"
                          decoding="async"
                          format="webp"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.video" class="project-video">
                <ClientOnly>
                  <Suspense>
                    <LazyProjectVideo
                      v-model:VideoObject="item.video"
                      v-model:visiblePlyr="visiblePlyr"
                    />
                    <template #fallback>
                      <div class="skeleton-loader" style="height: 200px;"></div>
                    </template>
                  </Suspense>
                </ClientOnly>
              </div>
            </div>
            <div class="columns">
              <div class="column is-12">
                <div class="project-block-desc" v-html="item.description"></div>
              </div>
            </div>
            <Suspense>
              <LazyProjectReviews v-model:params="route.params.id" />
              <template #fallback>
                <div class="skeleton-loader" style="height: 150px;"></div>
              </template>
            </Suspense>
          </div>
        </template>
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
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
