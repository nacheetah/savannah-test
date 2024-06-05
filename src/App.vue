<template>
  <nav class="py-7 px-20 border-b">
    <h2 class="text-2xl font-bold">Sopuluchukwu</h2>
  </nav>
  <div class="w-full flex flex-col items-center mt-12">

    <RouterView v-slot="{ Component }">
      <component :is="Component"></component>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'


</script>

<style lang="scss" scoped></style>
