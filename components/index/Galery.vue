<script setup>
const props = defineProps({
  galery: {
    type: Array,
    default: () => [],
  },
  description: {
    type: String,
    default: "",
  },
});

const objectGalery = computed(() => props.galery);
const objectDesc = computed(() => props.description);

// Функция для сортировки массива по level, пустые значения перемещаются в конец
const sortGallery = (gallery) => {
  return gallery.slice().sort((a, b) => {
    const levelA = a.level ? parseInt(a.level) : Number.MAX_SAFE_INTEGER;
    const levelB = b.level ? parseInt(b.level) : Number.MAX_SAFE_INTEGER;
    return levelA - levelB;
  });
};

// Функция для разделения массива на подмассивы, первый подмассив будет содержать 5 элементов, остальные по 6 элементов
const chunkArraySpecial = (array) => {
  const result = [];
  if (array.length > 0) {
    result.push(array.slice(0, 5)); // Первый подмассив с 5 элементами
  }
  for (let i = 5; i < array.length; i += 6) {
    result.push(array.slice(i, i + 6)); // Остальные подмассивы с 6 элементами
  }
  return result;
};

// Объединение всех изображений в один массив
const allImages = computed(() => {
  return sortGallery(objectGalery.value).reduce((acc, slide) => {
    return acc.concat(slide.img);
  }, []);
});

// Разделение на подмассивы
const chunkedImages = computed(() => {
  return chunkArraySpecial(allImages.value);
});

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

const currentIndex = ref(0);

const onSlideChangeGal = (swiper) => {
  currentIndex.value = swiper.realIndex;
};
</script>
<template>
  <div>
    <div class="gall-slider">
      <div class="columns is-multiline">
        <div class="column is-12 m-none">
          <h4 class="mt-6 mb-6">
            <icon name="solar:gallery-wide-broken" /> Галерея
          </h4>
        </div>
        <div class="column is-6">
          <div class="index-gall-desc">
            <div v-html="objectDesc"></div>
          </div>
        </div>
        <div class="column is-12 m-block">
          <h4 class="mt-6 mb-6">
            <icon name="solar:gallery-wide-broken" /> Галерея
          </h4>
        </div>
        <div class="column is-6 p-0">
          <div class="slider">
            <div class="slider-one">
              <ClientOnly>
                <Swiper
                  :height="300"
                  :space-between="0"
                  :modules="[
                    SwiperAutoplay,
                    SwiperEffectCreative,
                    SwiperNavigation,
                    SwiperPagination,
                  ]"
                  :slides-per-view="1"
                  :navigation="{
                    nextEl: '.swiper-button-prev-gal',
                    prevEl: '.swiper-button-next-gal',
                  }"
                  :loop="false"
                  @slideChange="onSlideChangeGal"
                >
                  <SwiperSlide
                    v-for="(slide, index) in chunkedImages"
                    :key="index"
                  >
                    <div
                      v-for="(img, idx) in slide"
                      :key="idx"
                      class="image-grid"
                      :alt="`Фото галерея  ${index}`"
                      :class="{
                        [`image-${idx + 1}`]: index !== 0,
                        [`image-${idx + 1}-spechal`]: index === 0,
                      }"
                    >
                      <NuxtImg
                        :src="img.url"
                        :alt="`Фото проета галереи ${index * 6 + idx + 1}`"
                        data-fancybox="galery project"
                        sizes="sm:300px md:300px lg:300px"
                        preload
                        loading="lazy"
                        format="wepb"
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </ClientOnly>
            </div>
            <div class="slider-one-navigation sl-m">
              <div
                class="swiper-button-next-gal"
                :class="{ opacitynull: currentIndex === 0 }"
              >
                <div v-html="iconSvg" class="slider-one-svg"></div>
                <span>Раньше</span>
              </div>

              <div class="swiper-button-prev-gal">
                <span>Больше</span>
                <div v-html="iconSvg" class="slider-one-svg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
