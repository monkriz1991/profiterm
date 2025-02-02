<script setup>
const route = useRoute();
const router = useRouter();
const h1Category = ref("Статьи");
const breadcrumbLinks = ref([]);
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(28);
const seoTitle = ref(
  "Статьи по монтажу систем отопления, водоснабжения и канализации."
);
const seoDescription = ref(
  "У нас вы узнаете особенности устройства тёплых полов, котельных, систем водоснабжения и канализации."
);
const seoTImg = ref("https://profiterm.by/profiterm.webp");

if (router.currentRoute.value.query.page !== undefined) {
  currentPage.value = parseInt(router.currentRoute.value.query.page);
  sortPage.value = currentPage.value * pageSize.value - pageSize.value;
}

const { data: news, refresh } = await useFetch("/api/news", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});

// Создаём отсортированные массивы
const level1 = computed(
  () => news.value?.result.filter((item) => item.level === 1) || []
);
const level2And3 = computed(
  () =>
    news.value?.result.filter((item) => item.level === 2 || item.level === 3) ||
    []
);
const otherLevels = computed(
  () => news.value?.result.filter((item) => item.level > 3) || []
);

const handleCurrentChange = (val) => {
  sortPage.value = val === 1 ? 0 : val * pageSize.value - pageSize.value;
  currentPage.value = val;
  router.replace({
    name: "articles",
    query: {
      page: currentPage.value !== 1 ? currentPage.value : undefined,
    },
  });
  refresh();
  scrollToTop();
};

watchEffect(() => {
  const toPath = route.params.id ? `/articles/${route.params.id}` : "/articles";
  breadcrumbLinks.value = [
    { label: "Главная", to: "/" },
    { label: h1Category.value, to: toPath },
  ];
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
useSeoMeta({
  title: seoTitle.value,
  ogTitle: seoTitle.value,
  description: seoDescription.value,
  ogDescription: seoDescription.value,
  ogImage: seoTImg.value,
  twitterCard: "summary_large_image",
});
</script>
<template>
  <div class="bd-docs-main main-article">
    <div class="container">
      <div class="content">
        <Breadcrumb :links="breadcrumbLinks" />
        <h1 class="h1-catalog">{{ h1Category }}</h1>
        <div class="columns is-desktop is-multiline is-variable">
          <div class="column is-8" v-for="item in level1" :key="item._id">
            <div class="article-block-top">
              <nuxt-link :to="`/article/` + item.kirilica">
                <div class="article-block-top-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl"
                    :src="imgurl.url"
                    loading="lazy"
                    format="wepb"
                    :alt="item.title"
                  />
                  <div class="article-block-top-desc">
                    <strong>
                      {{ item.title }}
                    </strong>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
          <div class="column is-4">
            <div
              class="article-block-top-right"
              v-for="item in level2And3"
              :key="item._id"
            >
              <nuxt-link :to="`/article/` + item.kirilica">
                <div class="article-block-top-right-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl"
                    :src="imgurl.url"
                    loading="lazy"
                    format="wepb"
                    :alt="item.title"
                  />
                  <div class="article-block-top-right-desc">
                    <strong>
                      {{ item.title }}
                    </strong>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
          <!-- <div class="column is-12"></div> -->
          <div class="column is-12">
            <div
              class="article-block"
              v-for="item in otherLevels"
              :key="item._id"
            >
              <nuxt-link :to="`/article/` + item.kirilica">
                <div class="article-block-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl"
                    :src="imgurl.url"
                    loading="lazy"
                    format="wepb"
                    :alt="item.title"
                  />
                </div>
                <div class="article-block-desc">
                  <strong>
                    {{ item.title }}
                  </strong>
                  <span>
                    {{ item.preview }}
                  </span>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
