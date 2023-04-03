<template>
  <NuxtLayout name="default">
    <div class="flex justify-center items-center h-full">
      <div
        class="t-7 text-center min-w-fit min-h-fit bg-neutral-900 p-5 rounded-lg">
        <p class="mt-7 text-7xl font-bold">{{ error.statusCode }}</p>
        <div class="mt-7 text-6xl flex flex-row justify-center items-center">
          <img class="max-w-[5rem]" src="/sbCry.png" alt="" />
          <p>Ooops</p>
        </div>
        <p class="mt-7">{{ error.statusMessage }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
  const props = defineProps(['error']);
</script>

<style scoped></style>
