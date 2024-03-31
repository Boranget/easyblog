<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="100px"
      class="my-info-form"
    >
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="头像" prop="avatar">
            <CoverUpload v-model="formData.avatar"></CoverUpload>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input
              v-model="formData.nickName"
              placeholder="请输入昵称"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="openPasswordDialog"
              >修改密码</a
            >
          </el-form-item>
          <el-form-item label="默认编辑器" prop="editorType">
            <el-radio-group v-model="formData.editorType">
              <el-radio label="markdown" :value="1">markdown</el-radio>
              <el-radio label="富文本" :value="0">富文本</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="职业" prop="profession">
            <el-input
              v-model="formData.profession"
              placeholder="请输入职业"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="save">
            <el-button type="primary" @click="saveMyInfo">保存</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="个人简介" prop="introduction">
            <HtmlEditor
              v-model="formData.introduction"
              :heightStr="'500px'"
            ></HtmlEditor>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <Dialog
      :if-show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      @close="dialogConfig.show = false"
      width="400px"
    >
      <el-form
        :model="passwordFormData"
        :rules="passwordRules"
        ref="passwordFormDataRef"
        label-width="100px"
      >
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="passwordFormData.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="passwordFormData.confirmPassword"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
import {defindFraneworkData} from "../../utils/framworkData.js"
import VueCookies from "vue-cookies";
const formDataRef = ref(null);
const { proxy } = getCurrentInstance();
const formData = ref({});
const rules = {
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 10, message: "昵称长度在 2 到 10 个字符", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[34578]\d{9}$/,
      message: "手机号格式不正确",
      trigger: "blur",
    },
  ],
};

const api = {
  getUserInfo: "/getUserInfo",
  saveMyInfo: "/saveMyInfo",
};
const getUserInfo = async () => {
  const result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  formData.value = result.data;
};
let frameworkData = defindFraneworkData() 
const userInfo = frameworkData.userInfo
const saveMyInfo = async () => {
  const result = await proxy.Request({
    url: api.saveMyInfo,
    params: {
      userId: formData.value.userId,
      avatar: formData.value.avatar,
      nickName: formData.value.nickName,
      phone: formData.value.phone,
      editorType: formData.value.editorType,
      profession: formData.value.profession,
      introduction: formData.value.introduction,
    },
    
  });
  console.log(formData.value)
  if (!result) {
    return;
  }
  userInfo.value.nickName = formData.value.nickName;
  userInfo.value.avatar = formData.value.avatar;

  VueCookies.set("userInfo", userInfo.value, 0);
  proxy.Msg.success("保存成功");
};
const init = () => {
  getUserInfo();
};
init();

const openPasswordDialog = () => {
  dialogConfig.show = true;
  nextTick(() => {
    passwordFormDataRef.value.resetFields();
  });
};
const passwordFormDataRef = ref(null);
const passwordFormData = ref({});
const passwordRules = ref({
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
  ],
});
const changePassword = () => {
  passwordFormDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    if (
      passwordFormData.value.password !== passwordFormData.value.confirmPassword
    ) {
      proxy.Msg.error("两次输入的密码不一致");
      return;
    }
    const result = await proxy.Request({
      url: "/updateMyPassword",
      params: {
        password: passwordFormData.value.password,
      },
    });
    if (!result) {
      return;
    }
    proxy.Msg.success("密码修改成功");
    passwordFormData.value = {};
    dialogConfig.show = false;
  });
};
const dialogConfig = reactive({
  show: false,
  title: "修改密码",
  buttons: [
    {
      type: "primary",
      text: "确定",
      size: "small",
      click: () => {
        changePassword();
      },
    },
  ],
});
</script>
<style scoped lang="scss">
.a-link {
  text-decoration: none;
  color: cornflowerblue;
}
</style>
