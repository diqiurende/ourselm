import './assets/main.css'
import './style/tailwind.css'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css';
import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios"
import qs from "qs"
import {
    getCurDate,
    getLocalStorage,
    getSessionStorage,
    removeLocalStorage, removeSessionStorage,
    setLocalStorage,
    setSessionStorage
} from "@/common.js";

const app=createApp(App);

app.config.productionTip = false
//设置axios的基础url部分
axios.defaults.baseURL = 'http://localhost:8080/elm/';
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$qs = qs;
app.config.globalProperties.$getCurDate = getCurDate;
app.config.globalProperties.$setSessionStorage= setSessionStorage;
app.config.globalProperties.$getSessionStorage = getSessionStorage;
app.config.globalProperties.$removeSessionStoragee = removeSessionStorage;
app.config.globalProperties.$setLocalStorage = setLocalStorage;
app.config.globalProperties.$getLocalStorage = getLocalStorage;
app.config.globalProperties.$removeLocalStorage = removeLocalStorage;

app.use(router).mount('#app')
