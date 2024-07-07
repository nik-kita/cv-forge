<script setup lang="ts">
import Button from '@/components/Button.vue'

defineProps<{
  user?: {
    username?: string
  } | null
}>()
</script>

<template>
  <Button v-if="user"
    >Logout</Button
  >
  <div v-else>Login</div>
  <slot></slot>
</template>
