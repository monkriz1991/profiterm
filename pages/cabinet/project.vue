<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
definePageMeta({
  middleware: "auth",
  layout: "custom",
});
const config = useRuntimeConfig();
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const imfArr = ref([]);
const galArr = ref([]);
const categoryUse = ref([]);
const fileUpload = ref([]);
const fileUploadImg = ref([]);
const fileUploadGalery = ref([]);
const fileDelteGalery = ref([]);
const fileDelteImg = ref([]);
const fileDelte = ref([]);
const form = ref({
  category: "",
  title: "",
  preview: "",
  kirilica: "",
  img: [],
  galery: [],
  video: "",
  info: "",
  description: "",
});
const {
  data: project,
  error,
  refresh,
} = await useFetch("/api/project/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});

const categorySelect = async () => {
  const { data: categoryIn } = await useFetch(() => "/api/category/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  categoryUse.value = categoryIn.value;
};
const addProject = async () => {
  const bodyFils = new FormData();
  fileDelte.value = fileDelteImg.value.concat(fileDelteGalery.value);
  let updateproject = "api/update/updateproject";
  if (buttonEdit.value == true) {
    updateproject = "api/add/addproject";
  } else {
    if (fileDelte.value.length != 0) {
      const { data: responseDell } = await useFetch("/api/deletefiles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: { img: fileDelte.value },
      });
    }
  }
  const { data: responseData } = await useFetch(`/${updateproject}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  fileUpload.value = fileUploadImg.value.concat(fileUploadGalery.value);
  for (let i = 0; i < fileUpload.value.length; i++) {
    bodyFils.append("file", fileUpload.value[i]);
  }
  if (fileUpload.value.length != 0) {
    await useFetch("/api/multiupload", {
      method: "POST",
      body: bodyFils,
      onResponse(context) {},
    });
  }
  if (responseData) {
    refresh();
    form.value = {
      category: "",
      title: "",
      preview: "",
      kirilica: "",
      img: [],
      galery: [],
      video: "",
      info: "",
      description: "",
    };
    imfArr.value = [];
    galArr.value = [];
    form.value.description = "<p></p>";
  }
};

const drawerDel = async (id, img, galey) => {
  let arrFiles = [];
  let arrContact = [];
  if (img != undefined && galey != undefined) {
    arrContact = img.concat(galey);
  } else if (img != undefined && galey == undefined) {
    arrContact = img;
  } else if (img == undefined && galey != undefined) {
    arrContact = galey;
  }
  for (let item in arrContact) {
    if (arrContact[item].name != undefined) {
      arrFiles.push(arrContact[item]);
    }
  }
  if (arrFiles.length != 0) {
    const { data: responseDell } = await useFetch("/api/deletefiles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: { img: arrFiles },
    });
  }
  dell.value = { _id: id };
  const { data: responseData } = await useFetch("/api/delete/deleteproject/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: dell.value,
  });
  if (responseData) {
    refresh();
  }
};
onMounted(() => {
  setTimeout(() => {
    categorySelect();
  }, 1);
});
const drawerIn = (item) => {
  form.value.img = [];
  form.value.galery = [];
  fileUploadImg.value = [];
  fileUploadGalery.value = [];
  if (item.img.length) {
    form.value.img = item.img;
    imfArr.value = item.img;
  }
  if (item.galery.length) {
    form.value.galery = item.galery;
    galArr.value = item.galery;
  }
  form.value._id = item._id;
  (form.value.kirilica = item.kirilica),
    (form.value.title = item.title),
    (form.value.preview = item.preview),
    (form.value.video = item.video),
    (form.value.info = item.info),
    (form.value.description = item.description),
    (drawer.value = true);

  for (let catall in categoryUse) {
    for (let catim in categoryUse[catall]) {
      if (categoryUse[catall][catim] != undefined) {
        if (item.category == categoryUse[catall][catim]["kirilica"]) {
          form.value.category = categoryUse[catall][catim].kirilica;
        }
      }
    }
  }
  buttonEdit.value = false;
  fileDelteImg.value = [];
  fileDelteGalery.value = [];
};

const drawerNull = () => {
  categorySelect();
  drawer.value = true;
  buttonEdit.value = true;
  imfArr.value = [];
  galArr.value = [];
  fileUploadImg.value = [];
  fileUploadGalery.value = [];
  for (let item in form.value) {
    form.value[item] = "";
    if (item == "description") {
      form.value[item] = "<p></p>";
    }
    if (item == "img" || item == "galery") {
      form.value[item] = [];
    }
  }

  delete form.value["_id"];
};

const handleCurrentChange = (val) => {
  if (val == 1) {
    sortPage.value = 0;
  } else {
    sortPage.value = val * 4 - 4;
  }
  currentPage.value = val;
  refresh();
};

const addImg = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUploadImg.value.push(modifiedFile);
  form.value.img.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};
const addGal = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUploadGalery.value.push(modifiedFile);
  form.value.galery.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};

const beforeRemoveImg = (file, fileList) => {
  removeFilesAll("img", file, fileList);
};
const beforeRemoveGal = (file, fileList) => {
  removeFilesAll("galery", file, fileList);
};
const removeFilesAll = (nameFun, file, fileList) => {
  form.value.nameFun = [];
  form.value.nameFun = imfArr.value;
  if (nameFun == "img") {
    fileDelteImg.value.push(file);
    if (file.size != undefined && fileList.length == 1) {
      fileDelteImg.value = [];
    }
  } else if (nameFun == "galery") {
    fileDelteGalery.value.push(file);
    if (file.size != undefined && fileList.length == 1) {
      fileDelteGalery.value = [];
    }
  }
};

const handleCloseDrawer = () => {
  drawer.value = false;
  refresh();
};
</script>

<template>
  <div class="container">
    <div class="columns">
      <div class="column is-8">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>Project</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить проект</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="project.result" class="drawer-cat-all">
              <div
                class="drawer-cat"
                v-for="item in project.result"
                :key="item"
              >
                <div class="drawer-cat-left">
                  <div class="drawer-cat-img">
                    <NuxtImg
                      v-if="item.img.length"
                      :src="item.img[0].url"
                      :alt="item.img[0].name"
                      format="wepb"
                    />
                    <img v-else src="/noimg.webp" />
                  </div>
                  <!-- <span>{{ item.category }}</span> -->
                  <strong>{{ item.title }}</strong>
                </div>
                <!-- <span>{{ item.kirilica }}</span>   
                           <span>{{ item.description }}</span> -->
                <div class="drawer-cat-right">
                  <button
                    class="button is-warning is-normal is-light"
                    type="submit"
                    @click="drawerIn(item)"
                  >
                    Edit
                  </button>
                  <button
                    class="button is-danger is-normal is-light"
                    type="submit"
                    @click="drawerDel(item._id, item.img, item.galery)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <ClientOnly>
              <el-drawer
                v-model="drawer"
                :before-close="handleCloseDrawer"
                title="I am the title"
                :with-header="false"
                size="60%"
              >
                <span>Hi there!</span>
                <div class="drawer-block">
                  <form @submit.prevent="addProject">
                    <div class="field">
                      <el-select
                        v-model="form.category"
                        class=""
                        placeholder="category"
                        size="large"
                      >
                        <el-option
                          v-for="item in categoryUse"
                          :key="item.id_category"
                          :label="item.name"
                          :value="item.kirilica"
                        />
                      </el-select>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="kirilica"
                          v-model="form.kirilica"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="title"
                          v-model="form.title"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="preview"
                          v-model="form.preview"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <el-upload
                          class="upload-demo"
                          :before-upload="addImg"
                          :before-remove="beforeRemoveImg"
                          drag
                          action="#"
                          multiple
                          list-type="picture"
                          v-model:file-list="imfArr"
                          :limit="1"
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
                        <el-upload
                          class="upload-demo"
                          :before-upload="addGal"
                          :before-remove="beforeRemoveGal"
                          drag
                          action="#"
                          multiple
                          list-type="picture"
                          v-model:file-list="galArr"
                          :limit="10"
                        >
                          <el-icon class="el-icon--upload"
                            ><upload-filled
                          /></el-icon>
                          <div class="el-upload__text">
                            Drop img galery here or <em>click to upload </em>
                          </div>
                        </el-upload>
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="video"
                          v-model="form.video"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <textarea
                          class="textarea"
                          placeholder="info"
                          v-model="form.info"
                          rows="4"
                        >
                        </textarea>
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <QuillEditor
                          v-model:content="form.description"
                          contentType="html"
                          toolbar="full"
                          theme="snow"
                        ></QuillEditor>
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <button
                          v-if="buttonEdit == true"
                          class="button is-success"
                          type="submit"
                        >
                          Save
                        </button>
                        <button
                          v-else
                          class="button is-success mt-6"
                          type="submit"
                          @click="drawer = false"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </el-drawer>
            </ClientOnly>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="project.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-4">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>
