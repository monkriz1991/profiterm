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
