<script setup>
const { data: stage } = await useFetch("/api/stage/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  lazy: true,
});
const activeNames = ref("");
const handleChange = (val) => {
  // console.log(val);
};
const iconSvg =
  ref(`<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="744.000000pt" height="1052.000000pt" viewBox="0 0 744.000000 1052.000000" preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,1052.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
<path d="M1682 8473 c-536 -759 -926 -1903 -1022 -2998 -18 -209 -23 -569 -11
-755 42 -614 176 -1063 435 -1445 79 -118 273 -312 391 -392 512 -346 1198
-373 2076 -82 321 106 479 179 1464 675 709 357 682 335 329 268 -304 -57
-446 -103 -779 -254 -774 -351 -1535 -533 -2055 -490 -242 20 -406 62 -597
155 -476 232 -767 732 -858 1479 -121 988 134 2445 678 3869 14 37 24 67 22
67 -2 0 -35 -44 -73 -97z"></path>
<path d="M4955 4762 c32 -31 560 -366 660 -418 180 -94 384 -154 522 -154 54
0 54 0 -15 -102 -67 -100 -207 -340 -291 -500 -317 -603 -493 -1184 -452
-1490 11 -82 35 -167 45 -157 2 2 50 114 106 249 120 289 132 311 402 764 140
234 250 405 332 515 358 482 536 808 536 985 0 80 -51 137 -135 150 -22 4
-170 -3 -330 -15 -320 -23 -517 -22 -645 6 -82 18 -693 162 -725 172 -13 3
-17 2 -10 -5z"></path>
</g>
</svg>`);
</script>

<template>
  <div>
    <div class="columns is-multiline diagonal">
      <div class="column is-12">
        <h4 class="stage-h4">
          Работать с нами просто
          <div v-html="iconSvg" class="work-svg"></div>
        </h4>
      </div>
      <div class="column is-12">
        <div class="stage-index">
          <ElCollapse v-model="activeNames" @change="handleChange" accordion>
            <ElCollapseItem
              v-for="item in stage"
              :key="item._id"
              :name="item.level"
            >
              <template #title>
                <Icon :name="item.icon" />
                {{ item.title }}
              </template>
              <div class="stage-index-desc" v-html="item.description"></div>

              <div class="stage-index-img">
                <NuxtImg
                  v-for="(itemurl, idx) in item.img"
                  :key="idx"
                  :src="itemurl.url"
                  :alt="`Фото этапа ${idx + 1} / ${item.title}`"
                  data-fancybox="galery stage"
                  loading="lazy"
                  format="wepb"
                />
              </div>
            </ElCollapseItem>
          </ElCollapse>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
