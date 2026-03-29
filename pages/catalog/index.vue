<script setup>
const route = useRoute();
const router = useRouter();
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(6);
const description = ref("");

if (router.currentRoute.value.query.page != undefined) {
  currentPage.value = parseInt(router.currentRoute.value.query.page);
  sortPage.value = currentPage.value * pageSize.value - pageSize.value;
}

// Use lazy fetch for non-blocking initial render
const {
  data: project,
  refresh,
  pending,
} = await useLazyFetch("/api/projectindex", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: computed(() => ({
    sortPage: sortPage.value,
    pageSize: pageSize.value,
  })),
  server: true,
});
const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * pageSize.value - pageSize.value;
  }
  currentPage.value = val;
  router.replace({
    name: "catalog",
    query: {
      page: currentPage.value != 1 ? currentPage.value : undefined,
    },
  });
  // refresh();
  scrollToTop();
};
const catDescription = (item) => {
  description.value = item;
};
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <nav-category @catDescription="catDescription" />

        <!-- Loading skeleton -->
        <div v-if="pending" class="columns is-desktop is-multiline is-variable">
          <div class="column is-4" v-for="n in 6" :key="n">
            <div
              class="skeleton-loader"
              style="height: 250px; margin-bottom: 10px"
            ></div>
            <div
              class="skeleton-loader"
              style="height: 20px; width: 80%; margin-bottom: 8px"
            ></div>
            <div class="skeleton-loader" style="height: 16px; width: 60%"></div>
          </div>
        </div>

        <div v-else class="columns is-desktop is-multiline is-variable">
          <div
            class="column is-4"
            v-for="(item, index) in project?.result"
            :key="item._id"
          >
            <div
              class="catalog-block"
              v-if="Array.isArray(item.img) && item.img.length"
            >
              <nuxt-link :to="`/project/` + item.kirilica">
                <div class="catalog-block-img">
                  <NuxtImg
                    v-for="(imgurl, idx) in item.img"
                    :key="imgurl.url || idx"
                    :src="imgurl.url"
                    :loading="index < 3 ? 'eager' : 'lazy'"
                    decoding="async"
                    format="webp"
                    sizes="sm:100vw md:300px lg:400px"
                    :alt="item.title"
                  />
                </div>
                <div class="catalog-block-desc">
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
        <el-pagination
          v-if="project?.count"
          class="pagination-list"
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="project.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-if="description" class="dscription-cat" v-html="description"></div>
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
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
