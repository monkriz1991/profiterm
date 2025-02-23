<script setup>
const h4Category = ref("Статьи");
const { data: news } = await useFetch("/api/news", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: JSON.stringify({ levelFilter: true }),
  lazy: true,
});
</script>
<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <h4><icon name="solar:video-library-outline" />{{ h4Category }}</h4>
    </div>

    <div class="column is-12">
      <div class="columns is-multiline">
        <div
          class="column is-4"
          v-for="(item, index) in news.result"
          :key="item._id"
        >
          <div class="article-index" :class="{ 'border-none': index === 2 }">
            <nuxt-link :to="`/article/` + item.kirilica">
              <strong>
                {{ item.title }}
              </strong>
            </nuxt-link>
          </div>
        </div>
        <div class="column is-12">
          <div class="article-all">
            <nuxt-link to="/articles">
              Все статьи
              <Icon name="healthicons:register-book-outline" />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
