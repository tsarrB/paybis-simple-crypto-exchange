<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '~/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import
</script>

<template>
  <div class="container mx-auto p-8">
    <RouterView />

    <Toaster position="top-right" />
  </div>
</template>

<style lang="scss"></style>
