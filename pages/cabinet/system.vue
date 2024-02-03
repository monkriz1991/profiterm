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
const videoArr = ref([]);
const fileUpload = ref([]);
const fileUploadImg = ref([]);
const fileUploadVidoe = ref([]);
const fileDelteVideo = ref([]);
const fileDelteImg = ref([]);
const fileDelte = ref([]);
const form = ref({
  title: "",
  icon: "",
  img: [],
  video: [],
  description: "",
  info: "",
});
const {
  data: system,
  error,
  refresh,
} = await useFetch("/api/system/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});
const addSystem = async () => {
  const bodyFils = new FormData();
  fileDelte.value = fileDelteImg.value.concat(fileDelteVideo.value);
  let updatesystem = "api/update/updatesystem";
  if (buttonEdit.value == true) {
    updatesystem = "api/add/addsystem";
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
  const { data: responseData } = await useFetch(`/${updatesystem}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });

  fileUpload.value = fileUploadImg.value.concat(fileUploadVidoe.value);
  for (let i = 0; i < fileUpload.value.length; i++) {
    bodyFils.append("file", fileUpload.value[i]);
  }
  if (form.value.img.length != 0 || form.value.video.length != 0) {
    await useFetch("/api/multiupload", {
      method: "POST",
      body: bodyFils,
      onResponse(context) {},
    });
  }

  if (responseData) {
    refresh();
    form.value = {
      title: "",
      icon: "",
      img: [],
      video: [],
      description: "",
      info: "",
    };
    imfArr.value = [];
    videoArr.value = [];
    form.value.description = "<p></p>";
    fileUpload.value = [];
    fileDelte.value = [];
  }
};
const drawerDel = async (id, img, video) => {
  let arrFiles = [];
  let arrContact = [];
  if (img != undefined && video != undefined) {
    arrContact = img.concat(video);
  } else if (img != undefined && video == undefined) {
    arrContact = img;
  } else if (img == undefined && video != undefined) {
    arrContact = video;
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
  const { data: responseData } = await useFetch("/api/delete/deletesystem/", {
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
const drawerIn = (item) => {
  form.value.img = [];
  form.value.video = [];
  fileUploadImg.value = [];
  fileUploadVidoe.value = [];
  if (item.img.length) {
    form.value.img = item.img;
    imfArr.value = item.img;
  }
  if (item.video.length) {
    form.value.video = item.video;
    videoArr.value = item.video;
  }
  (form.value._id = item._id),
    (form.value.title = item.title),
    (form.value.icon = item.icon),
    (form.value.info = item.info),
    (form.value.description = item.description),
    (drawer.value = true);
  buttonEdit.value = false;
  fileDelteVideo.value = [];
  fileDelteImg.value = [];
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  imfArr.value = [];
  videoArr.value = [];
  fileUploadImg.value = [];
  fileUploadVidoe.value = [];
  for (let item in form.value) {
    form.value[item] = "";
    if (item == "description") {
      form.value[item] = "<p></p>";
    }
    if (item == "img" || item == "video") {
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

const addVideo = (fileData) => {
  const filename = fileData.name;
  const randomPart = Math.random().toString(36).substring(7);
  const newFilename = randomPart + filename;

  const modifiedFile = new File([fileData], newFilename, {
    type: fileData.type,
  });

  fileUploadVidoe.value.push(modifiedFile);
  form.value.video.push({
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
  form.value.img.push({
    name: modifiedFile.name,
    url: `${config.public.filesPath}${modifiedFile.name}`,
  });
};

const beforeRemoveImg = (file, fileList) => {
  form.value.img = [];
  fileDelteImg.value.push(file);
  form.value.img = imfArr.value;
  if (file.size != undefined && fileList.length == 1) {
    fileDelteImg.value = [];
  }
};
const beforeRemoveVidep = (file, fileList) => {
  form.value.video = [];
  fileDelteVideo.value.push(file);
  form.value.video = videoArr.value;
  if (file.size != undefined && fileList.length == 1) {
    fileDelteVideo.value = [];
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
            <h1>System</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить систему</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="system.result" class="drawer-cat-all">
              <div class="drawer-cat" v-for="item in system.result" :key="item">
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
                  <strong>{{ item.title }}</strong>
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
                    @click="drawerDel(item._id, item.img, item.video)"
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
                  <form @submit.prevent="addSystem">
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="user title"
                          v-model="form.title"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="icon"
                          v-model="form.icon"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <textarea
                          class="textarea"
                          placeholder="info"
                          v-model="form.info"
                        ></textarea>
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
                        <el-upload
                          class="upload-demo"
                          :before-upload="addVideo"
                          :before-remove="beforeRemoveVidep"
                          drag
                          action="#"
                          :limit="1"
                          multiple
                          v-model:file-list="videoArr"
                        >
                          <el-icon class="el-icon--upload"
                            ><upload-filled
                          /></el-icon>
                          <div class="el-upload__text">
                            Drop video here or <em>click to upload </em>
                          </div>
                        </el-upload>
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
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="system.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-4">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>
