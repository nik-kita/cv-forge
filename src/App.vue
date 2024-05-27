<script setup lang="ts">
import {RouterView} from 'vue-router'
import {use_x} from './use_x'

const {xapp_state, xrouter_state} = use_x()
</script>

<template>
  <RouterView />
  <pre>
    {{ JSON.stringify(xapp_state, null, 2) }}
------------------------------------------------------
    {{ JSON.stringify(xrouter_state, null, 2) }}
  </pre>
</template>
