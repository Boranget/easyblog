<template>
  <div>
    <!--  -->
    {{ content }}
    <HtmlEditor v-model="content"></HtmlEditor>
  </div>
</template>

<script setup>
import { ref } from "vue";

const content = ref("");
</script>

<style lang="scss" scoped></style>
