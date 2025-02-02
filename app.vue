<script setup>
useHead({
  script: [
    {
      src: "https://www.googletagmanager.com/gtag/js?id=AW-815779075",
      async: true,
    },
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-815779075');
      `,
    },
  ],
});
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
