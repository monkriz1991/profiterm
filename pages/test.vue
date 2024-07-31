<script setup>
import { ref, onMounted } from "vue";
import { useFetch } from "@vueuse/core";

const calkObject = ref([]);

const { data: rawTypecalk } = await useFetch("/api/typecalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});
const { data: rawItemcalk } = await useFetch("/api/itemcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

onMounted(() => {
  let typecalk = [];
  let itemcalk = [];

  try {
    typecalk = JSON.parse(rawTypecalk.value);
    itemcalk = JSON.parse(rawItemcalk.value);
  } catch (e) {
    console.error("Failed to parse JSON data:", e);
  }

  if (Array.isArray(typecalk) && Array.isArray(itemcalk)) {
    const typecalkMap = {};
    typecalk.forEach((type) => {
      typecalkMap[type._id] = { ...type, items: [] };
    });

    itemcalk.forEach((item) => {
      if (typecalkMap[item.typecalk]) {
        typecalkMap[item.typecalk].items.push(item);
      }
    });

    calkObject.value = Object.values(typecalkMap);
  }
});
</script>

<template>
  <div class="container">
    <br /><br /><br />
    <h1>title</h1>

    <div v-if="calkObject.length">
      <pre>{{ calkObject }}</pre>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>
