<template>
    <div class="login-wrap">
        <div class="big">
            <div class="top">账号注册</div>
            <div class="center">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username" label-width="80px">
                        <el-input v-model.number="ruleForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" label-width="80px">
                        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass" label-width="80px">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form :model="update" ref="update" label-width="100px" class="demo-dynamic">
                        <el-form-item
                            label="姓名"
                            prop="name"
                            label-width="80px"
                            :rules="[
                                { required: true, message: '请输入您的真实姓名', trigger: 'blur' },
                                { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
                            ]"
                        >
                            <el-input v-model="update.name"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="手机"
                            prop="phone"
                            label-width="80px"
                            :rules="[{ required: true, message: '手机号不能为空', trigger: 'blur' },{ min: 11, max: 11, message: '请输入正确的手机号格式', trigger: 'blur' }]"
                        >
                            <el-input v-model="update.phone"></el-input>
                        </el-form-item>
                        <el-form-item
                            label-width="80px"
                            prop="mail"
                            label="邮箱"
                            :rules="[
                                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                            ]"
                        >
                            <el-input v-model="update.mail"></el-input>
                        </el-form-item>
                    </el-form> 

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>


            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
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
                username: '',
                password: '',
                checkPass: ''
            },
            rules: {
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                ],
                checkPass: [
                    { required: true, validator: validatePass2, trigger: 'blur' },
                ],
                username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
            },
            update: {
                mail: '',
                accessKey: '',
                name: '',
                phone: '',
                annotation: ''
            },
        };
    },


    methods: {
        async submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    await this.$http.post('user/register', { username: this.ruleForm.username, password: this.ruleForm.password }).then((res) => {
                        console.log(res.data);
                    });
                    await this.$http.post('user/login',  { username: this.ruleForm.username, password: this.ruleForm.password }).then((res) => {
                        console.log(res.data);
                        this.update.accessKey = res.data.response;
                    });
                    await this.$http.post('user/update', this.update).then((res) => {
                        console.log(res.data);
                        if (res.data.code == 0) {
                            this.$message.success(res.data.message);
                            this.$router.push('/login');
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
       
    }
};
</script>
<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.big {
    flex-flow: column;
    display: flex;
    width: 25%;
}
.top {
    flex: 1;
    background-color: #0371d1;
    color: #fff;
    font-size: 30px;
    text-align: center;
    line-height: 110px;
    border: 1px solid skyblue;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}
.center {
    flex: 3;
    background-color: #fff;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.Padding {
    padding: 10px 30px 0px 30px;
}
.pd20 {
    padding: 30px 30px 0px 30px;
}
.login-btn {
    position: relative;
    left: 50%;
    transform: translate(-50%);
    margin-top: 10px;
    margin-bottom: 30px;
    border-radius: 30px;
    width: 50%;
    background-color: #0371d1;
}
.center {
    padding: 30px;
}
</style>