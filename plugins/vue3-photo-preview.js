import vue3PhotoPreview from 'vue3-photo-preview';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3PhotoPreview)
})