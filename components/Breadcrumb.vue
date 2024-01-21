<script setup>
const route = useRoute();
const pathName = ref("");
const pathLink = ref("");
const { data: category } = await useFetch("/api/category/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
if (route.params.id != "/" && route.params.id != undefined) {
  for (let item in category) {
    for (let iteminArr in category[item]) {
      if (
        category &&
        category[item] &&
        category[item][iteminArr] &&
        category[item][iteminArr]["kirilica"] != "" &&
        category[item][iteminArr]["kirilica"] == route.params.id
      ) {
        pathName.value = category[item][iteminArr]["name"];
        pathLink.value = category[item][iteminArr]["kirilica"];
      }
    }
  }
} else {
  pathName.value = "Выполненные проекты";
  pathLink.value = "/catalog";
}
</script>

<template>
  <div>
    <el-breadcrumb separator="/" class="mb-6">
      <el-breadcrumb-item :to="{ path: '/' }">Главная</el-breadcrumb-item>
      <el-breadcrumb-item
        ><nuxt-link :to="pathLink">{{
          pathName
        }}</nuxt-link></el-breadcrumb-item
      >
      <!-- <el-breadcrumb-item>promotion list</el-breadcrumb-item> -->
    </el-breadcrumb>
  </div>
</template>
