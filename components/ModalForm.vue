<script setup>
const visible = ref(false);
</script>
<template>
  <div>
    <!-- Form -->
    <button class="button index-b-modal" @click="visible = true">
      Оформить заявку
    </button>
    <ClientOnly>
      <el-dialog v-model="visible" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
          <div class="my-header">
            <h4 :id="titleId" :class="titleClass">This is a custom header!</h4>
            <el-button type="danger" @click="close"> Close </el-button>
          </div>
        </template>
        This is dialog content.
      </el-dialog>
    </ClientOnly>
  </div>
</template>
