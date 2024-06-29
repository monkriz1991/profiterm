<script setup>
definePageMeta({
  middleware: "auth",
  title: "My home page",
  layout: "custom",
});
import { UploadFilled } from "@element-plus/icons-vue";

const config = useRuntimeConfig();
const { data, signOut } = useAuth();
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const selectForm = ref("");
const videofArr = ref([]);
const videMobailArr = ref([]);
const imgArr = ref([]);
const fileUpload = ref([]);
const fileUploadImg = ref([]);
const fileUploadVidoe = ref([]);
const fileUploadVidoeMobail = ref([]);
const fileDelteVideo = ref([]);
const fileDelteVideoMobail = ref([]);
const fileDelteImg = ref([]);
const fileDelte = ref([]);
const activeNames = ref("");
const form = reactive({
  one: {
    type: "",
    title: "",
    img: [],
    video: [],
    video_mobail: [],
    description: "",
    preview: "",
  },
  two: {
    type: "",
    level: "",
    title: "",
    img: [],
  },
  three: {
    type: "",
    level: "",
    title: "",
    img: [],
    yootube: "",
    description: "",
  },
});
const optionForm = [
  {
    value: "one",
    label: "Первый Блок",
  },
  {
    value: "two",
    label: "Слайдер",
  },
  {
    value: "three",
    label: "Видео",
  },
];
const { data: main, refresh } = await useFetch("/api/main/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

const addMain = async () => {
  const bodyFils = new FormData();
  if (fileDelteImg.value) {
    fileDelte.value = fileDelte.value.concat(fileDelteImg.value);
  }

  if (fileDelteVideo.value) {
    fileDelte.value = fileDelte.value.concat(fileDelteVideo.value);
  }

  if (fileDelteVideoMobail.value) {
    fileDelte.value = fileDelte.value.concat(fileDelteVideoMobail.value);
  }
  let updatemain = "api/update/updatemain";
  let formObj = {};
  if (buttonEdit.value == true) {
    updatemain = "api/add/addmain";
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
  formObj = form[selectForm.value];
  formObj["type"] = selectForm.value;
  const { data: responseData } = await useFetch(`/${updatemain}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: { form: formObj },
    watch: false,
  });
  if (fileUploadImg.value) {
    fileUpload.value = fileUpload.value.concat(fileUploadImg.value);
  }

  if (fileUploadVidoe.value) {
    fileUpload.value = fileUpload.value.concat(fileUploadVidoe.value);
  }

  if (fileUploadVidoeMobail.value) {
    fileUpload.value = fileUpload.value.concat(fileUploadVidoeMobail.value);
  }
  for (let i = 0; i < fileUpload.value.length; i++) {
    bodyFils.append("file", fileUpload.value[i]);
  }
  // console.log(fileUpload.value);
  if (fileUpload.value.length != 0) {
    await useFetch("/api/multiupload", {
      method: "POST",
      body: bodyFils,
      onResponse(context) {},
    });
  }
  if (responseData) {
    for (let item in form[selectForm.value]) {
      form[selectForm.value][item] = "";
    }
    refresh();
    for (let item in form[selectForm.value]) {
      form[selectForm.value][item] = "";
      if (item == "description") {
        form[selectForm.value][item] = "<p></p>";
      }
      if (item == "img" || item == "video" || item == "video_mobail") {
        form[selectForm.value][item] = [];
      }
    }
    videofArr.value = [];
    videMobailArr.value = [];
    imgArr.value = [];
    fileUpload.value = [];
    fileDelte.value = [];
  }
};
const drawerDel = async (id, img, video, video_mobail, type) => {
  let arrFiles = [];
  let arrContact = [];
  if (img) {
    arrContact = arrContact.concat(img);
  }
  if (video) {
    arrContact = arrContact.concat(video);
  }
  if (video_mobail) {
    arrContact = arrContact.concat(video_mobail);
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
  dell.value = { _id: id, obtype: type };
  const { data: responseData } = await useFetch("/api/delete/daletemain/", {
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
const drawerIn = (array, type) => {
  fileUploadImg.value = [];
  fileUploadVidoe.value = [];
  for (let item in array) {
    form[array.type][item] = array[item];
  }
  videofArr.value = array.video;
  videMobailArr.value = array.video_mobail;
  imgArr.value = array.img;
  selectForm.value = array.type;
  drawer.value = true;
  fileDelteVideo.value = [];
  fileDelteVideoMobail.value = [];
  fileDelteImg.value = [];
  buttonEdit.value = false;
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  fileUploadImg.value = [];
  fileUploadVidoe.value = [];
  fileUploadVidoeMobail.value = [];
  if (form[selectForm.value] != undefined) {
    for (let item in form[selectForm.value]) {
      form[selectForm.value][item] = "";
    }
    delete form[selectForm.value]["__v"];
    delete form[selectForm.value]["_id"];
    selectForm.value = "";
    videofArr.value = [];
    videMobailArr.value = [];
    imgArr.value = [];
  }
};
const addVideo = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUploadVidoe.value.push(modifiedFile);
  form[selectForm.value].video.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};
const addVideoMobail = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUploadVidoeMobail.value.push(modifiedFile);
  form[selectForm.value].video_mobail.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};

const addImg = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });
  fileUploadImg.value.push(modifiedFile);
  form[selectForm.value].img.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};

const beforeRemoveImg = (file, fileList) => {
  form[selectForm.value].img = [];
  fileDelteImg.value.push(file);
  form[selectForm.value].img = imgArr.value;
  if (file.size != undefined && fileList.length == 1) {
    fileDelteImg.value = [];
  }
};
const beforeRemoveVidep = (file, fileList) => {
  form[selectForm.value].video = [];
  fileDelteVideo.value.push(file);
  form[selectForm.value].video = videofArr.value;
  if (file.size != undefined && fileList.length == 1) {
    fileDelteVideo.value = [];
  }
};
const beforeRemoveVidepMobail = (file, fileList) => {
  form[selectForm.value].video_mobail = [];
  fileDelteVideoMobail.value.push(file);
  form[selectForm.value].video_mobail = videMobailArr.value;
  if (file.size != undefined && fileList.length == 1) {
    fileDelteVideoMobail.value = [];
  }
};

const handleCloseDrawer = () => {
  drawer.value = false;
  refresh();
};
</script>
<template>
  <div class="bd-docs-main">
    <div class="container">
      <div class="columns">
        <div class="column is-8">
          <div class="content">
            <div class="cat-h1-cab">
              <h1>Main</h1>
              <button
                class="button is-white"
                type="primary"
                @click="drawerNull"
              >
                <span class="icon">
                  <Icon class="modal-b-svg" name="solar:add-square-broken" />
                </span>
                <span>Добавить контент</span>
              </button>
            </div>
            <div class="drawer-add">
              <div v-if="main" class="drawer-cat-all">
                <ClientOnly>
                  <el-collapse
                    v-for="(itemmine, idx) in main"
                    :key="idx"
                    v-model="activeNames"
                    accordion
                  >
                    <el-collapse-item :title="idx" :name="idx">
                      <div
                        class="drawer-cat"
                        v-for="item in itemmine"
                        :key="item"
                      >
                        <div class="drawer-cat-left">
                          <!-- <span>{{ item.type }}</span> -->
                          <span>{{ item.title }}</span>
                        </div>

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
                            @click="
                              drawerDel(
                                item._id,
                                item.img,
                                item.video,
                                item.video_mobail,
                                item.type
                              )
                            "
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </ClientOnly>
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
                    <div v-show="buttonEdit == true">
                      <el-select
                        v-model="selectForm"
                        class="mb-3"
                        placeholder="Select typ"
                        size="large"
                      >
                        <el-option
                          v-for="item in optionForm"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <form v-if="selectForm" @submit.prevent="addMain">
                      <div
                        class="field"
                        v-for="(item, index) in form[selectForm]"
                        :key="index"
                      >
                        <div
                          class="field"
                          v-show="
                            index != '__v' &&
                            index != '_id' &&
                            index != 'type' &&
                            index != 'color' &&
                            index != 'video' &&
                            index != 'video_mobail' &&
                            index != 'img' &&
                            index != 'description'
                          "
                        >
                          <div class="control">
                            <input
                              class="input"
                              type="text"
                              :placeholder="index"
                              v-model="form[selectForm][index]"
                            />
                          </div>
                        </div>
                        <div class="field" v-if="index == 'description'">
                          <div class="control">
                            <QuillEditor
                              v-model:content="form[selectForm][index]"
                              contentType="html"
                              toolbar="full"
                              theme="snow"
                            ></QuillEditor>
                          </div>
                        </div>
                        <div class="field" v-if="index == 'color'">
                          <el-color-picker
                            v-model="form[selectForm][index]"
                            show-alpha
                          />
                        </div>
                        <div class="field" v-if="index == 'video'">
                          <el-upload
                            class="upload-demo"
                            :before-upload="addVideo"
                            :before-remove="beforeRemoveVidep"
                            drag
                            action="#"
                            multiple
                            :limit="1"
                            v-model:file-list="videofArr"
                          >
                            <el-icon class="el-icon--upload"
                              ><upload-filled
                            /></el-icon>
                            <div class="el-upload__text">
                              Drop Video here or <em>click to upload </em>
                            </div>
                          </el-upload>
                        </div>
                        <div class="field" v-if="index == 'video_mobail'">
                          <el-upload
                            class="upload-demo"
                            :before-upload="addVideoMobail"
                            :before-remove="beforeRemoveVidepMobail"
                            drag
                            action="#"
                            multiple
                            :limit="1"
                            v-model:file-list="videMobailArr"
                          >
                            <el-icon class="el-icon--upload"
                              ><upload-filled
                            /></el-icon>
                            <div class="el-upload__text">
                              Drop Video Mobail here or
                              <em>click to upload </em>
                            </div>
                          </el-upload>
                        </div>
                        <div class="field" v-if="index == 'img'">
                          <el-upload
                            class="upload-demo"
                            :before-upload="addImg"
                            :before-remove="beforeRemoveImg"
                            drag
                            list-type="picture"
                            action="#"
                            multiple
                            :limit="2"
                            v-model:file-list="imgArr"
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
                          <button
                            v-if="buttonEdit == true"
                            class="button is-success"
                            type="submit"
                          >
                            Save
                          </button>
                          <button
                            v-else
                            class="button is-success"
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
        </div>
        <div class="column is-4">
          <cabinet-LeftBar />
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
