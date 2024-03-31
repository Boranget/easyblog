<template>
  <div>
    <Window
      :ifShow="windowConfig.show"
      :buttons="windowConfig.buttons"
      @close="windowConfig.show = false"
    >
      <div class="blog-preview">
        <h1>{{ blog.title }}</h1>
        <div v-html="blog.content"></div>
      </div>
    </Window>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  getBlogDetail: "/blog/getBlogById",
};
const windowConfig = reactive({
  show: false,
  buttons: [],
});
const blog = ref({});
const showDetail = async (id) => {
  windowConfig.show = true;
  const result = await proxy.Request({
    url: api.getBlogDetail,
    params: {
      blogId: id,
    },
  });
  if (!result) {
    return;
  }

  blog.value = result.data;
  windowConfig.show = true;
};

defineExpose({
  showDetail,
});
</script>

<style lang="scss" scoped>
.blog-preview {
  margin: 25px;


}
</style>
