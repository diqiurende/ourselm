// router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/Index.vue';
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import BusinessList from "@/views/BusinessList.vue";
import businessInfo from "@/views/BusinessInfo.vue";
import Order from "@/views/Order.vue";
import PayMent from "@/views/PayMent.vue";
import UserAddress from "@/views/UserAddress.vue";
import AddUserAddress from "@/views/AddUserAddress.vue";
import EditUserAddress from "@/views/EditUserAddress.vue";
import OrderList from "@/views/OrderList.vue";

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
    },
    {
        path:'/login',
        name:'Login',
        component: Login,
    },
    {
        path:'/register',
        name:'Register',
        component: Register,
    },
    {
        path:'/businesslist',
        name:'BusinessList',
        component: BusinessList,
    },
    {
        path:'/businessInfo',
        name:'BusinessInfo',
        component: businessInfo,
    },
    {
        path:'/tooder',
        name:'tooder',
        component: Order,
    },
    {
        path:'/topayment',
        name:'PayMent',
        component: PayMent,
    },{
        path:'/userAddress',
        name:'UserAddress',
        component: UserAddress
    },{
        path:'/addUserAddress',
        name: 'AddUserAddress',
        component: AddUserAddress
    },{
        path: '/editUserAddress',
        name: '/EditUserAddress',
        component: EditUserAddress
    },{
    path: '/orderlist',
        name: 'Orderlist',
        component: OrderList
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
