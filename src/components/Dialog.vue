<template>
  <div>
    <!-- 使用model-value而不是v-model来从props中获取值 -->
    <el-dialog
      :show-close="needCloseBtn"
      :draggable="true"
      :model-value="ifShow"
      :close-on-click-modal="needCloseBtn"
      :close-on-press-escape="needCloseBtn"
      :title="title"
      class="cust-dialog"
      :top="top"
      :width="width"
    >
      <div :class="buttons ? 'dialog-body-with-button' : 'dialog-body'">
        <slot></slot>
      </div>
      <div class="fotter">
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
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  ifShow: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  top: {
    type: String,
    default: "50px",
  },
  width: {
    type: String,
    default: "30%",
  },
  buttons: {
    type: Array,
  },
});
console.log(props.buttons)
const needCloseBtn=(props.buttons == null || props.buttons.length == 0);
const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};

</script>

<style lang="scss">
.cust-dialog {
  padding: 0px;
  .el-dialog__header {
    padding: 10px;
  }
  .dialog-body-with-button {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 10px;
    min-height: 60px;
  }
  .dialog-body {
    border-top: 1px solid #ddd;
    padding: 10px;
    min-height: 60px;
  }
  .fotter {
    text-align: right;
    padding: 10px;
  }
}
</style>
