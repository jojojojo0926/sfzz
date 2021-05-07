<template>
    <div class="container">
        <div slot="header">
            <my-bread>机构注册</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <el-card>
            <!-- 表单 -->
            <el-form :model="entity" status-icon :rules="rules" ref="ruleForm" label-width="120px">
                <el-form-item label="机构名称：" prop="name">
                    <el-input v-model="entity.name"></el-input>
                </el-form-item>

                <el-form-item label="统一信用代码：" prop="identity">
                    <el-input v-model="entity.identity"></el-input>
                </el-form-item>

                <el-form-item label="机构图标：">
                    <el-input v-model="entity.logo" placeholder="请填写网络地址"></el-input>
                </el-form-item>

                <el-form-item label="机构介绍：">
                    <el-input v-model="entity.description"></el-input>
                </el-form-item>

                <el-form-item label="机构主页：">
                    <el-input v-model="entity.homepage" placeholder="请填写网址"></el-input>
                </el-form-item>

                <el-form-item label="机构地址：">
                    <area-select class="area" v-model="diqu" :level="2" type="text" :data="pcaa" @change="gaibian"></area-select>
                </el-form-item>

                <el-form-item style="width: 300px" label="联系人：" prop="contact">
                    <el-input v-model="entity.contact"></el-input>
                </el-form-item>

                <el-form-item style="width: 300px" label="联系电话：" prop="phone">
                    <el-input v-model="entity.phone"></el-input>
                </el-form-item>

                <el-form-item style="width: 300px" label="工作邮箱：" prop="email">
                    <el-input v-model="entity.email"></el-input>
                </el-form-item>

                <el-form-item label=" 机构角色：">
                    <el-select v-model="value1" placeholder="请选择" @change="changeType1">
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label=" 服务范围：">
                    <el-select v-model="value2" placeholder="请选择" @change="changeType2">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submit">立即注册</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import 'vue-area-linkage/dist/index.css'; // 样式
import { pca, pcaa } from 'area-data';
export default {
    data() {
        return {
            //选择地区数据
            pca: pca,
            pcaa: pcaa,
            diqu: [],

            name: '',

            user: {
                accessKey: ''
            },

            entity: {
                name: '',
                identity: '',
                logo:'',
                description: '',
                homepage: '',
                address: '',
                contact: '',
                phone: '',
                email: '',
                region: ''
            },
            rules: {
                contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
                phone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    { min: 7, max: 11, message: '请输入正确的手机号格式', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入工作邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
                identity: [{ required: true, message: '请输入信用代码', trigger: 'blur' }]
            },

            num1: '',
            num2: '',

            options1: [
                {
                    value: '16',
                    label: '政府管理方'
                },
                {
                    value: '32',
                    label: '系统供应方'
                },
                {
                    value: '64',
                    label: '系统使用方'
                }
            ],
            options2: [
                {
                    value: '128',
                    label: '全国'
                },
                {
                    value: '256',
                    label: '省级'
                },
                {
                    value: '512',
                    label: '市级'
                },
                {
                    value: '1024',
                    label: '县级'
                }
            ],
            value1: '',
            value2: ''
        };
    },

    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        console.log(data);
        this.user.accessKey = data.user.accessKey;
        // console.log(this.qykey);
    },
    methods: {
        gaibian(e) {
            this.entity.address = e[0] + e[1] + e[2];
            console.log(e[0] + e[1] + e[2]);
        },
        submit() {
            this.$confirm('是否提交注册信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                var params = {
                    user: this.user,
                    entity: this.entity
                };
                this.$http
                    .post('organization/register', params) /*  */
                    .then((res) => {
                        console.log(res);
                        if (res.data.code == 0) {
                            window.sessionStorage.removeItem('name');
                            this.$router.push('/login');
                            this.$message.success('机构注册成功，请重新登陆！');
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        changeType1(e) {
            this.num1 = Number(e);
            this.entity.region = Number(e) + this.num2;
            console.log(this.entity.region);
        },
        changeType2(e) {
            this.num2 = Number(e);
            this.entity.region = Number(e) + this.num1;
            console.log(this.entity.region);
        }
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
    width: 50%;
    margin: 0 auto;
}
</style>
