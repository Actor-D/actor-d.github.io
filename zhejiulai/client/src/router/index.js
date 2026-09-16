import { createRouter, createWebHistory } from 'vue-router'
import FrontPageLogin from "@/views/FrontPage/FrontPageLogin.vue";
import FrontPageContentRegister from "@/views/FrontPage/FrontPageContent/FrontPageContentRegister.vue";
import HomeCreateOrderAddress from "@/views/CreateOrder/HomeCreateOrderAddress.vue";
import HomeCreateOrderComplete from "@/views/CreateOrder/HomeCreateOrderComplete.vue";
import HomeCreateOrderInfo from "@/views/CreateOrder/HomeCreateOrderInfo.vue";
import HomeCreateOrderPay from "@/views/CreateOrder/HomeCreateOrderPay.vue";
import HomeMyPageListAbout from "@/views/MyPage/HomeMyPageListAbout.vue";
import HomeMyPageListAddress from "@/views/MyPage/HomeMyPageListAddress.vue";
import HomeMyPageListFeedback from "@/views/MyPage/HomeMyPageListFeedback.vue";
import HomeMyPageListPersonalinfo from "@/views/MyPage/HomeMyPageListPersonalinfo.vue";
import HomeMyPageListSetting from "@/views/MyPage/HomeMyPageListSetting.vue";
import HomeViewOrderListDetail from "@/views/ViewOrderDetail.vue";
import HomeMessagePageDetail from "@/Views/MessagePage/HomeMessagePageDetail.vue";
import HomeCreateGoodInfo from '@/views/CreateOrder/HomeCreateGoodInfo.vue';
import HomeCreateGoodAddress from '@/views/CreateOrder/HomeCreateGoodAddress.vue';
import HomeCreateGoodComplete from '@/views/CreateOrder/HomeCreateGoodComplete.vue';
import HomeCreateGoodPay from '@/views/CreateOrder/HomeCreateGoodPay.vue';
import HomeViewGoodListDetail from '@/views/ViewGoodDetail.vue';
import Home from "@/views/Home.vue";
import MyPage from "@/views/MyPage.vue";
import ViewOrder from "@/views/ViewOrder.vue";
import Message from "@/views/Message.vue";
import Service from "@/views/Service.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'FrontPage',
      component:FrontPageLogin,
    },
    {
      path: '/FrontPage/ContentRegister',
      name: 'FrontPageContentRegister',
      component: FrontPageContentRegister,
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/CreateOrder/Complete',
      name: 'HomeCreateOrderComplete',
      component: HomeCreateOrderComplete,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/CreateOrder/Address',
      name: 'HomeCreateOrderAddress',
      component: HomeCreateOrderAddress,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/CreateOrder/Info',
      name: 'HomeCreateOrderInfo',
      component: HomeCreateOrderInfo,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/CreateOrder/Good',
      name: 'HomeCreateGoodInfo',
      component: HomeCreateGoodInfo,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/CreateOrder/GoodAddress',
      name: 'HomeCreateGoodAddress',
      component: HomeCreateGoodAddress,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/CreateOrder/GoodComplete',
      name: 'HomeCreateGoodComplete',
      component: HomeCreateGoodComplete,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/CreateOrder/GoodPay',
      name: 'HomeCreateGoodPay',
      component: HomeCreateGoodPay,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/CreateOrder/Pay',
      name: 'HomePage/HomeCreateOrderPay',
      component: HomeCreateOrderPay,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/MessagePageList',
      name: 'HomeMessagePageList',
      component: Message,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/MyPage',
      name: 'HomeMyPage',
      component: MyPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/MyPage/About',
      name: 'HomeMyPageListAbout',
      component: HomeMyPageListAbout,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/MyPage/Address',
      name: 'HomeMyPageListAddress',
      component: HomeMyPageListAddress,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/MyPage/Feedback',
      name: 'HomeMyPageListFeedback',
      component: HomeMyPageListFeedback,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/MyPage/Personalinfo',
      name: 'HomeMyPageListPersonalinfo',
      component: HomeMyPageListPersonalinfo,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/MyPage/Setting',
      name: 'HomeMyPageListSetting',
      component: HomeMyPageListSetting,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/ViewOrder',
      name: 'HomeViewOrder',
      component: ViewOrder,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/ViewOrder/GoodDetail',
      name: 'HomeViewGoodListDetail',
      component: HomeViewGoodListDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/ViewOrder/ListDetail',
      name: 'HomeViewOrderListDetail',
      component: HomeViewOrderListDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/Service',
      name: '/Home/Service',
      component:Service,
      meta: { requiresAuth: true }
    },
    {
      path: '/Home/MessagePageDetail',
      name: '/Home/MessagePageDetail',
      component:HomeMessagePageDetail,
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // 如果访问的是受保护路由且没有 token，强制跳转到登录页
  if (requiresAuth && !token) {
    next('/'); // 直接跳转到登录页，不保留 redirect
  }
  // 如果访问的是登录页但已有 token，跳转到首页（避免重复登录）
  else if (to.path === '/' && token) {
    next('/Home');
  }
  // 其他情况正常放行
  else {
    next();
  }
});

export default router
