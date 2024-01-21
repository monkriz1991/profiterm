<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
definePageMeta({
  middleware: "auth",
  layout: "custom",
});

// const pageTotal = ref(0)
const sortPage = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const imfArr = ref([]);
const videoArr = ref([]);
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
  let updatesystem = "api/update/updatesystem";
  if (buttonEdit.value == true) {
    updatesystem = "api/add/addsystem";
  }
  const { data: responseData } = await useFetch(`/${updatesystem}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
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
  }
};
const drawerDel = async (id) => {
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
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  imfArr.value = [];
  videoArr.value = [];
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
const addImg = (file) => {
  let reader = new FileReader();
  reader.onload = (event) => {
    form.value.img.push({ name: file.name, url: event.target.result });
  };
  reader.readAsDataURL(file);
};
const addVideo = (file) => {
  let reader = new FileReader();
  reader.onload = (event) => {
    form.value.video.push({ name: file.name, url: event.target.result });
  };
  reader.readAsDataURL(file);
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
                    <img
                      v-for="imgurl in item.img"
                      :key="imgurl"
                      :src="imgurl.url"
                    />
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
                    @click="drawerDel(item._id)"
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
