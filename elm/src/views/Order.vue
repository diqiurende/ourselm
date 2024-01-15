<script setup>
import Header from "@/components/Header.vue";
import Footer   from "@/components/Footer.vue";
import {useRoute, useRouter} from 'vue-router';
import {computed, onMounted, ref} from "vue";
import {getLocalStorage, getSessionStorage} from "@/common.js";
import axios from "axios";
import qs from "qs";
const router = useRouter()
const route = useRoute()
const businessId = ref(route.query.businessId)
const business = ref({})
const userInfo = ref({})
const user = ref({})
const cartArr = ref([])
const deliveryAddress = ref({})
const topayment=()=>{
  if(deliveryAddress.value==null){
    alert('请选择送货地址！');
    return;
  }

  //创建订单
  axios.post('OrdersController/generateOrders',{
    userId:user.value.userId,
    businessId:businessId.value,
    daId:deliveryAddress.value.daId,
    orderTotal:totalPrice.value
  }).then(response=>{
    let orderId = response.data;
    if(orderId>0){
      router.push({path:'/payment',query:{orderId:orderId}});
    }else{
      alert('创建订单失败！');
    }
  }).catch(error=>{
    console.error(error);
  });
}

function toUserAddress(){
  router.push({path:'/userAddress',query:{businessId:businessId.value}});
}

onMounted(()=>{
  user.value = getSessionStorage('user')
  deliveryAddress.value = getLocalStorage(user.value.userId)
  axios.get("BusinessController/getBusinessById",{params:{bus_id:businessId.value}}).then(response=>{
    business.value = response.data;
  }).catch(error=>{
    console.log(error)
  })

  axios.post('CartController/listCart',{
    userId:user.value.userId,
    businessId:business.value.businessId
  }).then(response=>{
    cartArr.value = response.data;
    console.log(cartArr.value)
  }).catch(error=>{
    console.error(error);
  });
})

const totalPrice = computed(()=>{
  let totalPrice = 0;
  for(let cartItem of cartArr.value){
    totalPrice += cartItem.food.foodPrice*cartItem.quantity;
  }
  totalPrice += business.deliveryPrice;
  return totalPrice;
})

const sex = computed(()=>{
  if(user.value.userSex===1){
    return "先生"
  }
  else if(user.value.userSex===0){
    return "女士"
  }
})
</script>

<template>
  <div class="w-full h-full">
    <!--header部分-->
    <header class="flex w-full h-24 font-medium justify-center items-center bg-[#0097FFFF] text-4xl  fixed left-0 top-0 z-50 text-white ">
      <p>确认订单</p>
    </header>
    <!--订单信息部分-->
    <div class="w-full mt-24 bg-[#0097FFFF] box-border p-[2vw] text-white">
      <h5 class="text-2xl font-light">订单配送至：</h5>
      <div class="flex w-full justify-between items-center font-bold select-none cursor-pointer" @click="toUserAddress">
        <p class="w-[90%] text-4xl">{{deliveryAddress!==null?deliveryAddress.address:'请选择送货地址'}}</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.54 11.29L9.88 5.64a1 1 0 0 0-1.42 0a1 1 0 0 0 0 1.41l4.95 5L8.46 17a1 1 0 0 0 0 1.41a1 1 0 0 0 .71.3a1 1 0 0 0 .71-.3l5.66-5.65a1 1 0 0 0 0-1.47Z"/></svg>

      </div>
      <p class="text-2xl mt-3">{{user.userName}} {{sex}}{{user.userId}}</p>
    </div>


    <h3 class="box-border p-[3vw] text-3xl font-bold text-[#666666FF]   border-b-2  border-black pb-5 border-b-[#DDDDDDFF]">万家饺子（软件园E18店）</h3>

    <!--        订单明细部分-->
    <ul class="w-full">
      <li class="w-full h-32 box-border p-[3vw] text-[#666666FF] flex justify-between items-center" v-for="(item,key) in cartArr">
        <div class="flex items-center">
          <img :src="item.food.foodImg"
               height="40" width="40"/>
          <p class="text-3xl ml-6">{{item.food.foodName}} x {{item.quantity}}</p>
        </div>
        <p class="text-3xl">&#165;{{item.food.foodPrice*item.quantity}}</p>
      </li>

    </ul>

    <div class="flex justify-between items-center w-full h-32  text-[#666666FF] text-3xl p-[3vw]">
      <p class="">配送费</p>
      <p class="">&#165;{{business.deliveryPrice}}</p>
    </div>



    <div class="w-full h-28 fixed left-0 bottom-0 flex">
      <div class="flex bg-[#505051FF]  basis-2/3 text-white justify-center font-bold select-none items-center text-4xl">
        &#165;{{totalPrice}}
      </div >
      <div class="flex bg-[#38CA73FF] basis-1/3 text-white justify-center font-bold select-none items-center cursor-pointer  text-4xl"  @click="topayment">
        去支付
      </div>

    </div>
  </div>
</template>

<style scoped>
ul
{
  padding: 1vw;
}

</style>
