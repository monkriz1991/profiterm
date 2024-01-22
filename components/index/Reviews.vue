<script setup>
const dialogVisible = ref(false);
const removeTagDialogs = ref({});
const { data: reviews } = await useFetch("/api/reviews/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const show = ref(null);

const showList = (item) => {
  dialogVisible.value = true;
  if (show.value === item) {
    show.value = null;
    //dialogVisible.value = false;
  } else {
    //dialogVisible.value = false;
    show.value = item;
  }
};
const sliseDesc = (item) => {
  let textInner = item.replace(/<[^>]+>/g, "").slice(0, 170) + "...";
  return textInner;
};
</script>

<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4><icon name="solar:chat-line-broken" />Отзывы наших клиентов</h4>
    </div>
    <div class="column is-12">
      <div class="reviews-slide">
        <Swiper
          :height="100"
          :space-between="20"
          :modules="[
            SwiperAutoplay,
            SwiperEffectCreative,
            SwiperNavigation,
            SwiperPagination,
          ]"
          :slides-per-view="1.5"
          :navigation="{
            next: true,
            prev: true,
          }"
          :loop="false"
          :autoplay="{
            delay: 70000,
            disableOnInteraction: true,
          }"
          :creative-effect="{
            prev: {
              shadow: false,
              translate: ['-20%', 0, -1],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }"
          :breakpoints="{
            300: {
              slidesPerView: 1,
            },
            680: {
              slidesPerView: 1,
            },
            1650: {
              slidesPerView: 2,
            },
          }"
        >
          <SwiperSlide
            v-for="(slide, idx) in reviews"
            :key="idx"
            :pagination="{ clickable: true, dynamicBullets: true }"
          >
            <div class="index-rew-block">
              <div class="index-rew-block-img">
                <img
                  v-for="(slideurl, idx) in slide.img"
                  :key="idx"
                  :src="slideurl.url"
                  :alt="slide.title"
                />
              </div>
              <div class="index-rew-block-desc">
                <strong>{{ slide.name }}</strong>

                <div
                  v-if="slide.description.length < 170"
                  v-html="sliseDesc(slide.description)"
                ></div>
                <div
                  v-else-if="slide.description.length > 170"
                  v-html="sliseDesc(slide.description)"
                ></div>
                <button
                  class="button is-white is-light mt-4"
                  @click="removeTagDialogs[slide._id] = true"
                >
                  <span class="icon"
                    ><Icon name="solar:square-bottom-up-broken"
                  /></span>
                  <span>Читать полностью</span>
                </button>
                <Teleport to="body">
                  <el-dialog
                    v-model="removeTagDialogs[slide._id]"
                    class="rev-dialog"
                    width="35%"
                  >
                    <div v-html="slide.description"></div>
                    <template #footer>
                      <span class="dialog-footer">
                        <button
                          class="button mr-3 is-light"
                          @click="removeTagDialogs[slide._id] = false"
                        >
                          Закрыть
                        </button>
                        <nuxt-link :to="`/project/` + slide.project">
                          <button
                            class="button is-danger"
                            type="primary"
                            @click="removeTagDialogs[slide._id] = false"
                          >
                            Перейти к проекту
                          </button>
                        </nuxt-link>
                      </span>
                    </template>
                  </el-dialog>
                </Teleport>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>
<style></style>
