<script setup>
const breadcrumbLinks = ref([]);
const { data: main } = await useFetch(() => "/api/allpages/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
watchEffect(() => {
  breadcrumbLinks.value = [
    { label: "Главная", to: "/" },
    { label: "Рассрочка платежа", to: `/installment` },
  ];
});
const title = ref("Рассрочка на работы Профитерм");
const description = ref(
  "На этой странице вы сможете найти иформацию о рассрочке платежа."
);
const imgOg = ref("/profiterm.webp");

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value,
  ogImage: imgOg.value,
  twitterCard: "summary_large_image",
});
</script>
<template>
  <div>
    <div class="container">
      <div class="content">
        <ClientOnly>
          <Breadcrumb :links="breadcrumbLinks" />
        </ClientOnly>
        <h1>Рассрочка платежа</h1>
        <div v-html="main[0].installment"></div>
      </div>
    </div>
  </div>
</template>
