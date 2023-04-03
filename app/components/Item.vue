<template>
  {{ test }}
</template>

<script setup lang="ts">
  const getData = async () => {
    await new Promise((r) => setTimeout(r, 3000));

    return 'blobbasdas';
  };

  const test = await getData();
</script>
