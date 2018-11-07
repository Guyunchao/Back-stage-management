<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
        <!-- 搜索框 -->
        <el-row>
            <el-col :span="24" class="colrow">
                <el-input clearable placeholder="请输入内容" class="searchInput">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="success" @click="$router.push('/goods/add')" plain>添加商品</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table border stripe :data="data" style="width: 100%">
            <el-table-column type="index" width="60px">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="180">
            </el-table-column>
            <el-table-column prop="goods_price" label="商品价格（元）" width="180">
            </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量">
            </el-table-column>
            <el-table-column  label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.add_time | fmtDate('YYYY-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" plain icon="el-icon-edit"></el-button>
                    <el-button type="danger" size="mini" plain icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
         @size-change="handleSizeChange" 
         @current-change="handleCurrentChange" 
         :current-page="pagenum"
          :page-sizes="[1, 2, 3 ]" 
          :page-size="pagesize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="total">
        </el-pagination>
        
    </el-card>
</template>
<script>
export default {
    data() {
        return {
            data: [],
            pagenum:1,
            pagesize:10,
            total:0
        };
    },
    created() {
        this.loadData();
    },
    methods: {
        // 获取商品列表
        async loadData() {
            const response = await this.$http.get(
                `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
            );
            const {
                meta: { status, msg }
            } = response.data;
            console.log(response)
            if (status === 200) {
               
                this.data = response.data.data.goods;
                // this.goods_name = this.data.data.goods_name;
                // this.goods_price = this.data.data.goods_price;
                // this.goods_weight = this.data.data.goods_weight;
                // this.add_time = this.data.data.add_time;  
                // 获取总共多少条数据
                this.total=response.data.data.total;
                 this.$message.success('数据加载完毕');
            } else {
                this.$message.error(msg);
            }
        },
        // 分页方法
        handleSizeChange(val) {
            this.pagesize=val;
            this.loadData();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
          this.pagenum=val;
          this.loadData();
        console.log(`当前页: ${val}`);
      }
    }
};
</script>
<style>
.searchInput {
    width: 260px;
}
.colrow {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
