<template>
  <el-upload
    name="file"
    :show-file-list="false"
    :multiple="false"
    :http-request="uploadImage"
  >
    <div class="cover-upload-btn">
      <template v-if="!modelValue"> upload </template>
      <template v-else>
        <img :src="proxy.GlobalConstants.imageUrl+modelValue" alt="cover" style="width: 100%; height: 100%"
      /></template>
    </div>
  </el-upload>
</template>

<script setup>
import { getCurrentInstance } from "vue";

const {proxy} = getCurrentInstance();
const api = {
    uploadUrl:"file/uploadImage"
}
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  }
});
const emit = defineEmits(['update:modelValue']);
const uploadImage = async (file) => {
    console.log(file);
    let result = await proxy.Request({
        url: api.uploadUrl,
        dataType:"file",
        params:{
            file: file.file,
            type: 0
        }
    })
    const fileName = result.data.fileName;
    console.log(fileName);
    emit("update:modelValue", fileName)
    console.log(props.modelValue);
};
const init = () => {
  console.log(props.modelValue);
  console.log(props.a);
};
init()
</script>

<style lang="scss">
.cover-upload-btn {
  width: 150px;
  height: 150px;
  border: #ddd solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
