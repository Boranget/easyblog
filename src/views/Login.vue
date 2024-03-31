<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <!-- 在这里给表单绑定回车事件 -->
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        @keyup.enter.native="login"
      >
        <el-form-item prop="account">
          <el-input
            placeholder="请输入账号"
            v-model="formData.account"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="formData.password"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              class="input"
              placeholder="请输入验证码"
              v-model="formData.checkCode"
              size="large"
            />
            <img :src="checkUrl" alt="网络异常" @click="changeCode" />
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="formData.rememberMe" :label="true"
            >记住我</el-checkbox
          >
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            size="large"
            @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from "vue";
import md5 from "js-md5";
import VueCookies from "vue-cookies";
import { useRouter } from "vue-router";
import message from "@/utils/Message";
const router = useRouter();
const { proxy } = getCurrentInstance();
const formData = reactive({});
// 验证码相关
const checkUrl = ref(`api/checkCode?${new Date().getTime()}`);
const changeCode = () => {
  checkUrl.value = `api/checkCode?${new Date().getTime()}`;
};
// 输入框公共属性
const rules = {
  account: [
    {
      required: true,
      message: "请输入账号",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "请输入验证码",
    },
  ],
};
// 表单相关
const formDataRef = ref();
const loginUrl = "login";

const init = () => {
  let u_p = VueCookies.get("loginInfo");
  Object.assign(formData, u_p);
  // document.onkeydown = e => {
  //   console.log(e)
  //   if (e.code !== "Enter") {
  //     return;
  //   }
  //   login()
  // }
};
init();

const login = () => {
  const params = {
    account: formData.account,
    password: md5(formData.password),
    checkCode: formData.checkCode,
  };
  formDataRef.value.validate(async (v) => {
    if (!v) {
      return;
    }
    let result = await proxy.Request({
      url: loginUrl,
      params: params,
      errorCallback: changeCode,
    });
    console.log(result);
    if (!result) {
      return;
    }
    // 这里开始登录成功
    message.success("登录成功");
    setTimeout(() => {
      router.push("/");
    }, 1500);

    const loginInfo = {
      account: formData.account,
      password: formData.password,
      rememberMe: formData.rememberMe,
    };
    VueCookies.set("userInfo", result.data, 0);
    if (formData.rememberMe) {
      VueCookies.set("loginInfo", loginInfo, "7d");
    }
  });
};
</script>

<style lang="scss">
.login-body {
  background-image: url(../assets/login-bg.jpeg);
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;

  .login-panel {
    float: right;
    width: 350px;
    background: rgba(#fff, 0.6);
    margin-top: 150px;
    margin-right: 100px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px #ddd;

    .login-title {
      font-size: 25px;
      text-align: center;
      margin-bottom: 10px;
    }

    .check-code-panel {
      width: 100%;
      display: flex;
      align-items: center;

      .input {
        flex: 1;
        margin-right: 5px;
      }

      img {
        cursor: pointer;
      }
    }
  }
}
</style>
