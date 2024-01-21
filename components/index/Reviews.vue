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
  let textInner = item.replace(/<[^>]+>/g, "").slice(0, 200) + "...";
  return textInner;
};
</script>

<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4><icon name="solar:document-broken" />Отзывы наших клиентов</h4>
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
                  v-if="slide.description.length < 200"
                  v-html="sliseDesc(slide.description)"
                ></div>
                <div
                  v-else-if="slide.description.length > 200"
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
                <ClientOnly>
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
                              class="button is-success"
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
                </ClientOnly>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>
<style>
.reviews-slide {
  margin: 0 0 80px;
}
.reviews-slide .swiper-slide {
  position: relative;
  padding: 0px 0px 0px 0;
  float: left;
  /* width: 100% !important; */
  margin: 0 0 0px;
  height: 220px;
}
.index-rew {
}
.index-rew-block {
  float: left;
  width: 100%;
}
.index-rew-block-img {
  float: left;
  width: 200px;
  height: 220px;
}
.index-rew-block-img img {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: 17px;
  cursor: pointer;
}
.index-rew-block-desc {
  margin: 0 0 0 230px;
  padding: 0 20px 0 0;
}
.index-rew-block-desc > strong {
  font-size: 18px;
  margin: 0 0 15px;
  float: left;
  width: 100%;
}
.index-rew-block-desc > div {
  font-size: 15px;
  line-height: 1.6;
}
.reviews-slide .swiper-button-next,
.reviews-slide .swiper-button-prev {
  background: rgb(0 0 0 / 35%);
}
.reviews-slide .index-rew-block-desc p {
  margin-bottom: 10px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.rev-dialog {
  border-radius: 17px;
  padding: 25px;
}
.rev-dialog .el-dialog__body p {
  font-size: 16px;
  margin: 0 0 10px;
  line-height: 1.5;
}
</style>
