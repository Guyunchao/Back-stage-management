<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
        <!-- 表格 -->
        <el-table :data="data" border stripe style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="180">
            </el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="80">
            </el-table-column>
            <el-table-column label="是否付款" width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.order_pay==1" type="success">付款</el-tag>
                    <el-tag type="danger" v-else>未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" width="80">
            </el-table-column>
            <el-table-column label="下单时间" width="120">
                <template slot-scope="scope">
                    {{scope.create_time|fmtDate('YYYY-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="openDialog" size="mini" plain icon="el-icon-edit"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 点击编辑图标弹出的对话框 -->
        <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="100px">
                <el-form-item label="省市区/县">
                    <!-- 多级下拉 -->
                    <el-cascader expand-trigger="hover" :options="options" v-model="form.region">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">

                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
import citydata from "./city_data2017_element";
export default {
    data() {
        return {
            data: [],
            // 分页数据
            pagenum: 1,
            pagesize: 10,
            total: 0,
            options: [],
            dialogFormVisible: false,
            //  loading: true
            // 表单省市区数据
            form: {
                address: "",
                region: []
            }
        };
    },
    created() {
        this.loadData();
    },
    methods: {
        // 表格数据
        async loadData() {
            const response = await this.$http.get(
                `orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
            );
            const {
                meta: { status, msg }
            } = response.data;
            console.log(response);
            if (status === 200) {
                this.total = response.data.data.total;
                this.data = response.data.data.goods;
                //  this.loading=true;
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
        },
        // 分页数据
        handleSizeChange(val) {
            this.pagenum = val;
            this.loadData();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pagesize = val;
            this.loadData();
            console.log(`当前页: ${val}`);
        },
        //   点击打开弹出框
        openDialog() {
            this.dialogFormVisible = true;
            //   加载多级下拉的数据
            this.options = citydata;
        }
    }
};
</script>
<style>
.el-cascader {
    width: 350px;
}
</style>

