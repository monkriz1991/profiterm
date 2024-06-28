<script setup>
import { useMainStore } from "~/store/maindata";
import { computed, ref, onMounted } from "vue";

const mainData = useMainStore();
const monDataNav = ref([]);

const phone = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0].phone : ""
);
const dopphone = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0].dopphone : ""
);
const email = computed(() =>
  monDataNav.value.length > 0 ? monDataNav.value[0].email : ""
);

onMounted(async () => {
  await mainData.fetchData();
  monDataNav.value = mainData.getMain;
});
</script>

<template>
  <div class="bd-docs-main">
    <div class="container">
      <footer class="footer">
        <div class="content">
          <p>
            Проектирование, монтаж систем отопления, водоснабжения, канализации.
          </p>
          <p v-if="phone">
            Tel.:<a :href="`tel:+37529` + phone" class="f-phone">{{ phone }}</a>
          </p>
          <p v-if="dopphone">
            Tel.:<a :href="`tel:+37529` + dopphone" class="f-phone">{{
              dopphone
            }}</a>
          </p>
          <p v-if="email">E-mail.: {{ email }}</p>
          <div class="social-links">
            <a href="https://www.instagram.com/profiterm.by/" target="_blank">
              <Icon name="hugeicons:instagram" />
            </a>
            <a href="https://www.facebook.com/profitherm.by" target="_blank">
              <Icon name="hugeicons:facebook-01" />
            </a>
            <a
              href="https://www.youtube.com/channel/UC3wkjV2806LxgRBjtnPR4eQ"
              target="_blank"
            >
              <Icon name="ph:youtube-logo-light" />
            </a>
          </div>
          <p><span>© 2024 «ПРОФИТЕРМ»</span></p>
        </div>
      </footer>
    </div>
  </div>
</template>
