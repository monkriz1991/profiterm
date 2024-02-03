<script setup>
const props = defineProps({
  visiblePlyr: {
    type: Boolean,
    default: false,
  },
  VideoObject: {
    type: String,
    default: "",
  },
});
const visible = ref(false);
const objectVideo = computed(() => props.VideoObject);
watch(
  () => props.visiblePlyr,
  (item) => {
    plyr();
    visible.value = item;
  }
);
watch(visible, (input) => {
  visible.value = input;
});
const plyr = async () => {
  const Plyr = await import("plyr");
  const newPlayer = new Plyr.default("#y" + objectVideo.value);
};
</script>
<template>
  <ClientOnly>
    <div v-if="visible == true" class="video-item-project">
      <div
        :id="'y' + objectVideo"
        data-plyr-provider="youtube"
        :data-plyr-embed-id="objectVideo"
      ></div>
    </div>
  </ClientOnly>
</template>
