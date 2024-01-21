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
      <h4><icon name="solar:document-broken" />Работать с нами просто</h4>
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
              <img
                v-for="(itemurl, idx) in item.img"
                :key="idx"
                :src="itemurl.url"
                :alt="itemurl.title"
                data-fancybox="galery"
              />
            </div>
          </ElCollapseItem>
        </ElCollapse>
      </div>
    </div>
  </div>
</template>
<style>
.stage-index {
  margin: 0px 0 100px;
}
.stage-index .el-collapse {
  border-top: 1px solid #c1c1c1;
}
.stage-index .el-collapse-item__header {
  background: transparent;
  padding: 50px 45px;
  height: auto;
  border-bottom: 1px solid #c1c1c1;
  font-size: 21px;
  font-weight: 700;
  text-align: left;
  line-height: 1.5;
}
.stage-index .el-collapse-item__header .icon {
  margin: 0 20px 0 0;
}
.stage-index .el-collapse-item__wrap {
  background: transparent;
  border-bottom: 1px solid #c1c1c1;
  padding: 0px 45px 0px;
}
.stage-index .el-collapse-item__header.is-active {
  border-bottom: 1px solid transparent;
}
.stage-index-desc {
  font-size: 16px;
  line-height: 1.4;
}
.stage-index-desc li {
  margin: 0 0 10px;
  line-height: 1.4;
}
.stage-index-img {
  float: left;
  width: 100%;
  padding: 40px 0 40px;
}
.stage-index-img img {
  float: left;
  width: 180px;
  height: 150px;
  border-radius: 14px;
  margin: 0 25px 20px 0;
}
</style>
