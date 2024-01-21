<script setup>
const mail = useMail({});
const form = ref({
  name: "",
  email: "",
});
const sendMail = () => {
  console.log(form.value);
  mail.send({
    to: form.value.email,
    from: form.value.email,
    subject: "Incredible",
    text: form.value.name,
  });
};
</script>

<template>
  <div class="container">
    <h1>nonono</h1>
    {{ mail }}

    <form>
      <label for="name">Ditt namn</label>
      <input id="name" type="text" v-model="form.name" />

      <label for="email">Din epostadress</label>
      <input id="email" type="email" v-model="form.email" />

      <button type="submit" @click.prevent="sendMail">Send email</button>
    </form>
  </div>
</template>
