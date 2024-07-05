<script setup>
const props = defineProps({
  video: {
    type: Object,
    default: {},
  },
});
const objectVideo = computed(() => props.video);
const visibleModal = ref(false);
const VideoObject = ref({});
const OpenModal = (item) => {
  visibleModal.value = true;
  VideoObject.value = item;
};
const visibleModalClose = (item) => {
  visibleModal.value = item;
};
</script>

<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4><icon name="solar:video-library-outline" />Видеообзоры</h4>
    </div>
    <div class="column is-12">
      <div class="video-slide">
        <Swiper
          :height="100"
          :space-between="30"
          :modules="[
            SwiperAutoplay,
            SwiperEffectCreative,
            SwiperNavigation,
            SwiperPagination,
          ]"
          :slides-per-view="1.3"
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
              slidesPerView: 1.3,
            },
            680: {
              slidesPerView: 3,
            },
            1650: {
              slidesPerView: 4,
            },
          }"
        >
          <SwiperSlide
            v-for="slide in objectVideo"
            :key="slide._id"
            :pagination="{ clickable: true, dynamicBullets: true }"
          >
            <NuxtImg
              v-for="(img, idx) in slide.img"
              :key="idx"
              :src="img.url"
              :alt="slide.title"
              sizes="sm:300px md:300px lg:300px"
              preload
              loading="lazy"
              format="wepb"
            />
            <div class="video-slide-bg" @click="OpenModal(slide)">
              <!-- <Icon name="formkit:youtube" /> -->
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="video-all">
          <nuxt-link to="/catalog">
            Все проекты
            <Icon name="ph:images-light" />
          </nuxt-link>
        </div>
      </div>
    </div>
    <index-ModalVideo
      v-model:visibleModal="visibleModal"
      v-model:VideoObject="VideoObject"
      @visibleModalClose="visibleModalClose"
    />
  </div>
</template>
