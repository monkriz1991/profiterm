<script setup>
import { useWindowSize } from "@vueuse/core";
const removeTagDialogs = ref({});
const isWidth = ref("left");
const activeName = ref("first0");
const activeNameW = ref("first0");
const infoNone = ref(true);

const { data: system } = await useFetch("/api/system/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const { width } = useWindowSize();
const windowWidth = ref(width.value);

const widtFun = () => {
  if (width.value <= 700) {
    isWidth.value = "top";
    infoNone.value = false;
  } else {
    isWidth.value = "left";
    infoNone.value = true;
  }
};
watchEffect(() => {
  widtFun();
});
</script>

<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-12">
        <h4><icon name="solar:document-broken" />Системы</h4>
      </div>
      <div class="column is-12">
        <ClientOnly>
          <div :class="!infoNone ? 'system-tabs-mobail' : 'system-tabs'">
            <el-tabs :tab-position="isWidth" class="" v-model="activeName">
              <el-tab-pane
                :name="`first` + idx"
                v-for="(tab, idx) in system"
                :key="idx"
              >
                <template #label>
                  <span class="custom-tabs-label">
                    <strong>{{ tab.title }}</strong>

                    <p v-if="tab.info" v-show="infoNone">{{ tab.info }}</p>
                  </span>
                </template>
                <ClientOnly>
                  <div v-if="infoNone">
                    <el-affix target=".system-tabs" :offset="0">
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

                      <div v-html="tab.description" class="mobail-tabs"></div>
                    </el-affix>
                  </div>
                  <div v-else>
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

                    <div v-html="tab.description" class="mobail-tabs"></div>
                  </div>
                </ClientOnly>
              </el-tab-pane>
            </el-tabs>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
<style></style>
