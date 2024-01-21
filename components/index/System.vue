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
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4><icon name="solar:document-broken" />Системы</h4>
    </div>
    <div class="column is-12">
      <div class="system-tabs">
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
            <div v-html="tab.description"></div
          ></el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<style>
.system-tabs {
  float: left;
  width: 100%;
  margin: 20px 0 100px;
}
.system-tabs .el-tabs__content {
  overflow: visible;
}
.system-tabs .el-tabs--left .el-tabs__active-bar.is-left {
  left: 0;
  width: 4px;
  border-radius: 5px;
}
.system-tabs .el-tabs--left .el-tabs__nav-wrap.is-left::after {
  width: 0;
}
.system-tabs .el-tabs__header {
  width: 35%;
  margin-right: 0px !important;
}
.el-tabs {
  overflow: visible;
}
.system-tabs .el-tabs__nav {
  width: 100%;
}
.system-tabs .custom-tabs-label > strong {
  float: left;
  width: 100%;
  font-size: 17px;
  color: #a2a2a2;
}
.system-tabs .custom-tabs-label > p {
  float: left;
  width: 100%;
  font-size: 15px;
  margin: 10px 0;
  line-height: 1.6;
  color: #a2a2a2;
}

.system-tabs .is-active strong,
.system-tabs .is-active p {
  color: #333;
}
.system-tabs .el-tabs__item:hover strong,
.system-tabs .el-tabs__item:hover p {
  transition: 0.2s;
  color: #333;
}
.system-tabs .el-tabs__item.is-left {
  text-align: left;
  font-size: 19px;
  padding: 20px 15px 15px 35px;
  float: right;
  width: 100%;
  height: auto;
  display: block;
  white-space: break-spaces;
  margin: 0 0 20px;
}

.system-tabs .el-tab-pane {
  padding: 0px 0% 0 10%;
  overflow: visible;
  float: left;
  width: 65%;
}
.system-tabs video {
  height: auto;
  max-width: 100%;
  width: 100%;
  height: 460px;
  border-radius: 18px;
  overflow: hidden;
  object-fit: cover;
  margin: 0 0 40px;
  box-shadow: rgba(0, 12, 121, 0.1) 0px 30px 80px,
    rgba(0, 12, 121, 0.1) 0px 12px 24px;
}
</style>
