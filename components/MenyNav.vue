<script setup>
const visible = ref(false);
const {
  data: category,
  error,
  refresh,
} = await useFetch("/api/category/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

function onClickOutside(event, el) {
  if (
    event.target.className !== "button button-meny is-danger" &&
    event.target.className !== "none-meny"
  ) {
    if (event.target.className !== "meny-nav-cat") {
      visible.value = false;
    }
  }
}
console.log(category.value);
// useSeoMeta({
//   title: seoTitle.value,
//   ogTitle: seoTitle.value,
//   description: seoDescription.value,
//   ogDescription: seoDescription.value,
//   ogImage: seoTImg.value,
//   twitterCard: "summary_large_image",
// });
</script>

<template>
  <div class="meny-nav">
    <button class="button button-meny is-danger" @click="visible = !visible">
      <span class="none-meny">Meny</span>
      <!-- <span class="icon">
        <icon name="ci:hamburger-md" />
      </span> -->
    </button>
    <div class="meny-nav-cat" v-show="visible == true">
      <div
        class="meny-nav-show"
        v-if="category"
        v-click-outside="onClickOutside"
      >
        <nuxt-link
          :to="`/catalog/` + item.kirilica"
          @click="visible = false"
          v-for="item in category"
          :key="item._id"
        >
          <div class="meny-nav-img">
            <img :src="item.img" />
          </div>
          <strong class="meny-nav-title">
            <!-- {{ item.name }} -->
          </strong>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<style>
.meny-nav {
  position: relative;
}
.meny-nav > button {
  margin: 0 0 0 50px;
}
.navbar-menu .navbar-start {
  align-items: center;
}
.meny-nav-cat {
  position: absolute;
  background: #fff;
  padding: 30px 30px 15px;
  border-radius: 14px;
  width: 430px;
  margin: 10px 0 0 50px;
  box-shadow: 0px 0px 16px -15px #000000;
}
.meny-nav-cat a {
  display: flex;
  align-items: center;
  margin: 0 0 15px;
  color: #333;
  font-size: 16px;
}
.meny-nav-img {
  height: 70px;
  width: 100px;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 15px 0 0;
}
.meny-nav-img img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.meny-nav-title {
}
</style>
