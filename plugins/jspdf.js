import { jsPDF } from "jspdf";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("jsPDF", jsPDF);
});
