<script setup lang="ts">
withDefaults(
  defineProps<{
    lorem?: string
    h1_title?: string
  }>(),
  {
    lorem: `Lorem ipsum dolor sit,
      amet consectetur
      adipisicing elit. Autem
      voluptatibus culpa
      ratione dolores itaque,
      consequuntur velit
      dignissimos dolor
      dolorem rem deserunt
      doloremque quidem saepe
      repellat ea, aliquid
      illo alias doloribus.`,
    h1_title: 'Mock content',
  },
)
</script>

<template>
  <div>
    <h1>{{ h1_title }}</h1>
    <p>{{ lorem }}</p>
    <hr />
  </div>
</template>
