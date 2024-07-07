<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
  }>(),
  {
    title: 'ok',
  },
)
</script>

<template>
  <button>{{ title }}</button>
</template>
