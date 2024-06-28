<script setup>
const dialogVisible = ref(false);
const removeTagDialogs = ref({});
const projectData = ref({});
const galery = ref([]);
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
  } else {
    show.value = item;
  }
};

const sliseDesc = (item) => {
  return item.replace(/<[^>]+>/g, "").slice(0, 100) + "...";
};

const iconSvg = ref(`
<svg
  version="1.0"
  xmlns="http://www.w3.org/2000/svg"
  width="700.000000pt"
  height="512.000000pt"
  viewBox="0 0 700.000000 512.000000"
  preserveAspectRatio="xMidYMid meet"
>
  <g
    transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
    fill="#000000"
    stroke="none"
  >
    <path
      d="M4990 3770 c-333 -50 -687 -135 -936 -225 -199 -73 -187 -63 -182
      -151 3 -41 7 -76 9 -78 2 -2 20 -7 40 -11 30 -6 37 -4 41 12 4 15 39 26 189
      61 225 52 472 103 476 98 2 -2 -40 -29 -94 -61 -521 -309 -1091 -780 -1743
      -1441 -487 -494 -737 -839 -889 -1228 -40 -102 -47 -145 -32 -209 5 -26 9 -21
      42 56 81 190 252 437 519 747 512 596 993 1038 1600 1472 216 154 679 463 859
      573 23 14 8 -6 -170 -217 -94 -110 -177 -211 -186 -224 -16 -25 -16 -30 6
      -182 l6 -44 100 118 c268 315 321 382 392 501 25 43 59 110 74 150 25 62 29
      85 29 171 0 97 -5 133 -19 131 -3 0 -62 -9 -131 -19z"
    ></path>
  </g>
</svg>
`);

const fetchProjectData = async (projectId) => {
  const { data: project } = await useFetch(() => `/api/projectitem/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: projectId,
  });
  if (project.value) {
    projectData.value[projectId] = project.value;
    galery.value = project.value[0].galery;
  }
};
</script>
<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4><icon name="solar:chat-line-broken" />Отзывы наших клиентов</h4>
      <span class="publick-review"
        >Если Вы были нашим клиентом, отправьте свой отзыв, мы его обязательно
        опубликуем.</span
      >
      <ModalReview />
    </div>
    <div class="column is-12">
      <div class="reviews-slide">
        <Swiper
          :height="100"
          :space-between="20"
          :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
          :slides-per-view="1.5"
          :navigation="{
            nextEl: '.swiper-button-prev',
            prevEl: '.swiper-button-next',
          }"
          :autoplay="{
            delay: 70000,
            disableOnInteraction: true,
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
          <SwiperSlide v-for="(slide, idx) in reviews" :key="idx">
            <div class="index-rew-block">
              <div class="index-rew-block-img">
                <NuxtImg
                  v-for="(slideurl, idx) in slide.img"
                  :key="idx"
                  :src="slideurl.url"
                  :alt="slide.title"
                  loading="lazy"
                  format="webp"
                />
              </div>
              <div class="index-rew-block-desc">
                <strong>{{ slide.name }}</strong>

                <div
                  v-if="slide.description.length < 120"
                  v-html="sliseDesc(slide.description)"
                ></div>
                <div
                  v-else-if="slide.description.length > 120"
                  v-html="sliseDesc(slide.description)"
                ></div>
                <button
                  class="button is-white is-light button-rew-index"
                  @click="
                    removeTagDialogs[slide._id] = true;
                    fetchProjectData(slide.project);
                  "
                >
                  <span class="icon">
                    <Icon name="solar:square-bottom-up-broken" />
                  </span>
                  <span>Читать полностью</span>
                </button>
                <ClientOnly>
                  <Teleport to="body">
                    <el-dialog
                      v-model="removeTagDialogs[slide._id]"
                      class="rev-dialog"
                      width="50%"
                    >
                      <div v-if="projectData[slide.project]">
                        <Swiper
                          :height="100"
                          :space-between="10"
                          :slides-per-view="1.5"
                          :breakpoints="{
                            300: {
                              slidesPerView: 1.5,
                            },
                            680: {
                              slidesPerView: 2,
                            },
                            1650: {
                              slidesPerView: 3,
                            },
                          }"
                          :loop="false"
                        >
                          <SwiperSlide
                            v-for="(slide, idx) in galery"
                            :key="idx"
                          >
                            <div class="index-rew-slider-img">
                              <NuxtImg
                                :src="slide.url"
                                :alt="slide.title"
                                loading="lazy"
                                format="webp"
                              />
                            </div>
                          </SwiperSlide>
                        </Swiper>
                      </div>
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
                              class="button button-rew-modal"
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
        <div class="slider-one-navigation nav-review">
          <div class="swiper-button-next">
            <div v-html="iconSvg" class="slider-one-svg"></div>
            <span>Предыдущие</span>
          </div>

          <div class="swiper-button-prev">
            <span>Ещё</span>
            <div v-html="iconSvg" class="slider-one-svg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
