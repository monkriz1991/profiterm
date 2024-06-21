<script setup>
const visible = ref(false);
const form = ref({
  email: "",
  name: "",
  info: "",
  description: "",
});
const addFilter = async () => {
  const { data: responseData } = await useFetch("/api/contact/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  form.value = {};
};
</script>
<template>
  <div>
    <!-- Form -->
    <button class="button index-b-modal" @click="visible = true">
      <span>Оформить заявку</span>
      <span class="icon">
        <Icon name="bx:bxs-layer-plus" />
      </span>
    </button>
    <ClientOnly>
      <el-dialog v-model="visible" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
          <div class="my-header">
            <h4 :id="titleId" :class="titleClass">This is a custom header!</h4>

            <el-button type="danger" @click="close"> Close </el-button>
          </div>
        </template>
        <form @submit.prevent="addFilter">
          <div class="field">
            <div class="control">
              <input
                class="input"
                type="email"
                placeholder="email"
                v-model="form.email"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="name"
                v-model="form.name"
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="info"
                v-model="form.info"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <textarea
                class="textarea"
                placeholder="description"
                v-model="form.description"
              >
              </textarea>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-success" type="submit">Send</button>
            </div>
          </div>
        </form>
      </el-dialog>
    </ClientOnly>
  </div>
</template>
