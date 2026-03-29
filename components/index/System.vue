<script setup>
import { useWindowSize } from "@vueuse/core";
import { ref, computed, watchEffect, nextTick, onMounted } from "vue";

const isWidth = ref("left");
const activeName = ref("first0");
const infoNone = ref(true);
const loadedVideos = ref({}); // Отслеживание загруженных видео

const { data: system } = await useFetch("/api/system/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  lazy: true, // Ожидание запроса до момента использования
});

// Сортируем данные после загрузки
const sortedSystem = computed(() => {
  return system.value
    ? [...system.value].sort((a, b) => a.level - b.level)
    : [];
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

// Загружаем видео при смене вкладки
const loadVideo = async (tabKey) => {
  if (!loadedVideos.value[tabKey]) {
    loadedVideos.value[tabKey] = true;
    await nextTick(); // Ждем обновления DOM перед загрузкой
  }
};

// Загружаем первое видео сразу при монтировании
onMounted(() => {
  loadedVideos.value["first0"] = true;
});
</script>

<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-12">
        <h4><icon name="solar:document-broken" />Инженерные Системы</h4>
      </div>
      <div class="column is-12">
        <ClientOnly>
          <div :class="!infoNone ? 'system-tabs-mobail' : 'system-tabs'">
            <el-tabs
              :tab-position="isWidth"
              v-model="activeName"
              @tab-click="(tab) => loadVideo(tab.paneName)"
            >
              <el-tab-pane
                v-for="(tab, idx) in sortedSystem"
                :key="idx"
                :name="'first' + idx"
              >
                <template #label>
                  <span class="custom-tabs-label">
                    <strong>{{ tab.title }}</strong>
                    <p v-if="tab.info" v-show="infoNone">{{ tab.info }}</p>
                  </span>
                </template>

                <div v-if="loadedVideos['first' + idx]">
                  <video
                    v-for="itemvideo in tab.video"
                    :key="itemvideo.url"
                    class="lazy-video"
                    muted
                    autoplay
                    loop
                    webkit-playsinline
                    playsinline
                    :poster="itemvideo.img"
                    type="video/webm"
                    :src="itemvideo.url"
                  >
                    <source class="video-source" src="" type="video/mp4" />
                  </video>
                  <div v-html="tab.description" class="mobail-tabs"></div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
