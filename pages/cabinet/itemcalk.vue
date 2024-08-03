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
  level: 0,
  typecalk: "",
  name: "",
  unit: 0,
  type: "",
  cost: 0,
  unitcoefficient: 0,
  coefficient: 0,
  show_check: true,
});

const { data: typecalk } = await useFetch("/api/typecalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: {},
});

const {
  data: itemcalk,
  error,
  refresh,
} = await useFetch("/api/itemcalk/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  body: { sortPage, pageSize },
});
const addItemcalk = async () => {
  let updatecalk = "api/update/updateitemcalk";
  if (buttonEdit.value == true) {
    updatecalk = "api/add/additemcalk";
  }
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
  const { data: responseData } = await useFetch("/api/delete/deleteitemcalk/", {
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
  form.value._id = item._id;
  (form.value.typecalk = item.typecalk),
    (form.value.level = item.level),
    (form.value.name = item.name),
    (form.value.cost = item.cost),
    (form.value.unit = item.unit),
    (form.value.type = item.type),
    (form.value.unitcoefficient = item.unitcoefficient),
    (form.value.coefficient = item.coefficient),
    (form.value.show_check = item.show_check),
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

const nameCat = (itemName) => {
  const result = typecalk.value.result.find((item) => {
    return item._id === itemName;
  });

  if (result) {
    return result.title;
  } else {
    console.log("Объект не найден");
  }
};
</script>

<template>
  <div class="container">
    <div class="columns">
      <div class="column is-8">
        <div class="content">
          <div class="cat-h1-cab">
            <h1>ItemCalk</h1>
            <button class="button is-white" type="primary" @click="drawerNull">
              <span class="icon">
                <Icon class="modal-b-svg" name="solar:add-square-broken" />
              </span>
              <span>Добавить тип</span>
            </button>
          </div>
          <div class="drawer-add">
            <div v-if="itemcalk.result" class="drawer-cat-all">
              <div
                class="drawer-cat"
                v-for="item in itemcalk.result"
                :key="item"
              >
                <div class="drawer-cat-left">
                  <span>{{ nameCat(item.typecalk) }}</span>
                  <strong>{{ item.name }}</strong>
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
                  <form @submit.prevent="addItemcalk">
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
                      <div class="control">
                        <el-checkbox
                          v-model="form.show_check"
                          label="Блокировка"
                          size="large"
                        />
                      </div>
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
                          placeholder="name"
                          v-model="form.name"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="number"
                          placeholder="unit"
                          step="0.1"
                          v-model="form.unit"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="type"
                          v-model="form.type"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="number"
                          placeholder="cost"
                          step="0.1"
                          v-model="form.cost"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="number"
                          placeholder="unitcoefficient"
                          step="0.1"
                          v-model="form.unitcoefficient"
                        />
                      </div>
                    </div>
                    <div class="field">
                      <div class="control">
                        <input
                          class="input"
                          type="number"
                          placeholder="coefficient"
                          step="0.1"
                          v-model="form.coefficient"
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
          :total="itemcalk.count"
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
