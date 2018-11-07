<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
        <!-- 添加按钮 -->
        <el-row class="row">
            <el-col :span="24">
                <el-button type="success" plain @click="handleOpenAddDialog">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- v-loading="loading" -->
        <el-table  :data="data" border stripe style="width: 100%">
            <!-- <el-table-column prop="cat_name" label="分类名称" width="180">
            </el-table-column> -->
            <el-table-tree-column label="分类名称" childkey="children" parentkey="cat_pid" levelkey="cat_level" treekey="cat_id" width="400px" prop="cat_name">

            </el-table-tree-column>
            <el-table-column label="级别" width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level===0">一级</span>
                    <span v-else-if="scope.row.cat_level===1">二级</span>
                    <span v-else-if="scope.row.cat_level===2">三级</span>
                </template>
            </el-table-column>
            <el-table-column prop="cat_deleted" label="是否有效" width="100px">
                <template slot-scope="scope">
                    {{scope.row.cat_deleted?'无效':'有效'}}
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleOpenEditDialog(scope.row)" size="mini" plain icon="el-icon-edit"></el-button>
                    <el-button type="danger" @click="handleDeleted(scope.row.cat_id)" size="mini" plain icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[1, 2, 3 ]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="2">
        </el-pagination>
        <!-- 点击添加弹出框 -->
        <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
            <el-form :model="form" label-width="100px">
                <el-form-item label="分类名称">
                    <el-input v-model="form.cat_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类列表">
                    <el-cascader change-on-select="true" clearable placeholder="默认添加一级分类" :props="defaultProps" expand-trigger="hover" :options="options" v-model="catIds" @change="handleChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 点击编辑分类的弹出框 -->
        <el-dialog title="修改商品分类" :visible.sync="editDialogFormVisible">
            <el-form :model="form" label-width="100px">
                <el-form-item label="分类名称">
                    <el-input v-model="form.cat_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
// 家在treegrid组件
import ElementTreegrid from "element-tree-grid";
export default {
    // 配置treegrid名字
    components: {
        "el-table-tree-column": ElementTreegrid
    },
    data() {
        return {
            data: [],
            // 分页数据
            pagenum: 1,
            pagesize: 6,
            // 总共有多少条数据
            total: 0,
            loading: true,
            // 添加商品分类 控制弹出框弹出
            addDialogFormVisible: false,
            form: {
                cat_pid: -1,
                cat_nama: "",
                cat_level: 0
            },
            // 绑定多级选择器使用的数据
            options: [],
            defaultProps: {
                value: "cat_id",
                lable: "cat_name",
                children: "children"
            },
            catIds: [],
            // 编辑时候记录分类id
            currentCatId:-1,
            editDialogFormVisible:false,
            // 点击编辑按钮存储当前行对应的分类对象
            currentCat:null
        };
    },
    created() {
        this.loadData();
    },
    methods: {
        // 组件加载完毕，加载数据（三层的）
        async loadData() {
            this.loading = true;
            const response = await this.$http.get(
                `categories?type=3&pagenum=${this.pagenum}&pagesize=${
                    this.pagesize
                }`
            );
            console.log(response);
            this.loading = false;
            //    判断请求是否成功
            const {
                meta: { status, msg }
            } = response.data;
            if (status === 200) {
                // this.total=response.data.data;
                this.data = response.data.data;

                this.cat_level = response.data.data;
            } else {
                this.$message.error(msg);
            }
        },
        // 分页
        handleSizeChange(val) {
            this.pagesize = val;
            this.loadData();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pagenum = val;
            this.loadData();
            console.log(`当前页: ${val}`);
        },
        // 点击添加分类按钮 显示添加分类对话框
        async handleOpenAddDialog() {
            this.addDialogFormVisible = true;
            const response = await this.$http.get("catgories?type=2");
            this.options = response.data.data;
        },
        // 点击添加对话框的按钮，实现添加分类
        async handleAdd() {
            // 设置级别
            this.form.cat_level = this.catIds.length;
            // 设置父id
            if (this.catIds.length === 0) {
                this.form.cat_pid = 0;
            } else if (this.catIds.length === 1) {
                this.form.cat_pid = this.catIds[0];
            } else if (this.catIds.length === 2) {
                this.form.cat_pid = this.catIds[1];
            }

            // 发送请求
            const response = await this.$http.post("categories", this.form);
            const {
                meta: { status, msg }
            } = response.data;
            // 判断是否添加成功
            if (status === 201) {
                this.addDialogFormVisible = false;
                thi.loadData();
            } else {
                this.$message.error(msg);
            }
        },
        // 点击删除按钮
         handleDeleted(catId) {
            this.$confirm("是否要删除该分类?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async() => {
                    //点击确定按钮
                    // this.$message({
                    //     type: "success",
                    //     message: "删除成功!"
                    // });
                    const response= await this.$http.delete(`categories/${catId}`);
                    const {meta:{status,msg}}=response.data;
                    if(status===200){
                        this.$message.success(msg);
                        this.loadData();
                    }else{
                        this.$message.error(msg)
                    }
                })
                .catch(() => {
                    //点击取消按钮
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 点击编辑按钮弹出对话框
        // 存储分类id和分类名称
        handleOpenEditDialog(cat){
            // 打开对话框
            this.editDialogFormVisible=true;
            // cat是当前行的分类对象
            this.form.cat_nama=cat.cat_nama;
            this.currentCatId=cat.cat_id;
            // 存储分类对象
            this.currentCat=cat;
            
        },
        // 编辑对话框的确定按钮
        async handleEdit(){
           const response= await this.$http.put(`categories/${this.currentCatId}`,{cat_nama:this.form.cat_nama});
           const {meta:{status,msg}}=response.data;
           if(status===200){
                 this.$message.success(msg);
                 this.editDialogFormVisible=false;
                //  this.loadData();
                this.currentCat.cat_nama=response.data.data.cat_nama;
           }else{
               this.$message.error(msg)
           }
        }
    }
};
</script>
<style>
.row {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
