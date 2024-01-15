<script setup>
import {onMounted, ref} from "vue";
import {getSessionStorage} from "@/common.js";
import axios from "axios";

const orderArr = ref([])
const user = ref({})

onMounted(()=>{
  user.value = getSessionStorage('user')
  axios.get("/OrdersController/listordersByuser",{params:{userId:user.value.userId}}).then(response=>{
    let orders = response.data
    for(let order of orders){
      order.isShowDetaillet = false;
    }
    orderArr.value = orders;
    console.log(orderArr.value)
  }).catch(error=>{
    console.log(error)
  })
})
</script>

<template>
  <div class="w-full h-full">

    <!--header部分-->
    <header class="w-full h-24 bg-[#0097FFFF] text-white text-4xl fixed top-0  flex justify-center items-center">
      <p >我的订单</p>
    </header>

    <!--订单列表部分-->
    <h3 class=" mt-24 box-border p-[4vw] text-3xl font-light text-[#999999FF]">未支付订单信息：</h3>
    <ul class="w-full">

      <li v-for="(item,key) in orderArr" v-if="item.orderState===0" class="w-full  text-3xl">
        <div class="box-border py-[2vw] px-[4vw]  text-[#666666FF] flex justify-between items-center">
          <p class="flex  justify-between items-center">{{ item.business.businessName }}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" @click="showDetail"><path fill="currentColor" d="m24 12l-8 10l-8-10z"/></svg></p>
          <div class="flex">
            <p class="">&#165;{{item.orderTotal}}</p>
            <div class="bg-[#FF9900FF] text-white rounded-[3px] ml-4 select-none cursor-pointer">去支付</div>
          </div>
        </div>
        <ul class="w-full" v-show="item.isShowDetaillet">
          <li class=" w-full box-border py-[1vw] px-[4vw] text-[#666666FF] text-xl  flex justify-between items-center" v-for="(detail,key) in item.list">
            <p class="">{{detail.food.foodName}} x {{detail.quantity}}</p>
            <p class="">&#165;{{detail.food.foodPrice * detail.quantity}} </p>
          </li>
          <li class=" w-full box-border py-[1vw] px-[4vw] text-[#666666FF] text-xl  flex justify-between items-center">
            <p class="">配送费</p>
            <p class="">&#165;{{item.business.deliveryPrice}}</p>
          </li>

        </ul>
      </li>
    </ul>

    <h3 class=" mt-24 box-border p-[4vw] text-3xl font-light text-[#999999FF]">已支付订单信息：</h3>
    <ul class="w-full">
      <li class="w-full text-3xl" v-for="item in orderArr" v-if="item.orderState===1">
        <div class="box-border py-[2vw] px-[4vw]  text-[#666666FF] flex justify-between items-center">
          <p class="flex flex-row justify-between items-center">
            {{item.business.businessName}}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" @click="showdetail"><path fill="currentColor" d="m24 12l-8 10l-8-10z"/></svg>
          </p>
          <div class="flex">
            <p class="">&#165;{{item.orderTotal}}</p>
            <div class="bg-[#FF9900FF] text-white rounded-[3px] ml-4 select-none cursor-pointer">去支付</div>
          </div>
        </div>
        <ul class="w-full" v-show="item.isShowDetaillet">
          <li class="w-full box-border py-[1vw] px-[4vw] text-[#666666FF] text-xl flex justify-between items-center" v-for="(detail,key) in item.list">
            <p class="">{{detail.food.foodName}} x {{detail.quantity}}</p>
            <p class="">&#165;{{detail.food.foodPrice * detail.quantity}}</p>
          </li>
          <li class="w-full box-border py-[1vw] px-[4vw] text-[#666666FF] text-xl flex justify-between items-center">
            <p class="">配送费</p>
            <p class="">&#165;{{item.business.deliveryPrice}}</p>
          </li>
        </ul>
      </li>
    </ul>

    <!--底部菜单部分-->
    <Footer></Footer>
  </div>
</template>

<style scoped>

</style>
