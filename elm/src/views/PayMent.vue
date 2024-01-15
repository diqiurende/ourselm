<script setup>
import Footer from "@/components/Footer.vue";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
const route = useRoute()
const router = useRouter()
const orderId = ref(route.query.orderId)
const orders = ref({})
const isShowDetailet = ref(false)
onMounted(()=>{
  axios.get("OrdersController/getOrdersById",{params:{orderId:orderId.value}}).then(response=>{
    orders.value = response.data;
  }).catch(error=>{
    console.log(error)
  })
})

function  showdetail(){
  isShowDetailet.value = !isShowDetailet.value
}
function confirmorder(){
  axios.get("OrdersController/setPayflag").then(response=>{
    if (response.data===1){
      alert("支付成功！")
    }
  }).catch(error=>{
    console.log(error)
  })
}
</script>

<template>
  <div class="w-full h-full">

    <!--header部分-->
    <header class="w-full h-24 bg-[#0097FF] text-white text-4xl fixed  top-0  flex justify-center items-center">
      <p >在线支付</p>
    </header>

    <!--订单信息部分-->
    <h3 class="mt-[12vw] box-border pt-[4vw] px-[4vw] pb-0 text-3xl font-light text-[#999999FF]">订单信息：</h3>
    <div class="box-border p-[4vw] text-3xl text-[#666666FF] flex flex-row justify-between items-center">
      <p class="flex flex-row justify-between items-center">
       {{orders.business.businessName}}
        <svg class="flex" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32" @click="showdetail"><path fill="currentColor" d="m24 12l-8 10l-8-10z"/></svg>
      </p>
      <p class="text-red-500">&#165;{{ orders.orderTotal }}</p>
    </div>

    <!--订单明细部分-->
    <ul class="w-full" id="detaletBox" v-show="isShowDetailet">
      <li class="w-full box-border py-[1vw] px-[4vw] flex justify-between items-center" v-for="(item,key) in orders.list">
        <p class="text-2xl text-[#666666FF]">{{ item.food.foodName }} x {{item.quantity}}</p>
        <p class="text-2xl text-[#666666FF]">&#165;{{item.food.foodPrice * item.quantity}}</p>
      </li>
      <li class="w-full box-border py-[1vw] px-[4vw] flex justify-between items-center">
        <p class="text-2xl text-[#666666FF]">配送费</p>
        <p class="text-2xl text-[#666666FF]">&#165;{{orders.business.deliveryPrice}}</p>
      </li>
    </ul>

    <!--支付方式-->
    <ul class="w-full">
      <li class="w-full box-border p-[4vw] flex justify-between items-center">
        <img class="w-[33vw] h-[8.9vw]" src="../assets/img/alipay.png"/>
        <svg class="text-[#38CA73FF]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
      </li>
      <li class="w-full box-border p-[4vw] flex justify-between items-center">
        <img class="w-[33vw] h-[8.9vw]" src="../assets/img/wechat.png" />
      </li>
    </ul>
    <div class="w-full flex-col h-30 flex box-border pt-[4vw] px-[3vw] pb-0 justify-center items-center">
      <button class="w-full h-20 text-3xl font-bold text-white bg-[#38CA73FF] rounded-[4px] border-none outline-none" @click="confirmorder">确认支付</button>
    </div>

    <!--底部菜单部分-->
      <Footer></Footer>
  </div>
</template>

<style scoped>

</style>
