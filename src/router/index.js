import {createRouter, createWebHistory} from 'vue-router'
import VueCookies from "vue-cookies";
const routes = [
    {
        name: '登录页',
        path: '/login',
        component: ()=>import('../views/Login.vue'),
    },
    {
        name: '主页',
        path: '/',
        component: ()=>import('../views/Framework.vue'),
        redirect: '/blog/list',
        children:[
            {
                path:"/blog/test",
                name:"测试页面",
                component:()=>import('../views/blog/Test.vue')
            },
            {
                path:"/blog/list",
                name:"博客管理",
                component:()=>import('../views/blog/Blog-list.vue')
            },
            {
                path:"/blog/category",
                name:"分类管理",
                component:()=>import('../views/blog/Blog-category.vue')
            },
            {
                path:"/special/list",
                name:"专题管理",
                component:()=>import('../views/special/SpecialList.vue')
            },
            {
                path:"/settings/myInfo",
                name:"个人信息",
                component:()=>import('../views/settings/MyInfo.vue')
            },
            {
                path:"/settings/sysSetting",
                name:"系统设置",
                component:()=>import('../views/settings/SysSetting.vue')
            },
            
        ]
    }
];
const router = createRouter({
    routes,
    history: createWebHistory(),
})
router.beforeEach((to, from, next) => {
    const ui = VueCookies.get("userInfo");
    if (!ui && to.path!= "/login"){
        router.push("/login")
    }
    next();
});
export default router