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

const { data: project, refresh } = await useFetch("/api/projectindex", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: computed(() => ({
    sortPage: sortPage.value,
    pageSize: pageSize.value,
  })),
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
        <div class="columns is-desktop is-multiline is-variable">
          <div
            class="column is-4"
            v-for="item in project.result"
            :key="item._id"
          >
            <div
              class="catalog-block"
              v-if="Array.isArray(item.img) && item.img.length"
            >
              <nuxt-link :to="`/project/` + item.kirilica">
                <div class="catalog-block-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl"
                    :src="imgurl.url"
                    preload
                    format="wepb"
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
