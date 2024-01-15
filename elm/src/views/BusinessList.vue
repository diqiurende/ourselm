<script setup>
import Header from "@/components/Header.vue";
import Footer   from "@/components/Footer.vue";
import axios from "axios";
import { ref, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {getSessionStorage} from "@/common.js";
import qs from "qs";
const user = ref('')
const router = useRouter()
const route = useRoute()
const typeId = ref(route.query.ordertypeId)
const businesses = ref([]);
// 在组件挂载时向后端请求商家数据
onMounted(async () => {
  user.value = getSessionStorage('user')
  try {
    const response = await axios.get('BusinessController/getAllBusinesses',{params:{typeId:typeId.value}});
    businesses.value = response.data;
    if(user.value!=null){
      listCart();
    }
    else {
      alert("您还未登录！请前往登录")
      await router.push("/login")
    }
  } catch (error) {
    console.error('Error fetching business data:', error);
  }
});

function listCart() {
  let params = {
    userId:user.value.userId
  }
  axios.post(
      'CartController/listCart',
      params,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
  ).then(response=>{
    let cartArr = response.data;
    console.log(cartArr)
    //遍历所有食品列表
    for(let businessItem of businesses.value){
      businessItem.quantity = 0;
      for(let cartItem of cartArr){
        if(cartItem.businessId===businessItem.businessId){
          businessItem.quantity += cartItem.quantity;
        }
      }
    }
    businesses.value.sort();
  }).catch(error=>{
    console.error(error);
  });
}
function toBusinessInfo(id){
 router.push({path:'/businessInfo',query:{businessId:id}})
}
</script>

<template>
  <div class="w=full h-full">
    <!--header部分-->
    <header class="w-full h-24 basis-full bg-[#0097FF] text-white text-[4.8vw] flex left-0 top-0 z-50 justify-center items-center">
      <p>商家列表</p>
    </header>
    <div>

      <ul>
        <li v-for="business in businesses" :key="business.businessId" class="businesslist" @click="toBusinessInfo(business.businessId)">
          <img :src="business.businessImg" alt="商家图片" style="max-width: 100px; max-height: 100px;">
          <div class="business-img-quantity" v-show="business.quantity>0">{{business.quantity}}</div>
          <div>
            <h3>{{business.businessName}}</h3>
            <p>&#165;{{business.starPrice}}起送 | &#165;{{business.deliveryPrice}}配送</p>
            <p>{{business.businessExplain}}</p>
          </div>
          <!-- 其他商家信息的展示 -->
        </li>
      </ul>
    </div>
    <Footer></Footer>
  </div>

</template>

<style scoped>

ul{
  padding: 0;
}
.businesslist{
  display: flex;
  border-bottom: 1px solid #333; /* 3px深边缘线，颜色为#333（黑色） */
  padding-bottom: 10px;
}

.business-img-quantity {
  width: 5vw;
  height: 5vw;
  background-color: red;
  color: #fff;
  font-size: 3.6vw;
  border-radius: 2.5vw;

  display: flex;
  justify-content: center;
  align-items: center;

  /*设置成绝对定位，不占文档流空间*/
  position: absolute;
  right: -1.5vw;
  top: -1.5vw;
}
</style>
