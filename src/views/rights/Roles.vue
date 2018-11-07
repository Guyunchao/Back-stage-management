<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="权限管理" level2="角色管理"></my-breadcrumb>
        <!-- 添加按钮 -->
        <el-row class="add-row">
            <el-col :span="24">
                <el-button>添加按钮</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table v-loading="loading" stripe border :data="data" style="width: 100%">
            <!-- 展示行 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 一级权限 -->
                    <el-row class="level1" @close="handleClose(scope.row,level1.id)">
                        <!-- v-for="level1 in scope.row.children" :key="level1.id" -->
                        <el-col :span="4">
                            <el-tag closable type="success">
                                <!-- {{level1.authName}} -->
                                12
                            </el-tag>
                        </el-col>
                        <el-col :span="20">
                            <!-- 二级权限 -->

                            <el-row>
                                <!-- v-for="level2 in level1.children" :key="level2.id" -->
                                <el-col :span="4">
                                    <!-- 显示二级权限的名称 -->
                                    <!-- @close="handleClose(scope.row.id,level2.id)" -->
                                    <el-tag closable>
                                        <!-- {{level2.authName}} -->
                                        23
                                    </el-tag>
                                </el-col>
                                <el-col :span="20">
                                    <!-- 三级权限 -->
                                    <!-- @close="handleClose(scope.row.id,level3.id)" -->
                                    <el-tag class="level3" closable type="warning">
                                        <!-- v-for="level3 in level2.children" :key="level3.id" -->
                                        <!-- {{level3.authName}} -->
                                        12
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 没权限展示这一条 -->
                    <!-- <el-row v-if="scope.row.children.length===0">
                        <el-col :span="24">没有权限</el-col>
                    </el-row> -->
                </template>
            </el-table-column>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="180">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="180">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" plain icon="el-icon-edit"></el-button>
                    <!-- handleOpenSetRightsDialog(scope.row) -->
                    <el-button type="success" size="mini" plain icon="el-icon-check" @click="setRightsDialogVisible=true"></el-button>
                    <el-button type="danger" size="mini" plain icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 点击分配权限按钮弹出对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%">
            <el-tree ref="tree" :data="datas" node-key="id" :default-checked-keys="checkedList" show-checkbox default-expand-all :props="defaultProps"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightsDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
export default {
  data() {
    return {
      // loading:true,
      data: [{ roleName: "", roleDesc: "" }],
      // 控制分配权限对话框的显示
      setRightsDialogVisible: false,
      datas: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      // 树默认选中节点的key
      checkedList: [],
      defaultProps: {
        //设置树的子节点属性
        children: "children",
        // 设置树节点的属性
        label: "label"
      }
      // 绑定tree的数据
      // data:[]
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载角色列表
    async loadData() {
      const response = await this.$http.get("/roles");
      // 等请求结束设置loading=false
      this.loading = false;
      const {
        meta: { status, msg }
      } = response.data;
      if (status === 200) {
        this.data = response.data.data;
      } else {
        this.$message.error(msg);
      }
    },
    async handleClose(role, rightId) {
      // role角色对象
      //  roleId角色id
      // rightId权限id
      const response = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      console.log(response);
      // 判断是否成功
      const {
        meta: { status, msg }
      } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        // this.loadData();
        // 重新加载当前角色所对相应的权限列表
        role.children = response.data.data;
      } else {
        this.$message.error(msg);
      }
    },
    // 点击分配权限按钮 弹出对话框 加载接口数据
    async handleOpenSetRightsDialog(role) {
      this.checkedList = [];
      //   role当前角色对象;
      this.setRightsDialogVisible = true;
      const response = await this.$http.get("rights/tree");
      this.datas = response.data.data;
      // 把当前角色的id存储到checkedList这个数组里面
      role.children.foreach(level1 => {
        level1.children.foreach(level2 => {
          level2.children.foreach(level3 => {
            this.checkedList.push(level3.id);
          });
        });
      });
    }
    //    async handleSetRights(){
    //         const checkedList=this.$http.tree.getCheckedKeys();
    //         const halfCheckedList=this.$refs.tree.getHalfCheckedKeys();
    //         const arr=checkedList.concat(halfCheckedList);
    //         const arr=[...checkedList,...halfCheckedList];
    //         const response=await this.$http.post(`roles/${this.currentRoleId}/rights`,{
    //             rids:arr.join(',')
    //         });
    //         const {meta:{status,msg}}=response.data;
    //         if(status===200){
    //          this.$message.success(msg);
    //          this.setRightsDialogVisible=false;
    //         }else{
    //             this.$message.error(msg);
    //         }

    //     }
  }
};
</script>
<style>
.card {
  height: 100%;
  overflow: auto;
}
.add-row {
  margin-top: 10px;
  margin-bottom: 10px;
}
.level3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
.level1 {
  margin-bottom: 10px;
}
</style>
