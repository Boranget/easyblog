<template>
  <div class="body">
    <el-form
      ref="editFormRef"
      :style="{ width: '50%' }"
      :model="formData"
      :rules="rules"
      :label-width="'200px'"
    >
      <el-form-item label="是否开启评论" prop="openCommentType">
        <div>
          <el-radio-group v-model="formData.openCommentType">
            <el-radio label="1" value="1">开启</el-radio>
            <el-radio label="0" value="0">关闭</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <template v-if="formData.openCommentType === '1'">
        <el-form-item label="畅言AppId" prop="changyanAppId">
          <el-input
            v-model="formData.changyanAppId"
            :maxlength="50"
            placeholder="请输入畅言AppId"
          ></el-input>
        </el-form-item>
        <el-form-item label="畅言AppKey" prop="changyanAppKey">
          <el-input
            v-model="formData.changyanAppKey"
            :maxlength="50"
            placeholder="请输入畅言AppKey"
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item label="是否开启Git pages" prop="gitPagesType">
        <div>
          <el-radio-group v-model="formData.gitPagesType">
            <el-radio label="1" value="1">开启</el-radio>
            <el-radio label="0" value="0">关闭</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="是否开启公安备案和ICP备案" prop="showICP">
        <div>
          <el-radio-group v-model="formData.showICP">
            <el-radio label="1" value="1">显示</el-radio>
            <el-radio label="0" value="0">隐藏</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="ICP备案链接" prop="icpDomin">
        <el-input v-model="formData.icpDomin" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="ICP备案号" prop="icpNo">
        <el-input v-model="formData.icpNo" :maxlength="100"></el-input>
      </el-form-item>

      <el-form-item label="公安备案省份" pro="policeProvince">
        <el-select
          v-model="formData.policeProvince"
          placeholder="请选择省份"
          clearable
          showSearch
        >
          <el-option
            v-for="item in provinceList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公安备案号" prop="policeNo">
        <el-input v-model="formData.policeNo" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="下载静态页面">
        <div>
          <a href="javascript:void(0)" class="alink" @click="createZip()"
            >点击下载静态页面</a
          >
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  getSysSetting: "sysSetting/getSysSetting",
  saveSysSetting: "sysSetting/saveSysSetting",
  createZip: "sysSetting/createZip",
};
const formData = reactive({});
const provinceList = ["京", "津", "冀", "晋", "蒙", "辽", "吉", "黑", "沪", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "粤", "桂", "琼", "川", "贵", "云", "藏", "陕", "甘", "青", "宁", "新","台","港","澳"];

const rules = {
  openCommentType: [
    { required: true, message: "请选择是否开启评论", trigger: "change" },
  ],
  changyanAppId: [
    { required: true, message: "请输入畅言AppId", trigger: "blur" },
  ],
  changyanAppKey: [
    { required: true, message: "请输入畅言AppKey", trigger: "blur" },
  ],
  gitPagesType: [
    { required: true, message: "请选择是否开启Git pages", trigger: "change" },
  ],
  showICP: [
    {
      required: true,
      message: "请选择是否开启公安备案和ICP备案",
      trigger: "change",
    },
  ],
  icpDomin: [{ required: true, message: "请输入ICP备案链接", trigger: "blur" }],
  icpNo: [{ required: true, message: "请输入ICP备案号", trigger: "blur" }],
  policeProvince: [
    { required: true, message: "请选择公安备案省份", trigger: "change" },
  ],
  policeNo: [{ required: true, message: "请输入公安备案号", trigger: "blur" }],
};
const getSysSetting = async () => {
  const result = await proxy.Request({
    url: api.getSysSetting,
  });
  if (!result) {
    return;
  }
  Object.assign(formData, result.data);
};
getSysSetting();
const editFormRef = ref(null);
const submitForm = () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      let params = {};
      Object.assign(params, formData);
      const result = await proxy.Request({
        url: api.saveSysSetting,
        data: params,
      });
      if (result) {
        proxy.Msg.success("保存成功");
      } else {
        proxy.Msg.error("保存失败");
      }
    } else {
      return false;
    }
  });
};
const createZip = async () => {
  const result = await proxy.Request({
    url: api.createZip,
  });
  if (!result) {
    return;
  }
  document.location.href =
    "/api/file/download/" + result.data + "/" + encodeURI("静态页面.zip");
};
</script>
