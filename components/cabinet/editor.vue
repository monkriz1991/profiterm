<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
</script>
<template>
  <div>
    <QuillEditor
      :content="form.description"
      contentType="html"
      toolbar="full"
      theme="snow"
    />
  </div>
</template>
