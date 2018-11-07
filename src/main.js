import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'
import moment from 'moment'
import myaxios from '@/plugins/MyAxios'
// 引入面包屑全局组件
import MyBreadcrumb from '@/components/MyBreadcrumb'
// 注册面包屑全局组件
Vue.component(MyBreadcrumb.name,MyBreadcrumb) 

Vue.use(myaxios)
Vue.use(moment)
Vue.use(ElementUI)

// 全局过滤器 格式化日期
Vue.filter('fmtDate',(value,fmtString)=>{
    return moment(value).format(fmtString);
})
Vue.config.productionTip = false

// 配置全局的axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
