<script setup>
const { data: stage } = await useFetch("/api/stage/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const activeNames = ref("");
const handleChange = (val) => {
  // console.log(val);
};
</script>

<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4>
        <icon name="solar:case-round-minimalistic-linear" />Работать с нами
        просто
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
                :alt="itemurl.title"
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
</template>
<style></style>
