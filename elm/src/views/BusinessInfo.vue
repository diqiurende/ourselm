<script setup>
import Header from "@/components/Header.vue";
import {useRoute, useRouter} from 'vue-router';
import {computed, onBeforeMount, onMounted, ref} from "vue";
import axios from "axios";
import qs from "qs";
import {getSessionStorage} from "@/common.js";
const router = useRouter()
const route = useRoute()
const businessId = ref(route.query.businessId)
const business = ref({})
const foodArr = ref([])
const user = ref({})


const toOrder=()=>{
  router.push({path:'/tooder',query:{businessId:businessId.value}});
}

onBeforeMount(()=> {
  user.value = getSessionStorage('user')
  //根据businessId查询商家信息
  axios.get('BusinessController/getBusinessById',{params:{
    bus_id:businessId.value
  }}).then(response=>{
    business.value = response.data;
  }).catch(error=>{
    console.error(error);
  });

  //根据businessId查询所属食品信息
  axios.get('FoodController/listFoodByBusinessId',{params:{
    bus_id:businessId.value}
  }).then(response=>{
    foodArr.value = response.data;
    for(let i=0;i<response.data.length;i++){
      foodArr.value[i].quantity=0;
    }

    if(user.value!==null){
      listCart();
    }
  }).catch(error=>{
    console.error(error);
  });
})

//食品总价格
const totalPrice = computed(()=>{
  let total = 0;
  for(let item of foodArr.value){
    total += item.foodPrice*item.quantity;
  }
  return total;
})
//食品总数量
//测试
const totalquantity = computed(()=>{
  let quantity = 0;
  for(let item of foodArr.value){
    quantity += item.quantity;
  }
  return quantity;
})

//结算总价格
const totalSettle = computed(()=>{
  return totalPrice.value+business.value.deliveryPrice;
})

function 	listCart(){
  let params = {
    businessId:businessId.value,
    userId:user.value.userId
  }
  axios.post('CartController/listCart',params).then(response=>{
    let cartArr = response.data;
    //遍历所有食品列表
    for(let foodItem of foodArr.value){
      if (foodItem && foodItem.quantity !== undefined) {
      foodItem.quantity = 0;
      for(let cartItem of cartArr){
        if(cartItem.foodId===foodItem.foodId){
          foodItem.quantity = cartItem.quantity;
        }
      }
    }
    }
    foodArr.value.sort();
  }).catch(error=>{
    console.error(error);
  });
}
function add(index){
  //首先做登录验证
  if(user.value==null){
    router.push({path:'/login'});
    return;
  }

  if(foodArr.value[index].quantity===0){
    //做insert
    saveCart(index);
  }else{
    //做update
    updateCart(index,1);
  }
}
  function substract(index){

  if(foodArr.value[index].quantity>1){
    //做update
    updateCart(index,-1);
  }else{
    //做delete
    removeCart(index);
  }
}
function saveCart(index){
  axios.post('CartController/saveCart',{
    businessId:businessId.value,
    userId:user.value.userId,
    foodId:foodArr.value[index].foodId
  },{headers:'Content-Type: application/json'}).then(response=>{
    if(response.data===1){
      //此食品数量要更新为1；
      foodArr.value[index].quantity=1;
      foodArr.value.sort();
    }else{
      alert('向购物车中添加食品失败！');
    }
  }).catch(error=>{
    console.error(error);
  });
}
function updateCart(index,num){
  axios.post('CartController/updateCart',{
    businessId:businessId.value,
    userId:user.value.userId,
    foodId:foodArr.value[index].foodId,
    quantity:foodArr.value[index].quantity+num
  }).then(response=>{
    if(response.data===1){
      //此食品数量要更新为1或-1；
      foodArr.value[index].quantity+=num;
      foodArr.value.sort();
    }else{
      alert('向购物车中更新食品失败！');
    }
  }).catch(error=>{
    console.error(error);
  });
}
function removeCart(index){
  axios.post('CartController/removeCart',{
    businessId:businessId.value,
    userId:user.value.userId,
    foodId:foodArr.value[index].foodId
  }).then(response=>{
    if(response.data===1){
      //此食品数量要更新为0；视图的减号和数量要消失
      foodArr.value[index].quantity=0;
      foodArr.value.sort();
    }else{
      alert('从购物车中删除食品失败！');
    }
  }).catch(error=>{
    console.error(error);
  });
}
</script>

<template>
  <div class="w-full h-full">
    <!--herder部分-->
    <header class="flex bg-[#0097FF] justify-center items-center h-28 text-[4.8vw] text-white w-full">
      商家信息
    </header>

    <!--商家logo部分-->
    <div class="flex justify-center items-center mt-6">
      <img class="w-72 h-72 rounded" :src="business.businessImg" alt="商家图片">
    </div>

    <!--商家信息部分-->
    <div class="flex justify-center items-center w-full h-28 flex-col">
      <p class="flex text-4xl font-semibold mt-2">
       {{business.businessName}}
      </p>
      <p class="flex text-2xl font-medium text-gray-500 mt-px">&#165;{{business.starPrice}}起送 &#165;{{business.deliveryPrice}}配送</p>
      <p class="flex text-2xl font-medium text-gray-500 mt-px">{{ business.businessExplain }}</p>
    </div>

    <!--食品列表部分-->
    <ul class="w-full mb-7">
      <li v-for="(item,key) in foodArr" :key="item.foodId" class="w-full box-border mx-3 my-8 p-1.25/1 select-none flex justify-between items-center">
        <div class="flex items-center box-content">
          <img class="ml-3 w-1/3 h-1/3" :src="item.foodImg">
          <div class="flex flex-col mx-6 ml-1.5">
            <p class="text-3xl mx-3 font-semibold text-gray-600">{{ item.foodName }}</p>
            <p class="text-2xl leading-loose mx-3 font-normal text-gray-500 mt-1">{{ item.foodExplain }}</p>
            <p class="text-2xl text-gray-500 mx-3 font-normal mt-1">&#165;{{ item.foodPrice }}</p>
          </div>
        </div>
        <div class="w-18 flex justify-between items-center mr-4">
          <div >
            <i class="fa fa-minus-circle fa-2x mx-3 text-gray-500 cursor-pointer" @click="substract(key)" v-show="item.quantity!==0"></i>
          </div>
          <p v-show="item.quantity!==0" class="text-3xl text-gray-600"><span>{{item.quantity}}</span></p>
          <div>
            <i class="fa fa-plus-circle fa-2x mx-3 text-blue-500 cursor-pointer" @click="add(key)"></i>
          </div>
        </div>
      </li>
    </ul>

    <!--购物车部-->
    <div class="flex w-full h-28 fixed bottom-0">
      <div class="flex  bg-gray-700 basis-2/3">
        <div class=" w-32 h-32 box-border border-solid border-8 border-gray-700 rounded-full bg-blue-500 text-3 text-white flex justify-center items-center -mt-2 -ml-1 relative">
<!--          <i class="fa fa-shopping-cart fa-3x"></i>-->
          <span class="iconfont">&#xea06;</span>
          <div class="w-10 h-10 rounded-full bg-red-600 text-white text-2xl flex justify-center items-center absolute -right-1/4 -top-1/4" v-show="totalquantity!==0">{{totalquantity}}</div>
        </div>
        <div>
          <p class="text-4xl text-white mt-4">&#165;{{ totalPrice }}</p>
          <p class="text-1.5 text-gray-500">另需配送费{{ business.deliveryPrice }}元</p>
        </div>
      </div>

      <div class="basis-1/3 mr-0">
        <div class="cart-right-item" v-if="totalSettle<business.starPrice" >
          &#165;{{business.starPrice}}起送
        </div>
        <div v-else class="w- h-full bg-green-500 text-white text-4xl font-bold select-none cursor-pointer flex justify-center items-center" @click="toOrder">
          去结算
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
ul{
  padding: 1vw;
}
@font-face {
  font-family: "iconfont logo";
  src: url('https://at.alicdn.com/t/font_985780_km7mi63cihi.eot?t=1545807318834');
  src: url('https://at.alicdn.com/t/font_985780_km7mi63cihi.eot?t=1545807318834#iefix') format('embedded-opentype'),
  url('https://at.alicdn.com/t/font_985780_km7mi63cihi.woff?t=1545807318834') format('woff'),
  url('https://at.alicdn.com/t/font_985780_km7mi63cihi.ttf?t=1545807318834') format('truetype'),
  url('https://at.alicdn.com/t/font_985780_km7mi63cihi.svg?t=1545807318834#iconfont') format('svg');
}
.cart-right-item {
  width: 100%;
  height: 100%;
  background-color: #38CA73;
  color: #fff;
  font-size: 4.5vw;
  font-weight: 700;
  user-select: none;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
