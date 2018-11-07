<template>
 <div class="login-wrap">
     <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
        <h2>用户登录</h2>
       <el-form-item label="用户名">
         <el-input v-model="formData.username"></el-input>
       </el-form-item>
       <el-form-item label="密码">
         <el-input @keyup.enter.native="hanldetLogin" type="password" v-model="formData.password"></el-input>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" class="login-btn" @click="hanldetLogin">登陆</el-button>
       </el-form-item>
    </el-form>
 </div>

</template>

<script>
export default {
  data () {
    return {
        formData: {
              username:'',
              password:''
        }
    }
  },
  methods: {
      async  hanldetLogin (){
            var response=await this.$http.post('/upload',this.formData);
                // var status=response.data.meta.status;
                // var msg=response.data.meta.msg;
                console.log(response);
                var {data:{meta:{status,msg}}}=response;
                if(status===200){
                      this.$message.success(msg);
                      var token =response.data.data.token;
                      sessionStorage.setItem('token',token);
                      this.$router.push('/');
                }else{
                    this.$message.error(msg);
                }
      }
  }
}
</script>
<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login-wrap .login-form .login-btn {
  width: 100%;
}
</style>
