<template>
  <div class="cover">
    <img
      :src="proxy.GlobalConstants.imageUrl+cover"
     v-if="cover"/>
     <img src="https://ts1.cn.mm.bing.net/th?id=OIP.7ochc2NJTtvqjeYhwpQsKwAAAA&w=298&h=204&c=12&rs=1&qlt=99&pcl=faf9f7&o=6&dpr=1.3&pid=MultiSMRSV2Source" v-else>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const props = defineProps({
  cover: {
    type: String,
  },
});
const { proxy } = getCurrentInstance();
</script>

<style lang="scss">
.cover {
  background: #ddd;
  display: flex;
  align-items: center;
  height: 60px;
  width: 60px;
  img {
    width: 100%;
  }
}
</style>
