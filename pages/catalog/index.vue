<script setup>
const route = useRoute();
const router = useRouter();
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(6);
if (router.currentRoute.value.query.page != undefined) {
  currentPage.value = parseInt(router.currentRoute.value.query.page);
  sortPage.value = currentPage.value * pageSize.value - pageSize.value;
}
const { data: project, refresh } = await useFetch("/api/project", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
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
  refresh();
};
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <nav-category />
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
                    :key="imgurl"
                    :src="imgurl.url"
                    loading="lazy"
                    format="wepb"
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
      <div
        v-if="
          project?.result &&
          project.result.length > 0 &&
          project.result[0].description
        "
        class="dscription-cat"
        v-html="project.result[0].description"
      ></div>
    </div>
  </div>
</template>
