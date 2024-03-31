<template>
  <div style="border: 1px solid #ccc" class="html-editor" :style="{ height: heightStr }">
    <Toolbar
      class="toolbar"
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="editor"
      v-model="content"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="onChange"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import {
  getCurrentInstance,
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  computed,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

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
const content = computed(()=>props.modelValue);
const mode = ref("default"); // 编辑器模式，可选值：default、simple、full
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("<p>hello</p>");
const toolbarConfig = {};
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 2 * 1024 * 1024, // 2M
      server: "/api/file/uploadImage4WangEditor",
      customInsert(res, insertFn) {
        insertFn(res.data.url);
      },
    },
  },
};

const emit = defineEmits();
const onChange = (editor) => {
  emit("update:modelValue", editor.getHtml());
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<style lang="scss" scoped>

</style>
