<template>
    <div style="background: #eee; min-width: 400px; max-width: 1920px" @click="jgList = false">
        <div class="top">
            <div class="topTitle">
                <span>国家林业和草原局森林和草原病虫害防治总站</span><br />
                <span>林业有害生物防治质量智能监控平台</span>
            </div>
        </div>
        <div class="nav" style="position: relative">
            <div class="f1">首页</div>
            <div class="f1" @click.stop="organizationList">机构</div>
            <div v-if="jgList" class="tablist">
                <div v-for="(item, index) in organization" :key="index" @click="openDialog(item)">
                    <!-- <a href="javascript:;" class="jigoulist">{{ item.name }}</a> -->
                    <router-link class="jigoulist" target="_blank" :to="{ path: '/organizationhomepage' }"> {{ item.name }} </router-link>
                </div>

                <el-dialog title="提示" :visible.sync="organizationDialog" width="75%">
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
            <div class="f1" @click="Login">登陆</div>
            <div class="f1" @click="Register">注册</div>
        </div>
        <div class="main">
            <div style="width: 100%; display: inline-block; text-align: center">
                <div class="carousel">
                    <el-carousel height="400px">
                        <el-carousel-item v-for="item in imgurl" :key="item">
                            <!--  -->
                            <img style="width: 100%; height: 100%; max-width: 100%; max-height: 100%" :src="item" alt="" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="tabs">
                    <div class="title">最新资讯</div>
                    <ul class="item">
                        <li class="itemlist" v-for="(item, index) in news" :key="index">
                            <a :href="item.url" target="_blank" class="content el-icon-caret-right">
                                {{ item.title }}
                            </a>
                            <div class="time">{{ item.time }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer">
            <div style="height: 30px; background-color: #289c3a; margin-top: 30px">
                <p class="Btitle">Copyright @2020 国家林业和草原局森林和草原病虫害防治总站 All rights reserved</p>
            </div>

            <div class="bottom"></div>
        </div>

        <el-dialog class="loginDialog" title="用户登陆" :visible.sync="toLogin" width="25%">
            <el-form :model="param" :rules="Loginrules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="请输入用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="param.password" placeholder="请输入密码">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toLogin = false">取 消</el-button>
                <el-button type="primary" @click="loginSubmit">登录</el-button>
            </span>
        </el-dialog>

        <el-dialog title="用户注册" :visible.sync="toRegister" width="30%">
            <el-form :model="ruleForm" status-icon :rules="Registerrules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
                        :rules="[
                            { required: true, message: '手机号不能为空', trigger: 'blur' },
                            { min: 7, max: 11, message: '请输入正确的手机号格式', trigger: 'blur' }
                        ]"
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
            toLogin: false,
            toRegister: false,
            param: {
                username: '',
                password: ''
            },
            Loginrules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            ruleForm: {
                username: '',
                password: '',
                checkPass: ''
            },
            Registerrules: {
                password: [{ required: true, validator: validatePass, trigger: 'blur' }],
                checkPass: [{ required: true, validator: validatePass2, trigger: 'blur' }],
                username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
            },
            update: {
                mail: '',
                accessKey: '',
                name: '',
                phone: '',
                annotation: ''
            },
            jgList: false,
            organization: [],
            organizationDialog: false,
            imgurl: [],
            news: []
        };
    },
    created() {
        this.getEntities();
        this.getNews();
    },
    methods: {
        //登陆弹框显示
        Login() {
            this.toLogin = true;
        },
        //点击登陆按钮
        async loginSubmit() {
            this.$refs.login.validate(async (valid) => {
                if (valid) {
                    const res = await this.$http.post('user/login', this.param);

                    if (res.data.code == 0) {
                        this.$message.success(res.data.message);
                        // window.sessionStorage.setItem('name', res.data.response);
                        window.sessionStorage.setItem('name', JSON.stringify(res.data.response));
                        this.$router.push('/ditu');
                    } else {
                        this.$message.error(res.data.message);
                    }
                }
            });
        },
        //注册弹框显示
        Register() {
            this.toRegister = true;
        },
        //点击注册按钮
        async submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    await this.$http
                        .post('user/register', {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password,
                            mail: this.update.mail,
                            name: this.update.name,
                            phone: this.update.phone
                        })
                        .then((res) => {
                            if (res.data.code == 0) {
                                this.$message.success(res.data.message);
                                this.toRegister = false;
                            } else {
                                this.$message.error(res.data.message);
                            }
                        });
                    // await this.$http
                    //     .post('user/login', { username: this.ruleForm.username, password: this.ruleForm.password })
                    //     .then((res) => {
                    //         console.log(res.data);
                    //         this.update.accessKey = res.data.response;
                    //     });
                    // await this.$http.post('user/update', this.update).then((res) => {
                    //     console.log(res.data);
                    //     if (res.data.code == 0) {
                    //         this.$message.success(res.data.message);
                    //         this.$router.push('/login');
                    //     } else {
                    //         this.$message.error(res.data.message);
                    //     }
                    // });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //注册重置按钮
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //导航栏机构显示隐藏
        organizationList() {
            this.jgList = !this.jgList;
        },
        //获取所有机构
        async getEntities() {
            const res = await this.$http.get('organization/getEntities');
            var data = res.data.response;
            for (var i in data) {
                this.organization.push(data[i]);
            }
            // console.log(this.organization);
        },
        //查看机构信息 页面跳转
        openDialog(e) {
            window.sessionStorage.setItem('homepageinfo', JSON.stringify(e));
            // this.$router.push({ path: '/organizationhomepage', query: { data: e } });
        },
        //查看机构信息 页面跳转
        async getNews(e) {
            const res = await this.$http.get('news/getNews/21');
            var data = res.data.response;
            this.news = data.slice(0, 7);
            var newsImg = data.slice(0, 20);
            for (var i in newsImg) {
                if (newsImg[i].imgs == 'no picture' || data[i].imgs.length > 100) {
                    continue;
                } else {
                    this.imgurl.push(newsImg[i].imgs);
                }
            }
        },
        
    }
};
</script>


<style scoped>
.top {
    min-width: 400px;
    max-width: 1920px;
    height: 200px;
    width: 100%;
    background-image: url(../../assets/img/banner3.png);
    background-size: cover;
}
.topTitle {
    font-size: 28px;
    color: aliceblue;
    padding: 0 15%;
    font-weight: 700;
    line-height: 50px;
    padding-top: 50px;
}
.nav {
    height: 60px;
    background-color: #289c3a;
    padding: 0 20%;
    display: flex;
    margin-bottom: 30px;
}
.f1 {
    flex: 1;
    color: #ffffff;
    padding: 0 15px;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
}
.f1:hover {
    background-color: rgb(110, 185, 43);
    font-weight: 700;
}
.main {
    width: 100%;
    background-color: #fff;
    height: 400px;
    padding: 30px 0;
}
.carousel {
    min-width: 600px;
    width: 40%;
    margin-right: 30px;
    display: inline-block;
}
.tabs {
    width: 25%;
    min-width: 250px;
    display: inline-block;
    border: 1px solid #999;
    position: relative;
    top: -34px;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 400px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.item {
    padding: 10px;
}

.itemlist {
    display: flex;
    padding: 10px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    height: 45px;
    line-height: 45px;
    border-bottom-width: 1px;
    border-bottom-style: dotted;
    border-bottom-color: #ccc;
    text-align: left;
}
.content {
    flex: 7;
    padding: 0;
    margin-left: 0;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    /*禁止换行显示*/
    white-space: nowrap;
    color: #666;
    font-size: 14px;
    font-family: Tahoma;
    font-weight: normal;
    font-style: normal;
    text-decoration: none;
    height: 45px;
    line-height: 45px;
    outline: none;
}
.content:hover {
    color: #289c3a;
    font-weight: 700;
}
.time {
    flex: 2;
    padding: 0 5px 0 10px;
    margin: 0;
    float: right;
    color: #bbb;
    font-size: 14px;
    font-family: Tahoma;
    font-weight: normal;
    font-style: normal;
    text-decoration: none;
}
.title {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    font-weight: 700;

    border-radius: 0px;
    background-color: #289c3a;
}
.bottom {
    height: 125px;
    background-color: #289c3a;
}
.jigoulist {
    width: 280px;
    height: 30px;
    line-height: 30px;
    padding: 5px 0;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    background-color: rgb(110, 185, 43);
    columns: #fff;
    display: block;
    text-align: center;
}
.nav a {
    color: #fff;
}
.nav a:hover {
    background-color: #289c3a;
    font-weight: 700;
}
.Btitle {
    text-align: center;
    color: #ccc;
    line-height: 125px;
    font-size: 18px;
}
.tablist {
    position: absolute;
    z-index: 9999;
    top: 60px;
    left: 680px;
    overflow-y: scroll;
    max-height: 500px;
    scrollbar-width: none;
}
.tablist::-webkit-scrollbar {
    display: none;
}
</style>