import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';
const Login = () => import ('@/views/Login');
const Home = () => import ( '@/views/Home');
const Users = () => import ( '@/views/users/Users');
const Rights = () => import ( '@/views/rights/Rights');
const Roles = () => import ( '@/views/rights/Roles');
const Categories = () => import ( '@/views/goods/Categories');
const Goods = () => import ( '@/views/goods/Goods');
const GoodsAdd = () => import ( '@/views/goods/GoodsAdd');
const Params = () => import ( '@/views/goods/Params');
const Orders = () => import ( '@/views/orders/Orders');
const Reports = () => import ( '@/views/reports/Reports');

// import Login from '@/views/Login'
// import Home from '@/views/Home'
// import Users from '@/views/users/Users'
// import Rights from '@/views/rights/Rights'
// import Roles from '@/views/rights/Roles'
// import Categories from '@/views/goods/Categories'
// import Goods from '@/views/goods/Goods'
// import GoodsAdd from '@/views/goods/GoodsAdd'
// import Params from '@/views/goods/Params'
// import Orders from '@/views/orders/Orders'
// import Reports from '@/views/reports/Reports'
// 倒入message单例

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      //嵌套路由
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods/add',
          name: 'goodsadd',
          component: GoodsAdd
        },
        {
          path: '/params',
          name: 'params',
          component: Params
        },
        {
          path: '/orders',
          name: 'orders',
          component: Orders
        },
        {
          path: '/reports',
          name: 'reports',
          component: Reports
        }
      ]
    },

  ]
});
// 路由全局前置守卫（拦截器） 路由跳转之前执行 to代表当前路由 from代表跳转后的路由
router.beforeEach((to, from, next) => {
 
  next();
  // 如果是登陆的时候不判断token，不是登陆才判断token
  if (to.name&&to.name.toLocaleLowerCase() !== 'Login') {
    // 如果访问的不是login
    const token = sessionStorage.getItem('token');
    // 判断如果没有token
    if (!token) {
      // 没有token，跳转到登陆页面
      router.push('/login')
      // 提示
      Message.warning('请先登陆')
      return;
    }
  }
  next();
});

export default router;
