<script setup>
const props = defineProps({
  galery: {
    type: Object,
    default: {},
  },
  description: {
    type: String,
    default: "",
  },
});
const objectGalery = computed(() => props.galery);
const objectDesc = computed(() => props.description);
</script>

<template>
  <div class="gall-slider">
    <div class="columns is-multiline">
      <div class="column is-12">
        <h4 class="mt-6 mb-6">
          <icon name="solar:gallery-wide-broken" />Галерея
        </h4>
      </div>
      <div class="column is-6">
        <div class="index-gall-desc">
          <div v-html="objectDesc"></div>
        </div>
      </div>
      <div class="column is-6">
        <div class="slider">
          <div class="slider-one">
            <ClientOnly>
              <Swiper
                :height="300"
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
                :pagination="{ clickable: true, dynamicBullets: true }"
                :loop="true"
                :effect="'creative'"
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
              >
                <SwiperSlide
                  v-for="slide in objectGalery"
                  :key="slide._id"
                  :pagination="{ clickable: true, dynamicBullets: true }"
                >
                  <NuxtImg
                    v-for="(img, idx) in slide.img"
                    :key="idx"
                    :src="img.url"
                    :alt="slide.title"
                    format="webp"
                    data-fancybox="galery a"
                    loading="lazy"
                  ></NuxtImg>
                </SwiperSlide>
              </Swiper>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
