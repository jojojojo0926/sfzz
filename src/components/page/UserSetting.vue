<template>
    <div class="container">
        <div slot="header">
            <my-bread>个人设置</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <el-card>
            <el-row>
                <el-col :span="12">
                    <!-- 表单 -->
                    <el-form status-icon :rules="rules" ref="ruleForm" :model="ruleForm" label-width="120px">
                        <el-form-item label="用户名：">{{ ruleForm.name }}</el-form-item>
                        <el-form-item label="新密码：" prop="password">
                            <el-input v-model="ruleForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="重复密码：" prop="checkPass">
                            <el-input v-model="ruleForm.checkPass"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="Setting('ruleForm')">保存设置</el-button>
                            <el-button type="danger" @click="changeAdmin()">变更管理员</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>

        <el-card style="margin-top: 20px">
            <el-row>
                <el-col :span="12">
                    <!-- 表单 -->
                    <el-form status-icon label-width="120px">
                        <el-form-item label="已申请的机构：">{{ userinfo.entity.name }}</el-form-item>
                        <el-form-item label="申请状态：" prop="password">
                            <div v-if="userinfo.censored === 1"><el-tag type="success">通过审核</el-tag></div>
                            <div v-else-if="userinfo.censored === -1"><el-tag type="danger">申请驳回</el-tag></div>
                            <div v-else-if="userinfo.censored === 0"><el-tag type="warning">待审核</el-tag></div>
                            <div v-else><el-tag type="info">暂无机构信息</el-tag></div>
                        </el-form-item>
                         <el-form-item>
                            <el-button type="danger" @click="quitOrganization()">退出机构</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>

        <el-dialog :visible.sync="editVisible" width="30%">
            <div style="font-size: 16px">请输入新的管理员用户名：</div>
            <br />
            <el-input v-model="admin.username"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data: function () {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                name: '',
                password: '',
                checkPass: ''
            },
            rules: {
                password: [{ required: true, validator: validatePass, trigger: 'blur' }],
                checkPass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
            },
            admin: {
                username: '',
                accessKey: ''
            },
            entity: {
                name: ''
            },
            editVisible: false,
            userinfo: {}
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        console.log(data);
        this.userinfo = data;
        this.admin.accessKey = data.user.accessKey;
        this.ruleForm.name = data.user.username;
        this.entity.name = data.entity.name;
        // 获取用户资料
        // this.getUser();
    },
    methods: {
        changeAdmin() {
            this.editVisible = true;
        },
        async quitOrganization() {
            var params = {
                user:{
                    accessKey: this.userinfo.user.accessKey
                },
                entity: this.entity
            };
            console.log(params);
            this.$confirm('将退出该机构, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('organization/quit', params);
                console.log(res.data);
                if (res.data.code == 0) {
                    window.sessionStorage.removeItem('name');
                    this.$router.push('/login');
                    this.$message.success('退出机构成功，请重新登陆！');
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },
        submit() {
            var params = {
                user: this.admin,
                entity: this.entity
            };
            this.$confirm('将移交管理员, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                console.log(this.admin);
                const res = await this.$http.post('organization/changeAdmin', params);
                if (res.data.code == 0) {
                    window.sessionStorage.removeItem('name');
                    this.$router.push('/login');
                    this.$message.success('变更成功，请重新登录！');
                } else {
                    this.$message.error(res.data.message);
                }
                this.editVisible = false;
            });
        },

        async Setting(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    await this.$http
                        .post('user/changePassword', { accessKey: this.admin.accessKey, password: this.ruleForm.password })
                        .then((res) => {
                            console.log(res.data);
                            if (res.data.code == 0) {
                                this.$message.success(res.data.message);
                            } else {
                                this.$message.error(res.data.message);
                            }
                        });
                } else {
                    console.log('提交失败!');
                    return false;
                }
            });
        }

        // async getUser() {
        //     const {
        //         data: { data }
        //     } = await this.$http.get('user/profile');
        //     this.ruleForm = data;
        // },
        // async Setting() {
        //     const {
        //         data: { data }
        //     } = await this.$http.patch('user/profile', {
        //         name: this.ruleForm.name,
        //         intro: this.ruleForm.intro,
        //         email: this.ruleForm.email
        //     });
        //     this.$message.success('修改成功');
        //     // 让头部的用户名称和返回的用户名称同步
        //     // setting组件的数据传递给home组件
        //     eventBus.$emit('updateHeaderName', data.name);
        //     // 保存sessionStorage的信息
        //     const localuser = JSON.parse(window.sessionStorage.getItem('hm73-toutiao'));
        //     localuser.name = data.name;
        //     window.sessionStorage.setItem('hm73-toutiao', JSON.stringify(localuser));
        // },
        // upload(data) {
        //     const formData = new FormData();
        //     formData.append('photo', data.file);
        //     this.$http.patch('user/photo', formData).then(res => {
        //         this.ruleForm.photo = res.data.data.photo;
        //         eventBus.$emit('updateHeaderPhoto', res.data.data.photo);
        //         const localuser = JSON.parse(window.sessionStorage.getItem('hm73-toutiao'));
        //         localuser.photo = res.data.data.photo;
        //         window.sessionStorage.setItem('hm73-toutiao', JSON.stringify(localuser));
        //     });
        // }
    }
};
</script>

<style scoped>
.title {
    padding: 50px;
    text-align: center;
    font-size: 30px;
}
.container {
    margin: 0 auto;
    width: 50%;
}
</style>
