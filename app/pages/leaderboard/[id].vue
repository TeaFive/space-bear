<template>
  <Suspense :setTimeout="0">
    <template #default>
      <Leaderboard :id="id" />
    </template>
    <template #fallback>Loading...</template>
  </Suspense>
</template>

<script setup lang="ts">
  const { id } = useRoute().params;
  if (id instanceof Array) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bad URL',
      fatal: true,
    });
  }
</script>

<style scoped></style>
