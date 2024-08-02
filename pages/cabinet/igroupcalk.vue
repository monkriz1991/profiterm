<script setup>
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
const form = ref({
  typecalk: "",
  level: 0,
  title: "",
  group: [],
  description: "",
});
const { data: typecalk } = await useFetch("/api/typecalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: {},
});
const { data: group } = await useFetch("/api/elementcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: {},
});

const {
  data: groupcalk,
  error,
  refresh,
} = await useFetch("/api/groupcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});
const addGroupcalk = async () => {
  let updatecalk = "api/update/updategroupcalk";
  if (buttonEdit.value == true) {
    updatecalk = "api/add/addgroupcalk";
  }
  form.value["group"] = form.value["group"].join(",");
  const { data: responseData } = await useFetch(`/${updatecalk}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: form.value,
  });
  if (responseData) {
    refresh();
    form.value = {};
  }
};
const drawerDel = async (id) => {
  dell.value = { _id: id };
  const { data: responseData } = await useFetch(
    "/api/delete/deletegroupcalk/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: dell.value,
    }
  );
  if (responseData) {
    refresh();
  }
};
const drawerIn = (item) => {
  console.log(item);
  form.value._id = item._id;
  if (item.group != "") {
    form.value.group = item.group.split(",");
  } else {
    form.value.group = "";
  }

  (form.value.typecalk = item.typecalk),
    (form.value.title = item.title),
    (form.value.level = item.level),
    (form.value.description = item.description),
    (drawer.value = true);
  buttonEdit.value = false;
};

const drawerNull = () => {
  drawer.value = true;
  buttonEdit.value = true;
  form.value = {};
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
</script>

<template>
  <div class="container">
    <div class="columns">
      <div class="column is-8">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>GroupCalk</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить группу</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="groupcalk.result" class="drawer-cat-all">
              <div
                class="drawer-cat"
                v-for="item in groupcalk.result"
                :key="item"
              >
                <div class="drawer-cat-left">
                  <div class="drawer-cat-img">
                    <Icon v-if="item.icon" :name="item.icon" />
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
                title="I am the title"
                :with-header="false"
                size="60%"
              >
                <span>Hi there!</span>
                <div class="drawer-block">
                  <form @submit.prevent="addGroupcalk">
                    <div class="field">
                      <el-select
                        v-model="form.typecalk"
                        class=""
                        placeholder="Тип работ"
                        size="large"
                      >
                        <el-option
                          v-for="item in typecalk.result"
                          :key="item._id"
                          :label="item.title"
                          :value="item._id"
                        />
                      </el-select>
                    </div>
                    <div class="field">
                      <el-select
                        v-model="form.group"
                        class=""
                        multiple
                        collapse-tags
                        placeholder="Тип фильтра"
                        size="large"
                      >
                        <el-option
                          v-for="item in group.result"
                          :key="item._id"
                          :label="item.title"
                          :value="item._id"
                        />
                      </el-select>
                    </div>

                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="level"
                          v-model="form.level"
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
                          placeholder="description"
                          v-model="form.description"
                        />
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
          :total="groupcalk.count"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="column is-4">
        <cabinet-LeftBar />
      </div>
    </div>
  </div>
</template>

<style>
.cat-h1-cab {
  float: left;
  width: 100%;
  margin: 0 0 20px;
}
.cat-h1-cab h1 {
  float: left;
}
.cat-h1-cab button {
  float: right;
  font-size: 15px;
  border-radius: 5px;
}
</style>
