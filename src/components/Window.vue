<template>
  <div class="window" v-if="ifShow">
    <div class="top">
      <div class="return" @click="close">↩</div>
      <div class="title"></div>
      <div class="space"></div>
    </div>
    <div class="body">
      <slot></slot>
    </div>

    <div class="footer">
      <template v-if="buttons && buttons.length > 0">
        <el-button
          v-for="(btn, index) in buttons"
          :type="btn.type"
          @click="btn.click"
          :key="index"
        >
          {{ btn.text }}
        </el-button>
        <el-button type="" @click="close"> 取消 </el-button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  ifShow: {
    type: Boolean,
    default: false,
  },
  buttons: {
    type: Array,
    default: null,
  },
});
const emit = defineEmits(["close","init"]);
const init = () => {
  emit("init");
};
init();
const close = () => {
  emit("close");
};
</script>
<style lang="scss">
.window {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 5;
  display: flex;
  flex-direction   : column;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    .return {
      width: 50px;
      padding: 0px 10px;
      font-size: 20px;
      cursor: pointer;
      text-align: center;
    }
    .title {
      font-size: 20px;
    }
    .space {
      width: 50px;
    }
  }
  .body {
    flex: 1;
    overflow: hidden;
  }
  .footer {
    border-top: #888888 solid 1px;
    text-align: right;
    padding-right: 10px;
    display: flex;
    justify-content: right;
    align-items: center;
    height: 50px;
  }
}
</style>
