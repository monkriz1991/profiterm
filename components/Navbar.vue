<script setup>
const { data: user, signOut } = useAuth();
const Exit = async () => {
  await signOut();
};
</script>
<template>
  <div class="container">
    <nav
      class="navbar mb-5 pt-2 pb-2"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <nuxt-link to="/"><img src="/logotip.png" /></nuxt-link>
      </div>
      <div class="navbar-menu">
        <!-- <div class="navbar-start">
          <nuxt-link class="navbar-item ml-6" :to="`/mongo/`">Post</nuxt-link>
        </div> -->
        <div class="navbar-start">
          <nuxt-link to="/catalog">Наши работы</nuxt-link>
        </div>
        <!-- <div class="navbar-start">
          <nuxt-link class="navbar-item ml-6" :to="`/email/`">email</nuxt-link>
        </div> -->
      </div>
      <div class="navbar-end">
        <div v-if="user == null" class="navbar-item">
          <div class="buttons">
            <nuxt-link class="button is-primary" to="/login/">Login</nuxt-link>
            <nuxt-link class="button is-light" to="/registration/"
              >Reg</nuxt-link
            >
          </div>
        </div>
        <div v-else class="navbar-item">
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
