export default {
    data() {
        return {
            tableData: [
                // {
                //     date: "2016-05-02",
                //     name: "王小虎",
                //     address: "上海市普陀区金沙江路 1518 弄"
                // },
                // {
                //     date: "2016-05-04",
                //     name: "王小虎",
                //     address: "上海市普陀区金沙江路 1517 弄"
                // },
                // {
                //     date: "2016-05-01",
                //     name: "王小虎",
                //     address: "上海市普陀区金沙江路 1519 弄"
                // },
                // {
                //     date: "2016-05-03",
                //     name: "王小虎",
                //     address: "上海市普陀区金沙江路 1516 弄"
                // }
            ],
            searchValue: "",
            // 默认对话框隐藏
            addUserDialogFormVisible: false,
            form: {
                username: "",
                password: "",
                email: "",
                mobile: ""
            },
            // 表单验证规则
            rules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    },
                    {
                        min: 3,
                        max: 6,
                        message: "长度在 3 到 6 个字符",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    },
                    {
                        min: 3,
                        max: 11,
                        message: "长度在 3 到 11 个字符",
                        trigger: "blur"
                    }
                ]
            },
            // 编辑用户的对话框的显示和隐藏
            editUserDialogFormVisible: false,
            // 分配角色的对话框的显示和隐藏
            setRoleDialogFormVisible: false,
            currentPage4:1,
            currentName: '',
            currentRoleId: -1,
            currentUsersId: -1,
            // 角色列表
            roles: [],
            // 分页相关数据
            pagenum:1,
            pagesize:2,
            count:0,
            data:[]
        };
    },
      created (){
            this.loadData();
      },
    methods: {
        //   发送请求获取用户列表
          async  loadData () {
              var token=sessionStorage.getItem('token');
              this.$http.defaults.headers.common['Authorization'] = token;
              var response=await this.$http.get(`/users?pagenum=${this.pagenum}$pagesize=${this.pagesize}&query=${this.searchValue}`);
            //   ?pagenum=${this.pagenum}$pagesize=${this.pagesize}&query=${this.searchValue}
              var {meta:{status,msg}}=response.data;
              if(status===200){
                //    获取总共多少条数据
                this.count=response.data.data.totalpage;
                     this.tableData=response.data.data.users;
              console.log( this.tableData);

              }else{
                  this.$message.error(msg);
              }
          },
        handleSizeChange(val) {
            // 每页条数发生变化;
            this.pagesize = val;
            this.loadData();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            // 页码发生变化;÷
            this.pagenum = val;
            this.loadData();
            console.log(`当前页: ${val}`);
        },
        //搜索的方法
        handleSearch() {
            this.loadData();
        },
        async handleAdd() {
            // 表单验证
            this.$refs.addForm.validate(async valid => {
                if (valid) {
                    const response = await this.$http.post("users", this.from);
                    const {
                        data: {
                            meta: { status, msg }
                        }
                    } = response;
                    if (status === 201) {
                        this.$message.success(msg);
                        this.addUserDialogFormVisible = false;
                        this.loadData();
                        //还原表单控件内容
                        this.$refs.addForm.resetFields();
                    } else {
                        this.$message.error(msg);
                    }
                } else {
                    this.$message.warning("表单验证失败");
                }
            });
        },
        // 编辑窗口的确定按钮,点击窗口并发送请求获得数据
        async handleEdit() {
            const response = await this.$http.put(`users/${this.form.id}`, {
                email: this.form.email,
                mobile: this.form.mobile
            });
            // 判断是否成功
            if (status === 200) {
                // 修改成功
                this.$message.success(msg);
                this.editUserDialogFormVisible = false;
                // 重新加载数据
                this.loadData();
                // 清空表单
                for (var key in this.form) {
                    this.form[key] = "";
                }
            } else {
                // 修改失败
                this.$message.error(msh);
            }
        },
        openEditDialog(user) {
            this.editUserDialogFormVisible = true;
            this.form.username = user.username;
            this.form.mobile = user.mobile;
            this.form.email = user.email;
            //    存储用户的id
            this.form.id = user.id;
        },
        // 关闭编辑对话框时候执行
        handleEditDialogClose() {
            // 清空表单数据
            for (var key in this.form) {
                this.form[key] = "";
            }
        },
        // 点击删除按钮
        async handleDelete(id) {
            this.$confirm("是否删除该用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    // 点击确定按钮执行
                    // this.$message({
                    //     type: "success",
                    //     message: "删除成功!"
                    // });
                    const response = await this.$http.delete(`users/${id}`);
                    const {
                        meta: { status, msg }
                    } = response.data;
                    if (status === 200) {
                        // if (this.data.length === 1 && this.pagenum != 1) {
                        //     this.pagenum--;
                        //     this.loadData();
                        // }
                        this.$message.success(msg);
                        this.loadData();
                    } else {
                        this.$message.error(msg);
                    }
                })
                // 点击取消按钮执行
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 当用户状态改变修改用户的状态
        async handleChange(user) {
            const response = await this.$http.put(
                `users/${users.id}/state/${users.mg_state}`
            );
            const {
                meta: { status, msg }
            } = response.data;
            if (status === 200) {
                this.$message.success(msg);
            } else {
                thsi.$message.error(msg);
            }
        },
        async handleOpenSetRoleDialog(user) {
            this.setRoleDialogFormVisible = true;
            this.currentName = user.username;
            this.currentUserId = user.id;
            // 显示角色列表 下拉框
            const response = await this.$http.get("roles");
            console.log(response)
            
            this.roles = response.data.data;
            // 角色id
            const userResponse=await this.$http.get(`users/${user.id}`);
            this.currentUserId=userResponse.data.data.rid;
        },
        // 实现分配角色
        async handleSetRole(){
           const response=await this.$http.put(`users/${this.currentRoleId}/role`,{
               rid:this.currentRoleId
           });
        //    判断成功还是失败
         const {meta:{status,msg}}=response.data;
         if(status===200){
             this.$message.success(msg);
             this.setRoleDialogFormVisible=false;
         }else{
             this.$message.error(msg);
         }
        }
    }
};