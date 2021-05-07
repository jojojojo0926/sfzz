<template>
    <div class="container">
        <div slot="header">
            <my-bread>机构信息 </my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <el-card>
            <!-- 表单 -->
            <el-form :model="entity" status-icon label-width="120px">
                <el-form-item label="机构名称：" prop="name">
                    {{ entity.name }}
                    <!-- <el-input v-model="entity.name" disabled></el-input> -->
                </el-form-item>

                <el-form-item label="统一信用代码：" prop="identity">
                    {{ entity.identity }}
                    <!-- <el-input v-model="entity.identity" disabled></el-input> -->
                </el-form-item>

                <el-form-item label="当前状态：" prop="identity">
                    <div v-if="this.censored === 1"><el-tag type="success">通过审核</el-tag></div>
                    <div v-else-if="this.censored === -1"><el-tag type="danger">申请驳回</el-tag></div>
                    <div v-else-if="this.censored === 0"><el-tag type="warning">待审核</el-tag></div>
                    <div v-else><el-tag type="info">暂无机构信息</el-tag></div>
                    <!-- <el-input v-model="entity.identity" disabled></el-input> -->
                </el-form-item>

                <el-form-item label="机构图标：">
                    <el-input v-model="entity.logo" placeholder="请填写网络地址"></el-input>
                </el-form-item>

                <el-form-item label="机构介绍：">
                    <el-input v-model="entity.description"></el-input>
                </el-form-item>

                <el-form-item label="机构主页：">
                    <el-input v-model="entity.homepage"></el-input>
                </el-form-item>

                <el-form-item style="width: 400px" label="机构地址：">
                    <el-input v-model="entity.address"></el-input>
                    <!-- <area-select class="area" v-model="diqu" :level="2" type="text" :data="pcaa" @change="gaibian"></area-select> -->
                </el-form-item>

                <el-form-item style="width: 400px" label="联系人：" prop="contact">
                    <el-input v-model="entity.contact"></el-input>
                </el-form-item>

                <el-form-item style="width: 400px" label="联系电话：" prop="phone">
                    <el-input v-model="entity.phone"></el-input>
                </el-form-item>

                <el-form-item style="width: 400px" label="工作邮箱：" prop="email">
                    <el-input v-model="entity.email"></el-input>
                </el-form-item>

                <!-- <el-form-item label=" 机构角色：">
                    <el-select v-model="value1" placeholder="请选择" @change="changeType1">
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                            {{ item.label }}
                        </el-option>
                    </el-select>
                </el-form-item> -->

                <!-- <el-form-item label=" 服务范围：">
                    <el-select v-model="value2" placeholder="请选择" @change="changeType2">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item>
                    <el-button type="primary" @click="submit()">更新信息</el-button>
                    <el-button type="danger" @click="quit()">放弃申请</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card style="margin-top: 30px">
            <div slot="header" class="clearfix">
                <span>设备列表</span>
            </div>
            <div style="text-align: center">
                <el-button @click="addNewEquipmen" style="float: right; margin-bottom: 20px">添加新设备</el-button>
                <el-table :data="equipmentTableData" border style="width: 100%">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="设备编号" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.ID }}
                        </template>
                    </el-table-column>
                    <el-table-column label="设备类型" align="center">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.type == 1">地面设备</el-tag>
                            <el-tag type="success" v-else-if="scope.row.type == 2">有人机</el-tag>
                            <el-tag type="success" v-else>无人机</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="幅宽(米)" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.swath }}
                        </template>
                    </el-table-column>
                    <el-table-column label="描述" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.description }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <el-dialog :visible.sync="newEquipment" width="30%">
            <el-row>
                <el-col :span="4" style="text-align: right; line-height: 32px"><div>设备编号：</div></el-col>
                <el-col :span="18"><el-input v-model="equipment.id" placeholder="请输入内容"></el-input> </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
                <el-col :span="4" style="text-align: right; line-height: 32px"><div>设备类型：</div></el-col>
                <el-col :span="18">
                    <el-select v-model="equipment.type" placeholder="请选择">
                        <el-option v-for="item in opt" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select
                ></el-col>
            </el-row>
            <el-row style="margin-top: 20px">
                <el-col :span="4" style="text-align: right; line-height: 32px"><div>备注：</div></el-col>
                <el-col :span="18"><el-input v-model="equipment.description" placeholder="请输入内容"></el-input> </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newEquipment = false">取 消</el-button>
                <el-button type="primary" @click="SubmitEquipmentId">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            opt: [
                {
                    value: '1',
                    label: '地面设备'
                },
                {
                    value: '2',
                    label: '有人机'
                },
                {
                    value: '4',
                    label: '无人机'
                }
            ],
            equipment: {
                type: '',
                id: '',
                description: ''
            },

            equipmentTableData: [],
            newEquipment: false,
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
            value2: '',

            user: {
                accessKey: ''
            },
            censored: null,

            entity: {}
        };
    },

    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.user.accessKey = data.user.accessKey;
        this.getinfo();
        this.getAllEquipments();
    },
    methods: {
        async getinfo() {
            var params = {
                user: this.user
            };
            const res = await this.$http.post('organization/getOrganization', params);
            console.log(res.data,'111')
            if (res.data.result == true) {
                this.$message.success(res.data.message);
                this.entity = res.data.response.entity;
                this.censored = res.data.response.entity.censored;
                this.value2 = res.data.response.entity.region;
            } else {
                this.$message.error(res.data.message);
            }
        },
        submit() {
            var params = {
                user: this.user,
                entity: this.entity
            };
            this.$http
                .post('organization/update', params) /*  */
                .then((res) => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.$message.success(res.data.message);
                        this.getinfo();
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
        },
        async quit() {
            var params = {
                accessKey: this.user.accessKey
            };
            console.log(params);
            this.$confirm('将放弃机构注册申请, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('organization/giveUp', params);
                console.log(res.data);
                if (res.data.code == 0) {
                    this.$message.success(res.data.message);
                    this.getinfo();
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },
        changeType2(e) {
            this.entity.region = Number(e);
            console.log(this.entity.region);
        },
        
        //获取所有设备
        async getAllEquipments() {
            var params = {
                user: this.user
            };
            var res = await this.$http.post('organization/getEquipments', params);
            console.log(res.data.response);
            if (res.data.code == 0) {
                this.$message.success(res.data.message);
                this.equipmentTableData = res.data.response;
            } else {
                this.$message.error(res.data.message);
            }
        },
        //添加新设备
        addNewEquipmen() {
            this.newEquipment = true;
        },
        //添加新设备
        async SubmitEquipmentId() {
            var params = {
                user: this.user,
                equipments: this.equipment
            };
            console.log(params);
            var res = await this.$http.post('organization/addEquipment', params);
            console.log(res.data.response);
            if (res.data.code == 0) {
                this.newEquipment = false;
                this.$message.success(res.data.message);
                this.getAllEquipments();
            } else {
                this.$message.error(res.data.message);
            }
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
