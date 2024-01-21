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
  <div class="container">
    <div v-for="item in project" :key="item">
      <div class="content">
        <div class="columns">
          <div class="column is-12">
            <Breadcrumb />
          </div>
        </div>
        <div class="columns">
          <div class="column is-8">
            <el-page-header @click="$router.back()"> </el-page-header>
            <h1>{{ item.title }}</h1>
          </div>
        </div>

        <div class="columns is-multiline">
          <div class="column is-12">
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
</template>
<style>
.project-block {
}
.project-item {
  float: left;
  width: 100%;
}

.PhotoConsumer {
  float: left;
  width: 55%;
  border-radius: 12px;
  background: #fff;
  height: 300px;
}
.PhotoConsumer img {
  height: 100%;
  width: 100%;
  -o-object-fit: contain;
  object-fit: contain;
}
.project-block-info {
  float: left;
  width: 100%;
  padding: 0 0px 0 0px;
}
.product-block-desc {
  float: left;
  width: 80%;
  padding: 50px 30px 0 0px;
}
.product-order-block button {
  border-radius: 10px;
  font-size: 16px !important;
  font-weight: 600;
  padding: 24px !important;
}
.product-order-block-price {
  float: left;
  width: 100%;
  margin: 0 0 20px;
}
.product-order-block-price > strong {
  font-size: 40px;
  font-weight: 600;
}
.product-order-block-price > span {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 0 5px;
}
.project-block-city {
}
.project-galeery {
  height: 420px;
}
.project-galeery-mini {
  height: 222px;
  width: 50%;
  float: left;
  padding: 0.75rem;
}
.project-galeery img,
.project-galeery-mini img {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: 17px;
  cursor: pointer;
}
.project-video {
  float: left;
  width: 100%;
  margin: 80px 0 70px;
  height: 550px;
  border-radius: 17px;
  overflow: hidden;
}
.project-video .plyr--video {
  height: 100%;
}
.project-block-desc {
  float: left;
  width: 100%;
  margin: 0px 0 70px;
  font-size: 16px;
}
</style>
