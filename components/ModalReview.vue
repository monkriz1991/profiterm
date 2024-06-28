<script setup>
const visible = ref(false);
const statusButton = ref(false);

const form = ref({
  email: "",
  name: "",
  phone: "",
  description: "",
  file: null,
});
const nameFile = ref("");
const modalSucces = ref(false);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  form.value.file = file;
  nameFile.value = file.name;
};

const addFilter = async () => {
  const formData = new FormData();
  statusButton.value = true;

  formData.append("email", form.value.email);
  formData.append("name", form.value.name);
  formData.append("phone", form.value.phone);
  formData.append("description", form.value.description);
  if (form.value.file) {
    formData.append("file", form.value.file);
  }

  const { data: responseData } = await useFetch(() => "/api/sendreview/", {
    method: "POST",
    body: formData,
  });

  if (responseData) {
    statusButton.value = false;
    modalSucces.value = true;
    form.value = {
      email: "",
      name: "",
      phone: "",
      description: "",
      file: null,
    };
    visible.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Form -->
    <button class="button rev-b-modal" @click="visible = true">
      <span>Отправить отзыв</span>
      <span class="icon">
        <Icon name="hugeicons:message-add-01" />
      </span>
    </button>
    <Teleport to="body">
      <div v-if="modalSucces" class="modal-succes">
        <strong>Благодарим за отзыв!</strong>
        <p>Мы свяжемся с Вами в ближайшее время.</p>
        <button class="delete is-large" @click="modalSucces = false"></button>
      </div>
    </Teleport>
    <Teleport to="body">
      <ClientOnly>
        <el-dialog v-model="visible" class="modal-form" title="Добавьте отзыв.">
          <form @submit.prevent="addFilter">
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Ф.И.О"
                  v-model="form.name"
                />
              </div>
            </div>

            <div class="file has-name is-fullwidth">
              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  name="resume"
                  @change="handleFileChange"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <Icon name="solar:download-square-broken" />
                  </span>
                  <span class="file-label"> Добавьте ваше фото… </span>
                </span>
                <span class="file-name">
                  {{ nameFile }}
                </span>
              </label>
            </div>
            <div class="field-pm">
              <span
                >Телефон / Email - не публикуются, они необходимы для уточнения
                деталей.</span
              >
              <div class="field">
                <div class="control">
                  <input
                    class="input"
                    type="number"
                    placeholder="Телефон"
                    v-model="form.phone"
                  />
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input
                    class="input"
                    type="email"
                    placeholder="Email"
                    v-model="form.email"
                  />
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <textarea
                  class="textarea"
                  placeholder="Текст отзыва"
                  v-model="form.description"
                >
                </textarea>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button
                  class="button send-form"
                  :class="{ 'is-loading': statusButton }"
                  type="submit"
                  :disabled="statusButton ? statusButton == true : false"
                >
                  <span>Отправить отзыв</span>
                  <span class="icon">
                    <Icon name="ri:send-plane-fill" />
                  </span>
                </button>
              </div>
            </div>
          </form>
        </el-dialog>
      </ClientOnly>
    </Teleport>
  </div>
</template>
