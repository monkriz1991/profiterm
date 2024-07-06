<script setup>
import { useMainStore } from "~/store/maindata";
const mainData = useMainStore();
import { useWindowSize } from "@vueuse/core";
const { data: user, signOut } = useAuth();
const visibleDrawer = ref(false);
const noneEl = ref(false);
const windowWidth = ref("");
const menyMobail = ref(false);
const Exit = async () => {
  await signOut();
};
// const visibleDrawer = (item) => {
//   menyMobail.value = item;
// };
const { width, height } = useWindowSize();
watchEffect(() => {
  windowWidth.value = width.value;
});

const monDataNav = computed(() => mainData.getMain);
const phone = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0].phone : ""
);
const dopphone = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0].dopphone : ""
);
mainData.fetchData();
</script>
<template>
  <div class="bd-docs-main fix-nav">
    <div class="container">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand-header">
          <nuxt-link to="/"><img src="/logotip.png" /></nuxt-link>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
            <nuxt-link to="/catalog">Наши работы</nuxt-link>
            <nuxt-link to="/installment" class="mobail-none"
              >Рассрочка платежа</nuxt-link
            >
            <nuxt-link to="/about" class="mobail-none">О нас</nuxt-link>
            <nuxt-link to="/contacts" class="mobail-none">Контакты</nuxt-link>
          </div>
        </div>
        <ClientOnly>
          <div v-if="windowWidth > 700" class="navbar-phone">
            <a :href="`tel:+37529` + phone" class="mobail-hide"
              >{{ phone }} <Icon name="ph:phone-thin"
            /></a>
          </div>
          <div v-if="windowWidth < 700" class="navbar-phone-mobail">
            <el-dropdown trigger="click" popper-class="dropdown-header">
              <button class="button">
                <span class="icon"><Icon name="ph:phone-thin" /></span>
              </button>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <a :href="`tel:+37529` + phone" class="mobail-hide"
                      >{{ phone }}
                    </a></el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </ClientOnly>
        <ClientOnly>
          <div v-if="windowWidth < 700" class="mobail-meny">
            <button
              class="button hm-mobail"
              @click="visibleDrawer = !visibleDrawer"
            >
              <span class="icon">
                <Icon
                  :name="
                    menyMobail
                      ? 'solar:close-circle-broken'
                      : 'solar:hamburger-menu-broken'
                  "
                />
              </span>
            </button>
            <el-drawer v-model="visibleDrawer" class="meny-nav-cat">
              <div class="meny-nav">
                <nuxt-link to="/" @click="visibleDrawer = !visibleDrawer"
                  >Главная</nuxt-link
                >
                <nuxt-link to="/catalog" @click="visibleDrawer = !visibleDrawer"
                  >Наши работы</nuxt-link
                >
                <nuxt-link
                  to="/installment"
                  @click="visibleDrawer = !visibleDrawer"
                  >Рассрочка платежа</nuxt-link
                >
                <nuxt-link to="/about" @click="visibleDrawer = !visibleDrawer"
                  >О нас</nuxt-link
                >
                <nuxt-link
                  to="/contacts"
                  @click="visibleDrawer = !visibleDrawer"
                  >Контакты</nuxt-link
                >
              </div>
            </el-drawer>
          </div>
        </ClientOnly>
        <div class="mobail-none admin-meny">
          <div v-if="user == null" class="">
            <div v-if="noneEl" class="buttons">
              <nuxt-link class="button is-primary" to="/login/"
                >Login</nuxt-link
              >
              <nuxt-link class="button is-light" to="/registration/"
                >Reg</nuxt-link
              >
            </div>
          </div>
          <div v-else class="">
            <div class="buttons">
              <nuxt-link class="button is-primary" to="/cabinet/"
                >Cabinet</nuxt-link
              >
              <button @click="Exit" class="button">Exit</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<style>
.header {
  /* float: left;
  width: 100%; */
  padding: 20px 0;
  margin: 0 0 40px;
}
.h-logo {
  float: left;
}
.h-auth {
  float: right;
}
.h-auth a {
  text-decoration: none;
  margin: 0 10px;
}
.h-mongo {
  margin: 0 0 0 20%;
}
</style>
