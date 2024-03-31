import { defineStore } from "pinia";
import { ref } from "vue";

export const defindFraneworkData = defineStore("franeworkData",()=>{
  const userInfo = ref({})
  return {
    userInfo
  }
}
 
);
