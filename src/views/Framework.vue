<template>
   <div class="layout">
      <el-container class="container-out">
         <el-header class="header">
            <div class="logo">Easy</div>
            <div class="user">
               <el-dropdown>
                  <span class="userName">
                     {{ userInfo.value.nickName }}
                  </span>
                  <template #dropdown>
                     <el-dropdown-menu>
                        <el-dropdown-item>
                           <router-link to="/settings/myInfo">个人信息</router-link></el-dropdown-item>
                        <el-dropdown-item @click="logout">退出</el-dropdown-item>
                     </el-dropdown-menu>
                  </template>
               </el-dropdown>
               <img :src="`/api/file/getImage/${userInfo.value.avatar}`" class="avatar" />
            </div>

         </el-header>
         <el-container class="container-in">
            <el-aside width="200px" class="left-asside">
               <div>
                  <el-button class="post-btn">发布</el-button>
                  <div class="menu">
                     <ul class="menu-list">
                        <li v-for="i, index in menuList" :key=index>
                           <span class="menu-item" @click="open_close_menu(index)">
                              <span :class="['iconfont', i.icon, 'menu-icon']"></span>
                              <span class="menu-title">{{ i.title }}</span>
                              <span :class="['iconfont', i.open ? 'icon-open' : 'icon-close', 'open-close']"></span>
                           </span>
                           <div v-show="i.open">
                              <ul class="sub-menu-list">
                                 <li v-for="j, index in i.childrens" :key=index>
                                    <router-link :to="j.path" :class="['sub-menu-item',currentPath==j.path?'active':'']">{{ j.title }}</router-link>
                                 </li>
                              </ul>
                           </div>
                        </li>
                     </ul>
                  </div>
               </div>
            </el-aside>
            <el-main class="right-main"><router-view  /></el-main>
         </el-container>
      </el-container>
   </div>
</template>

<script setup>
import { getCurrentInstance, ref, watch } from 'vue';
import VueCookies from "vue-cookies";
import { useRouter, useRoute } from 'vue-router';
import {defindFraneworkData} from "../utils/framworkData.js"
const { proxy } = getCurrentInstance()
const router = useRouter();
const route = useRoute();
const menuList = ref([
   {
      title: "博客",
      icon: "icon-blog",
      open: true,
      childrens: [
         {
            title: "博客管理",
            path: "/blog/list"
         },
         {
            title: "分类管理",
            path: "/blog/category"
         }
      ]
   },
   {
      title: "专题",
      icon: "icon-tag",
      open: true,
      childrens: [
         {
            title: "专题管理",
            path: "/special/list"
         }
      ]
   },
   {
      title: "设置",
      icon: "icon-setting",
      open: true,
      childrens: [
         {
            title: "个人信息设置",
            path: "/settings/myInfo"
         },
         {
            title: "系统设置",
            path: "/settings/sysSetting"
         }
      ]
   }
]);
let frameworkData = defindFraneworkData() 
const userInfo = frameworkData.userInfo
const init = () => {
   userInfo.value=VueCookies.get("userInfo");
}
init()
const currentPath = ref({});
watch(route,(n,o)=>{
   currentPath.value = n.path;
},{
   immediate:true,
   deep:true
})
const logout = () => {
   VueCookies.remove("userInfo");
   proxy.Msg.success("退出成功")
   router.push("/login")
}
const open_close_menu = (i) => {
   menuList.value[i].open = !menuList.value[i].open;
}
</script>

<style lang="scss">
.layout {
   .container-out {
      .header {
         border-bottom: 1px solid #ddd;
         height: 60px;
         background: white;
         display: flex;
         justify-content: space-between;
         align-items: center;
         line-height: 60px;

         .logo {
            font-size: 30px;
            vertical-align: middle;
         }

         .user {
            display: flex;
            height: 60px;
            align-items: center;

            .userName {
               margin-right: 10px;
               font-size: 15px;
               cursor: pointer;
               color: rgb(6, 143, 234);
            }
            .avatar {
               vertical-align: middle;
               height: 50px;
               width: 50px;
               border-radius: 25px;
               border: #ddd solid 1px;
               background: #ddd;
            }

         }

      }

      .container-in {
         padding-top: 10px;
         height: calc(100vh - 60px);
         background: #f4f6f6;

         .left-asside {
            padding: 5px 10px;

            .post-btn {
               background: green;
               color: #fff;
               height: 35px;
               width: 100%;
            }

            .menu {
               padding: 10px 2px;

               .menu-list {
                  list-style-type: none;
                  padding: 0px;
                  margin: 0px;

                  .menu-item {
                     vertical-align: middle;
                     display: flex;
                     line-height: 40px;

                     .menu-title {
                        padding-left: 10px;
                        flex: 1;
                        cursor: pointer;
                        color: #3f4042;
                     }
                  }

                  .menu-item:hover {
                     background-color: #ddd;
                  }

                  .sub-menu-list {
                     list-style-type: none;
                     margin: 0px;
                     padding: 0px;

                     .sub-menu-item {
                        padding-left: 25px;
                        display: block;
                        line-height: 30px;
                        font-size: 14px;
                        cursor: pointer;
                        text-decoration: none;
                        color: #3f4042;
                     }

                     .sub-menu-item:hover {
                        background-color: #ddd;
                     }
                     .active{
                        background-color: #ddd;
                     }
                  }
               }
            }

         }

         .right-main {
            background-color: white;
            position: relative;
            top: 0;
            left: 0;
         }
      }
   }
}
</style>