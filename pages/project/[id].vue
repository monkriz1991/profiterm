<script setup>
const route = useRoute();
const router = useRouter();
const { data: project } = useFetch(() => "/api/projectitem/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: route.params.id,
});
const plyrStart = async () => {
  const Plyr = await import("plyr");
  const newPlayer = new Plyr.default("#player");
};
onMounted(() => {
  setTimeout(() => {
    plyrStart();
  }, 10);
});
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <div v-for="item in project" :key="item">
        <div class="content">
          <!-- <div class="columns">
            <div class="column is-12">
              <Breadcrumb />
            </div>
          </div> -->
          <div class="columns">
            <div class="column is-8">
              <el-page-header @click="$router.back()"> </el-page-header>
              <h1>{{ item.title }}</h1>
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
                  <div class="columns is-multiline">
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
              <div
                v-if="item.video"
                id="player"
                data-plyr-provider="youtube"
                :data-plyr-embed-id="item.video"
              ></div>
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
