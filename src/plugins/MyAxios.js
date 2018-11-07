import axios from 'axios';
import {Message} from 'element-ui'
const MyAxios = {};
MyAxios.install = function (Vue) {
    axios.defaults.baseURL = 'https://www.easy-mock.com/mock/5bc9cac636cd6f2c70fa55aa/example';
    // 设置axios的拦截器
    // 请求的拦截器
    // 发送请求之前，判断当前请求是否是Login，如果是登陆继续执行
    // 如果不是Login，设置请求头中的Authorization
    axios.interceptors.request.use(function (config) {
        // 获取到当前请求的路径
        // 设置请求头
        
        if(config.url.toLocaleLowerCase()!=='login'){
        //    设置请求头
          const token = sessionStorage.getItem('token');
          config.headers.Authorization=token
        }
        // else{
        //   sessionStorage.setItem('token',null);
        //   config.headers.Authorization = null;
        // }
        return config
      }, function (error) {
        
        return Promise.reject(error)
      })
    
    // 响应的拦截器
    axios.interceptors.response.use(function (response) {
        // console.log(response)
        // 判断获取数据是否成功
        const {meta:{status,msg}}=response.data;
        if(status===200||status===201){

        }else{
          Message.error(msg)
        }
        return response
      }, function (error) {
        
        return Promise.reject(error)
      })
    Vue.prototype.$http = axios

}
// 导出成员
export default MyAxios
