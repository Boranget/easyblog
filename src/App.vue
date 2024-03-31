
<template>
 <div>
    <el-config-provider :locale="zhCn" :message="config">
        <router-view></router-view>
    </el-config-provider>
 </div>
</template>
<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { reactive } from 'vue';
// 弹框？
const config = reactive({
    max:1
})
</script>


<style scoped>

</style>
