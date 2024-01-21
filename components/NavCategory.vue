<script setup>
const route = useRoute();
const h1Category = ref("Выполненные проекты");
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
        h1Category.value = category[item][iteminArr]["name"];
      }
    }
  }
}
</script>
<template>
  <div>
    <h1>{{ h1Category }}</h1>
    <div class="m-cat-nav">
      <div class="columns is-desktop is-multiline">
        <div class="column" v-for="item in category" :key="item._id">
          <nuxt-link class="nav-cat" :to="'/catalog/' + item.kirilica">
            <Icon v-if="item.img" :name="item.img" />
            {{ item.name }}</nuxt-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
