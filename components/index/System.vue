<script setup>
const removeTagDialogs = ref({});
const { data: system } = await useFetch("/api/system/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
</script>

<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-12">
        <h4><icon name="solar:document-broken" />Системы</h4>
      </div>
      <div class="column is-12 m-flex">
        <div class="system-tabs">
          <ClientOnly>
            <el-tabs tab-position="left" class="demo-tabs">
              <el-tab-pane v-for="(tab, idx) in system" :key="idx">
                <template #label>
                  <span class="custom-tabs-label">
                    <strong>{{ tab.title }}</strong>
                    <p>{{ tab.info }}</p>
                  </span>
                </template>
                <ClientOnly>
                  <video
                    v-for="itemvideo in tab.video"
                    :key="itemvideo"
                    class=""
                    muted=""
                    autoplay=""
                    loop=""
                    webkit-playsinline=""
                    playsinline=""
                    :poster="itemvideo.img"
                    type="video/webm"
                    :src="itemvideo.url"
                  >
                    <source class="video-sourse" src="" type="video/mp4" />
                  </video>
                </ClientOnly>
                <!-- <div class="index-rew-block-img">
              <img
                v-for="(taburl, idx) in tab.img"
                :key="idx"
                :src="taburl.url"
                :alt="taburl.title"
              />
            </div> -->
                <div v-html="tab.description" class="mobail-tabs"></div
              ></el-tab-pane>
            </el-tabs>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
