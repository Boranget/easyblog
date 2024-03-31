import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/assets/icon/iconfont.css"
import Request from '@/utils/Request'
import message from '@/utils/Message'
import Confirm from '@/utils/Confirm'
import Table from '@/components/Table.vue'
import Cover from '@/components/Cover.vue'
import Dialog from '@/components/Dialog.vue'
import Window from '@/components/Window.vue'
import MarkDownEditor from '@/components/MarkDownEditor.vue'
import VueMarkdownEditor from '@kangc/v-md-editor'
import HtmlEditor from '@/components/HtmlEditor.vue'
import CoverUpload from "@/components/CoverUpload.vue";
import BlogPreviewWindow from "@/components/BlogPreviewWindow.vue";
import { createPinia } from 'pinia';
const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.use(VueMarkdownEditor);
app.config.globalProperties.Request = Request;
app.config.globalProperties.Msg = message;
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.GlobalConstants = {
    "imageUrl":"/api/file/getImage/"
};
app.component("Table",Table)
app.component("Dialog",Dialog)
app.component("Cover",Cover)
app.component("Cover",Cover)
app.component("Window",Window)
app.component("MarkDownEditor",MarkDownEditor)
app.component("HtmlEditor",HtmlEditor)
app.component("CoverUpload",CoverUpload)
app.component("BlogPreviewWindow",BlogPreviewWindow)
app.mount('#app')
