<template>
  <div>
    <v-md-editor
      v-model="content"
      :height="heightStr"
      :disabled-menus="[]"
      :include-level="[1, 2, 3, 4, 5, 6]"
      @upload-image="handleUploadImage"
      @change="onChange"
    ></v-md-editor>
  </div>
</template>
<script setup>
import { getCurrentInstance, ref ,  computed} from "vue";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import VueMarkdownEditor from "@kangc/v-md-editor";
import Prism from "prismjs";
const { proxy } = getCurrentInstance();

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  heightStr: {
    type: String,
    default: "300px",
  },
});
// 初始化使用props中的modelValue
const content = ref(props.modelValue);
const handleUploadImage = async (event, insertImage, files) => {
  const result = await proxy.Request({
    url: "file/uploadImage",
    dataType: "file",
    params: {
      file: files[0],
      type: 1,
    },
  });
  if (!result) {
    return;
  }
  insertImage({
    url: proxy.GlobalConstants.imageUrl + result.data.fileName,
    desc: "123",
  });
};
// 更新传入的modelValue
const emit = defineEmits(["update:modelValue", "setHtmlContent"]);
const onChange = (md, html) => {
  emit("update:modelValue", md);
  emit("setHtmlContent", html);
};
</script>
<style lang="scss" scoped></style>
