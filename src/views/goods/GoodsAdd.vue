<template>

    <el-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
        <!-- 添加商品头部信息 -->
        <el-alert title="添加商品信息" class="breadcol" :closable="false" type="info" center show-icon>
        </el-alert>
        <!-- 步骤条 -->
        <el-steps :active="active" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>
        <!-- 侧边栏 -->
        <!-- :tab-position="tabPosition" -->
        <el-form :model="form" label-width="100px" label-position="top">
            <el-tabs @tab-click="handleTabClick" tabPosition="left" style="margin-top:10px">
                <el-tab-pane label="基本信息">
                    <!-- 基本信息 -->
                    <el-form-item label="商品名称">
                        <el-input v-model="form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <!-- {{selectedOptions}} -->
                        <el-cascader placeholder="请选择商品分类" clearable expand-trigger="hover" :options="options" :props="{label:'cat_name',value:'cat_id',children:'children'}" v-model="selectedOptions" @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数">

                    <el-form-item v-for="item in dynamicParams" :key="item.attr_id" :label="item.attr_name">
                        <el-checkbox-group v-model="item.params">
                            <el-checkbox v-for="param in item.params" :key="param" :label="param" border></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性">
                    <el-form-item v-for="item in staticParams" :key="item.attr_id" :label="item.attr_name">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片">
                    <!-- 图片上传 -->
                    <el-upload :headers="headers" class="upload-demo" action="https://www.easy-mock.com/mock/5bc9cac636cd6f2c70fa55aa/example" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容">
                    <el-button @click="handleAdd">添加商品</el-button>
                    <quill-editor v-model="form.goods_introduce"></quill-editor>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
    data() {
        return {
            // 绑定步骤条 显示第几步
            active: 0,
            // 表单数据
            form: {
                goods_name: "",
                goods_cat: "",
                goods_price: "",
                goods_number: "",
                goods_weight: "",
                pics: []
            },
            // 多级选择器绑定的数据
            options: [],
            selectedOptions: [],
            // 动态参数
            dynamicParams: [],
            // 静态参数
            staticParams: [],
            // 绑定上传组件
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        };
    },
    components: {
        quillEditor
    },
    // 加载商品分类
    created() {
        // console.log(tab.index)
        // tab.index
        this.loadOptions();
    },
    methods: {
        handleTabClick(tab, event) {
            // tab是当前点击的组件 index=0
            this.active = tab.index - 0;
            // console.log(tab);
            // console.log(event);
            // 判断当前点击的是否是商品分类或商品属性
            if (tab.index === "1" || tab.index === "2") {
                //  判断基本信息中的多级下拉是否选中了3级分类
                if (this.selectedOptions.length !== 3) {
                    this.$message.warning("请先选择商品的分类");
                } else {
                    // 加载商品分类的列表
                    this.loadParams();
                }
            }
        },

        // 多级菜单发生选中项变化的时候执行
        handleChange() {
            //  让多级下拉只能选择三级分类
            if (this.selectedOptions.length !== 3) {
                this.$message.warning("请选择三级分类");
                // 清空多级下来中的内容
                this.selectedOptions = 0;
            }
        },
        // 加载多级下拉的数据
        async loadOptions() {
            const response = await this.$http.get("categories?type=3");
            this.options = response.data.data;
        },
        // 加载动态参数
        // 加载静态数据
        async loadParams() {
            // 当index=1时动态参数 当index=2时静态参数
            // const sel = index === "1" ? "many" : "only";
            const response = await this.$http.get(
                `categories/${this.selectedOptions[2]}/attributes?sel=many`
            );

            this.dynamicParams = response.data.data;
            // 遍历数组
            this.dynamicParams.map(item => {
                //    给对象添加一个属性
                const arr =
                    item.attr_vals.length === 0
                        ? []
                        : item.attr_vals.split(",");
                this.$set(item, "params", arr);
            });
            console.log(this.dynamicParams);
            this.staticParams = response.data.data;
        },
        // 图片上传的方法
        handleRemove(file, fileList) {
            // 从数组中删除数据，要知道，删除项的索引是多少
            const index = this.form.pics.findIndex(item => {
                if (item.pic === file.response.data.tmp_path) {
                    return true;
                }
            });
            this.form.pics.splice(index, 1);
        },
        handleSuccess(response, file, fileList) {
            if (response.meta.status === 200) {
                this.form.pics.push({
                    pic: response.data.tmp_path
                });
                this.$message.success("图片上传成功");
            } else {
                this.$message.error("图片上传失败");
            }
        },
        // 添加商品
        //  async handleAdd(){
        //     this.form.goods_cat=this.selectedOptions.join(',');
        //     // 基于 dynamicParams数组生成一个新的数组
        //     const arr1=this.dynamicParams.map((item)=>{
        //         return {'attr_id':item.attr_id,'attr_value':item.params.join(',')};

        //     });
        //     const arr2=this.staticParams.map((item)=>{
        //         return {'att-_id':item.attr_id,'attr_value':item.attr_vals};
        //     })
        //     this.form.attrs=[...arr1,...arr2];
        //     const response=await this.$http.post('goods',this.form);
        //     const {meta:{status,msg}}=response.data;
        //     if(status===201){
        //         this.$message.success(msg);
        //         this.$router.push('/goods');
        //     }else{
        //         this.$message.error(msg)
        //     }
        // }
    }
};
</script>
<style>
.breadcol {
    margin-bottom: 10px;
    margin-top: 10px;
}
.el-step__title {
    font-size: 12px;
}
.ql-editor{
    height: 400px;
}
</style>
