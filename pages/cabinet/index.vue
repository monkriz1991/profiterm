<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
definePageMeta({
  middleware: "auth",
  title: "My home page",
  layout: "custom",
});

const { data, signOut } = useAuth();
const drawer = ref(false);
const buttonEdit = ref(false);
const dell = ref({});
const selectForm = ref("");
const videofArr = ref([]);
const imgArr = ref([]);
const form = reactive({
  one: {
    type: "",
    title: "",
    img: [],
    video: [],
    description: "",
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
const activeNames = ref("");
const addMain = async () => {
  let updatemain = "api/update/updatemain";
  let formObj = {};
  if (buttonEdit.value == true) {
    updatemain = "api/add/addmain";
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
  if (responseData) {
    for (let item in form[selectForm.value]) {
      form[selectForm.value][item] = "";
    }
    refresh();
    form.value = {
      one: {
        type: "",
        title: "",
        img: [],
        video: [],
        preview: "",
        description: "",
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
    };
    videofArr.value = [];
    imgArr.value = [];
  }
};
const drawerDel = async (id, type) => {
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
  for (let item in array) {
    form[array.type][item] = array[item];
  }
  videofArr.value = array.video;
  imgArr.value = array.img;
  selectForm.value = array.type;
  drawer.value = true;
  buttonEdit.value = false;
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  if (form[selectForm.value] != undefined) {
    for (let item in form[selectForm.value]) {
      form[selectForm.value][item] = "";
    }
    delete form[selectForm.value]["__v"];
    delete form[selectForm.value]["_id"];
    selectForm.value = "";
    videofArr.value = [];
    imgArr.value = [];
  }
};
const addVideo = (file) => {
  form[selectForm.value].video = [];
  const reader = new FileReader();
  reader.onload = (event) => {
    form[selectForm.value].video.push({
      name: file.name,
      url: event.target.result,
    });
  };
  reader.readAsDataURL(file);
};
const addImg = (file) => {
  form[selectForm.value].img = [];
  const reader = new FileReader();
  reader.onload = (event) => {
    form[selectForm.value].img.push({
      name: file.name,
      url: event.target.result,
    });
  };
  reader.readAsDataURL(file);
};
</script>
<template>
  <div class="container">
    <div class="columns">
      <div class="column is-8">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>Main</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
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
                          @click="drawerDel(item._id, item.type)"
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
                      <div class="field" v-if="index == 'img'">
                        <el-upload
                          class="upload-demo"
                          :before-upload="addImg"
                          drag
                          list-type="picture"
                          action="#"
                          multiple
                          :limit="1"
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
</template>
<style></style>
