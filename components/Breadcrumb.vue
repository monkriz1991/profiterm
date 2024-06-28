<script setup>
const route = useRoute();
const router = useRouter();
const visibleBack = ref(false);
const props = defineProps({
  links: {
    type: Array,
    default: () => [],
  },
});
if (route.name == "project-id") {
  visibleBack.value = true;
}
</script>

<template>
  <div>
    <nav
      class="breadcrumb"
      aria-label="Breadcrumbs"
      :class="{ twobefore: visibleBack }"
    >
      <ul>
        <li v-if="visibleBack">
          <div class="button-back" @click="router.back()">
            <Icon name="solar:round-alt-arrow-left-broken" />
            <strong>Назад</strong>
            <span>|</span>
          </div>
        </li>
        <li v-for="(item, key) in links" :key="key">
          <NuxtLink v-bind="item">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
