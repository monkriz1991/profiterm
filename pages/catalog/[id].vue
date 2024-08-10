<script setup>
const route = useRoute();
const router = useRouter();
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(6);
const description = ref("");

// Update the current page and sortPage based on the query parameter
if (router.currentRoute.value.query.page !== undefined) {
  currentPage.value = parseInt(router.currentRoute.value.query.page, 10);
  sortPage.value = currentPage.value * pageSize.value - pageSize.value;
}

// Fetch project data from API
const { data: project, refresh } = await useFetch("/api/project", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: JSON.stringify({
    ParamsCat: route.params.id,
    sortPage: sortPage.value,
    pageSize: pageSize.value,
  }),
});

// Handle page changes
const handleCurrentChange = (val) => {
  if (val === 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * pageSize.value - pageSize.value;
  }
  currentPage.value = val;
  router.replace({
    name: "catalog-id",
    query: {
      page: currentPage.value !== 1 ? currentPage.value : undefined,
    },
  });
  refresh();
  scrollToTop();
};

// Set the description for the category
const catDescription = (item) => {
  console.log(item);
  description.value = item;
};

// Scroll to the top of the page
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <!-- Navigation component for category -->
        <nav-category @catDescription="catDescription" />

        <!-- Display project items in a grid layout -->
        <div class="columns is-desktop is-multiline is-variable">
          <div
            class="column is-4"
            v-for="item in project.result"
            :key="item._id"
          >
            <div class="catalog-block">
              <nuxt-link :to="`/project/` + item.kirilica">
                <div class="catalog-block-img">
                  <NuxtImg
                    v-for="imgurl in item.img"
                    :key="imgurl.url"
                    :src="imgurl.url"
                    loading="lazy"
                    format="webp"
                    :alt="item.title"
                  />
                </div>
                <div class="catalog-block-desc">
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.preview }}</span>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>

        <!-- Pagination component -->
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

      <!-- Display description if available -->

      <div class="dscription-cat" v-if="description" v-html="description"></div>
    </div>
  </div>
</template>
