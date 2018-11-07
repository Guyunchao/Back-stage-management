<template>
    <el-container class="container">
        <el-header class="header">
            <el-row>
                <el-col :span="4">
                    <img src="@/assets/logo.jpg" alt="" style="width:100px">
                </el-col>
                <el-col :span="19">
                    <div class="title">电商后台管理系统</div>
                </el-col>
                <el-col :span="1">
                    <div class="logout">
                        <a href="#" @click.prevent="handleLogout">退出</a>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside width="200px" class="aside">
                <el-menu  router style="height:100%" uniqueopened="true">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item index="/users"><i class="el-icon-menu"></i>用户列表</el-menu-item>
                    </el-submenu>
                    <!-- <el-submenu v-for="item in menus" :key="item.id" :index="item.id">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item index="/users"><i class="el-icon-menu"></i>用户列表</el-menu-item>
                    </el-submenu> -->
                    <!-- <el-menu-item 
                    v-for="item1 in item.children"
                    :key="item1.id"
                    index="'/'+item1.path">
                    <i class="el-icon-menu"></i>
                    {{item1.authName}}
                    </el-menu-item> -->
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item index="/roles"><i class="el-icon-menu"></i>角色管理</el-menu-item>
                        <el-menu-item index="/rights"><i class="el-icon-menu"></i>权限列表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item index="/goods"><i class="el-icon-menu"></i>商品列表</el-menu-item>
                        <el-menu-item index="/params"><i class="el-icon-menu"></i>分类列表</el-menu-item>
                        <el-menu-item index="/categories"><i class="el-icon-menu"></i>商品分类</el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>订单管理</span>
                        </template>
                        <el-menu-item index="/orders"><i class="el-icon-menu"></i>订单列表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>数据统计</span>
                        </template>
                        <el-menu-item index="/reports"><i class="el-icon-menu"></i>数据报表</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data (){
         return {
             menus:[]
         }
    },
    // created (){
    //     // 加载菜单数据
    //       this.loadMenus();
    // },
    beforeCreate() {
        // 判断是否登陆
        // var token=sessionStorage.getItem('token');
        // if(!token){
        //     this.$message.warning('请先登陆');
        //     this.$router.push('/login')
        // }
    },
    methods: {
        handleLogout() {
            this.$message.success("退出成功");
            sessionStorage.clear();
            this.$router.push("/login");
        },
        
        async loadMenus (){
              const response=await this.$http.get('menus');
              this.menus=response.data.data;
              console.log(response);
        }
    }
};
</script>
<style>
.container {
    height: 100%;
}

.header {
    padding: 0;
    background-color: #b3c0d1;
}
.header .title {
    text-align: center;
    height: 60px;
    line-height: 60px;
    color: #fff;
    font-size: 24px;
}
.header .logout {
    height: 60px;
    line-height: 60px;
    color: red;
}
.header .logout a {
    text-decoration: none;
}
.aside {
    background-color: #d3dce6;
}

.main {
    background-color: #e9eef3;
}
</style>
