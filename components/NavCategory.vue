<script setup>
const route = useRoute();
const h1Category = ref("Выполненные проекты");
const breadcrumbLinks = ref([]);
const seoTitle = ref("");
const seoDescription = ref("");
const description = ref("");
const emit = defineEmits(["catDescription"]);
// Загрузка данных о категории
const category = await $fetch("/api/category/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

if (route.params.id && category && category.length > 0) {
  const foundCategory = category.find(
    (cat) => cat.kirilica === route.params.id
  );

  if (foundCategory) {
    h1Category.value = foundCategory.name;
    seoTitle.value = foundCategory.seo_title;
    seoDescription.value = foundCategory.seo_description;
    description.value = foundCategory.description;
  }
} else {
  const foundCategory = category.find((cat) => cat.kirilica === "");
  if (foundCategory) {
    seoTitle.value = foundCategory.seo_title;
    seoDescription.value = foundCategory.seo_description;
    description.value = foundCategory.description;
  }
  emit("catDescription", description.value);
}

watchEffect(() => {
  if (h1Category.value && h1Category.value.length > 0) {
    const toPath = route.params.id ? `/catalog/${route.params.id}` : "/catalog";
    breadcrumbLinks.value = [
      { label: "Главная", to: "/" },
      { label: h1Category.value, to: toPath },
    ];
  }
});
useSeoMeta({
  title: seoTitle.value,
  description: seoDescription.value,
});
</script>
<template>
  <div>
    <Breadcrumb :links="breadcrumbLinks" />
    <h1 class="h1-catalog">{{ h1Category }}</h1>
    <ModalForm />
    <div class="m-cat-nav">
      <div class="columns">
        <div class="column" v-for="item in category" :key="item._id">
          <nuxt-link class="nav-cat" :to="'/catalog/' + item.kirilica">
            <Icon v-if="item.img" :name="item.img" />
            {{ item.name }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
