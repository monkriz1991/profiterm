<script setup>
const route = useRoute();
const router = useRouter();
const visiblePlyr = ref(false);
const breadcrumbLinks = ref([]);

const { data: project, error } = useFetch("/api/projectitem/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: route.params.id, // Предполагая, что API принимает JSON-объект с идентификатором
});

watchEffect(() => {
  if (project.value && project.value.length > 0) {
    const item = project.value[0];
    breadcrumbLinks.value = [
      { label: "Главная", to: "/" },
      { label: "Раздел", to: `/catalog/${item.category}` },
      { label: item.title, to: `/project/${item.kirilica}` },
    ];
  }
});

onMounted(async () => {
  setTimeout(() => {
    visiblePlyr.value = true;
  }, 1000); // Устанавливайте нужную вам задержку (в миллисекундах)
});
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="content">
        <div v-if="error">{{ error.message }}</div>
        <div v-else v-for="item in project" :key="item._id">
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
              <!-- <div class="project-block-info">{{ item.info }}</div> -->
              <div class="columns is-multiline">
                <div class="column is-6">
                  <div class="project-galeery">
                    <img
                      v-for="imgurl in item.img"
                      :key="imgurl"
                      :src="imgurl.url"
                      class="view-box"
                      data-fancybox="galery galery"
                    />
                  </div>
                </div>
                <div class="column is-6">
                  <div class="columns is-multiline mobail-colums-gal">
                    <div
                      v-for="(imgurl, idx) in item.galery"
                      :key="imgurl"
                      class="project-galeery-mini"
                      v-show="idx < 4"
                    >
                      <img
                        :src="imgurl.url"
                        class="view-box"
                        data-fancybox="galery galery"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="project-video">
              <ProjectVideo
                v-model:VideoObject="item.video"
                v-model:visiblePlyr="visiblePlyr"
              />
            </div>
          </div>
          <div class="columns">
            <div class="column is-12">
              <div class="project-block-desc" v-html="item.description"></div>
            </div>
          </div>
          <ProjectReviews v-model:params="route.params.id" />
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
