<script setup>
definePageMeta({
  middleware: "guest",
});
const form = ref({
  email: "",
  username: "",
  password: "",
});
const handleFromSubmit = async () => {
  try {
    await useFetch("/api/auth/registr", {
      method: "POST",
      body: form.value,
    });
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <div class="container"></div>
</template>
