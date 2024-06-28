<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
definePageMeta({
  middleware: "auth",
  layout: "custom",
});
const config = useRuntimeConfig();
const buttonEdit = ref(false);
const imfArr = ref([]);
const fileUpload = ref([]);
const fileDelte = ref([]);
const form = ref({
  img: [],
  installment: "",
  about: "",
  contacts: "",
  email: "",
  phone: "",
  dopphone: "",
});

const drawerIn = (item) => {
  console.log(item);
  //   form.value.img = [];
  //   fileUpload.value = [];
  //if (item.img.length) {
  form.value.img = item.img;
  imfArr.value = item.img;
  //}
  (form.value._id = item._id),
    (form.value.installment = item.installment),
    (form.value.about = item.about),
    (form.value.contacts = item.contacts),
    (form.value.email = item.email),
    (form.value.phone = item.phone),
    (form.value.dopphone = item.dopphone);
};

const {
  data: project,
  error,
  refresh,
} = await useFetch("/api/allpages/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

if (project.value) {
  drawerIn(project.value[0]);
}

const addReviews = async () => {
  const bodyFils = new FormData();
  let updatereviews = "api/update/updateallpages";
  const { data: responseData } = await useFetch(`/${updatereviews}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });

  for (let i = 0; i < fileUpload.value.length; i++) {
    bodyFils.append("file", fileUpload.value[i]);
  }
  if (form.value.img.length != 0) {
    await useFetch("/api/multiupload", {
      method: "POST",
      body: bodyFils,
      onResponse(context) {},
    });
  }
  if (responseData) {
    refresh();
  }
};

const addImg = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUpload.value.push(modifiedFile);
  form.value.img.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};

const beforeRemove = (file, fileList) => {
  form.value.img = [];
  fileDelte.value.push(file);
  form.value.img = imfArr.value;
  if (file.size != undefined && fileList.length == 1) {
    fileDelte.value = [];
  }
};
</script>

<template>
  <div class="container">
    <div class="columns">
      <div class="column is-8">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>Доп страницы</h1>
          </div>

          <div class="drawer-add">
            <ClientOnly>
              <form @submit.prevent="addReviews" enctype="multipart/form-data">
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="text"
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
                      placeholder="phone"
                      v-model="form.phone"
                    />
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="dop phone"
                      v-model="form.dopphone"
                    />
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <QuillEditor
                      v-model:content="form.installment"
                      contentType="html"
                      toolbar="full"
                      theme="snow"
                    ></QuillEditor>
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <QuillEditor
                      v-model:content="form.about"
                      contentType="html"
                      toolbar="full"
                      theme="snow"
                    ></QuillEditor>
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <QuillEditor
                      v-model:content="form.contacts"
                      contentType="html"
                      toolbar="full"
                      theme="snow"
                    ></QuillEditor>
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <el-upload
                      class="upload-demo"
                      :before-upload="addImg"
                      :before-remove="beforeRemove"
                      drag
                      action="#"
                      multiple
                      list-type="picture"
                      v-model:file-list="imfArr"
                    >
                      <el-icon class="el-icon--upload"
                        ><upload-filled
                      /></el-icon>
                      <div class="el-upload__text">
                        Drop img here or <em>click to upload </em>
                      </div>
                    </el-upload>
                  </div>
                </div>

                <div class="field">
                  <div class="control">
                    <button class="button is-success" type="submit">
                      Edit
                    </button>
                  </div>
                </div>
              </form>
            </ClientOnly>
          </div>
        </div>
      </div>
      <div class="column is-4">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>
