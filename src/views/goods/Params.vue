<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>
        <!-- 警告 -->
        <el-alert class="aler-col" :closable="false" title="注意：只允许为第三级分类设置相关信息" type="warning" show-icon>
        </el-alert>
        <el-row>
            <el-col>
                请选择商品分类:
                <el-cascader placeholder="请选择商品分类" :props="{label:'cat_name',value:'cat_id'}" expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange">
                </el-cascader>
            </el-col>
        </el-row>
        <!-- tab栏切换 -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" :disabled="this.selectedOptions.length!==3">添加动态参数</el-button>
                <!-- 动态参数的表格 -->
                <el-table border stripe :data="data" style="width: 100%">
                    <el-table-column type="expand" width="50">
                        <template slot-scope="scope">
                            <el-tag :key="tag" v-for="tag in scope.row.params" closable :disable-transitions="false" @close="handleClose(item,scope.row)">
                                {{item}}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="inputVisible" 
                            v-model="inputValue" ref="saveTagInput" 
                            size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                             @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" width="50">
                    </el-table-column>
                    <el-table-column prop="attr_name" width="160px" label="商品参数">
                    </el-table-column>
                    <el-table-column prop="attr_name" label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" plain icon="el-icon-edit"></el-button>
                            <el-button type="danger" size="mini" plain icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="only">
                <el-button type="primary" :disabled="this.selectedOptions.length!==3">添加静态参数</el-button>
                <el-table border stripe :data="data" style="width: 100%">
                    <el-table-column type="index" width="50">
                    </el-table-column>
                    <el-table-column prop="attr_name" width="160px" label="属性名称 ">
                    </el-table-column>
                    <el-table-column prop="attr_vals" width="160px" label="属性值 ">
                    </el-table-column>
                    <el-table-column prop="attr_name" label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" plain icon="el-icon-edit"></el-button>
                            <el-button type="danger" size="mini" plain icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

        </el-tabs>
    </el-card>
</template>
<script>
export default {
    data() {
        return {
            // 多级下拉绑定的数据
            options: [],
            selectedOptions: [],
            // tab绑定的数据
            activeName: "many",
            // 动态参数的数据
            data: [],
            // 添加动态参数需要绑定的数据
            inputVisible: false,
            inputValue: ""
        };
    },
    created() {
        this.loadOptions();
    },
    methods: {
        // 多级下拉，选中内容改变之后
        handleChange() {
            this.loadData();
        },
        // 点击tab栏时候执行
        handleTabClick() {
            this.loadData();
        },
        // 加载多级下拉的数据
        async loadOptions() {
            const response = await this.$http.get("categories?type=3");
            this.options = response.data.data;
        },
        // 加载表格数据
        async loadData() {
            this.data.length = 0;
            if (this.selectedOptions.length === 3) {
                const response = await this.$http.get(
                    `categories/${this.selectedOptions[2]}/attributes?sel=${
                        this.activeName
                    }`
                );
                const {
                    meta: { status, msg }
                } = response.data;
                if (status === 200) {
                    this.data = response.data.data;
                    // 如果是动态参数时候，把attr_vals转换城数组
                    if (this.activeName === "many") {
                        // 动态给对象增加的成员，vue不会监视他的变化
                        this.data.forEach(item => {
                            const arr =
                                item.attr_vals.length === 0
                                    ? []
                                    : item.attr_vals.split(",");
                            this.$set(item, "params", arr);
                        });
                    }
                } else {
                    this.$message.error(msg);
                }
            }
        },
        // 点击x号删除数据
        async handleClose(tag, param) {
            const index = param.params.findIndex(item => {
                if (tag === item) {
                    return true;
                }
            });
            param.params.splice(index, 1);
            const response = await this.$http.put(
                `categories/${this.selectedOptions[2]}/attributes/${
                    param.attr_id
                }`,
                { attr_vals: param.params.join(","), attr_sel: this.activeName }
            );
            const {
                meta: { status, msg }
            } = response.data;
            if (status === 200) {
                this.$message.success(msg);
                const index = param.params.findIndex(item => {
                    if (tag === item) {
                        return true;
                    }
                });
                param.params.splice(index, 1);
            } else {
                this.$message.error(msg);
            }
        },
        // 添加动态参数
        async handleInputConfirm(row) {
            let inputValue=this.inputVisible;
            if(!inputValue){
                // this.dynamicTags.push(inputValue)
                return;
            }
            row.params.push(inputValue);
            // 向服务器发送请求
             const response=await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${row.attr_id}`,{
                 attr_vals:row.params.join(','),
                 attr_name:row.attr_name,
                 attr_sel:this.activeName
             });
            // 判断成功还是失败
            const {meta:{status,msg}}=response.data;
            if(status===200){
                this.$message.success(msg);
                 this.inputVisible=false;
            this.inputValue='';
            }else{
                this.$message.error(msg);
            }
           
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        }
    }
};
</script>
<style>
.aler-col {
    margin-bottom: 10px;
    margin-top: 10px;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
