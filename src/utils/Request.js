import axios from "axios";
import { ElLoading, ElMessage } from "element-plus";
import message from '@/utils/Message'
import router from "@/router";
const contentTypes = new Map([
    ["form","application/x-www-form-urlencoded;charset=UTF-8"],
    ["json","application/json"],
    ["file","multipart/form-data"]]
)
const request = (config) => {
    let {url, params, dataType = "form", showLoading=true} = config;
    let contenType = contentTypes.get(dataType);
    if(dataType==="file"){
        const param = new FormData();
        for(let key in params){
            param.append(key,params[key])
        }
        params = param;
    }
    const instance = axios.create({
        baseURL:"/api",
        timeout: 10*1000,
        headers:{
            'Content-Type':contenType,
            // 'X-Requested-With':'XMLHttpRequest',
        }
    })
    let loading = null;
    instance.interceptors.request.use(
        (config)=>{
            if(showLoading){
                loading = ElLoading.service({
                    lock: true,
                    text: '加载中~~',
                    background: 'rgba(0,0,0,0.7)'
                })
            }
            return config;
        },
        (error) =>{
            if(showLoading && loading){
                loading.close()
            }
            message.error('请求发送失败')
            return Promise.reject(error)
        }
    )
    instance.interceptors.response.use(
        (res)=>{
            if(showLoading && loading){
                loading.close()
            }
            const resData = res.data;
            if(resData.status === "error"){
                if(config.errorCallback){
                    config.errorCallback()
                }
                return Promise.reject(resData.info)
            }else{
                if(resData.code=="200"){
                    return resData;
                }else if(resData.code=="901"){
                    setTimeout(()=>{
                        router.push("/login")
                    },2000);
                    return Promise.reject("登录超时")
                }
            }
            
        },
        (error) =>{
            if(showLoading && loading){
                loading.close()
            }
            return Promise.reject(error)
        }
    )
    return instance.post(url,params).catch(error=>{
        message.error(error)
        return null;
    })
}
export default request;