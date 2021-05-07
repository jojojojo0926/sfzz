<!--  -->
<template>
    <div class="container">
        <div slot="header">
            <my-bread>项目申报</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>

        <el-form :model="creatProject" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="creatProject.name"></el-input>
            </el-form-item>
            <el-form-item label="实施地点" prop="serviceAddress">
                <area-select class="area" v-model="diqu" :level="2" type="text" :data="pcaa" @change="gaibian"></area-select>
            </el-form-item>
            <el-form-item class="w400" label="经纬度" prop="serviceAddress">
                <el-input v-model="lng" placeholder="先选择地区"></el-input>
                <el-button style="position: absolute; margin-left: 10px" @click="getLng">点击获取经纬度</el-button>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <div class="block">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="creatProject.startTime"
                        type="date"
                        placeholder="选择日期"
                    ></el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <div class="block">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="creatProject.endTime"
                        type="date"
                        placeholder="选择日期"
                    ></el-date-picker>
                </div>
            </el-form-item>
            <el-form-item class="w300" label="作业次数" prop="times">
                <el-input v-model="creatProject.times" placeholder="今年作业几次"></el-input>
            </el-form-item>
            <el-form-item class="w300" label="合同面积(亩)" prop="areaInContract">
                <el-input style="" v-model="creatProject.areaInContract" placeholder="单位:亩"></el-input>
            </el-form-item>
            <el-form-item class="w300" label="用药量(亩/毫升)" prop="appicationRate">
                <el-input style="" v-model="creatProject.appicationRate" placeholder="单位:亩/毫升"></el-input>
            </el-form-item>

            <el-form-item class="w300" label="药剂名称" prop="pestcide">
                <el-input style="" v-model="creatProject.pestcide"></el-input>
            </el-form-item>
            <el-form-item class="w500" label="寄主植物" prop="plant">
                <el-select
                    class="w400"
                    v-model="creatProject.plant"
                    multiple
                    allow-create
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="zwremoteMethod"
                    :loading="zwloading"
                >
                    <el-option v-for="item in zwoptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="有害生物名称" prop="pest">
                <el-select
                    class="w400"
                    allow-create
                    v-model="creatProject.pest"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="bhremoteMethod"
                    :loading="bhloading"
                >
                    <el-option v-for="item in bhoptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>

            <!-- <el-form-item class="w500" label="防治措施" prop="operation">
                <el-cascader :options="csoptions" v-model="creatProject.operation" class="w400">
                    <template slot-scope="{ node, data }">
                        <span>{{ data.label }}</span>
                        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                    </template>
                </el-cascader>
            </el-form-item>
            <el-form-item class="w500" label="林业用药械" prop="Equipment">
                <el-cascader :options="yxoptions" v-model="creatProject.Equipment" class="w400">
                    <template slot-scope="{ node, data }">
                        <span>{{ data.label }}</span>
                        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                    </template>
                </el-cascader>
            </el-form-item> -->
            <el-form-item label="项目描述" prop="description">
                <el-input type="textarea" v-model="creatProject.description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>

        <el-card class="box-card" style="margin-top: 50px">
            <div slot="header" class="clearfix">
                <span>项目状态</span>
            </div>

            <el-table :data="bhData" border style="width: 100%">
                <el-table-column prop="name" label="项目名称"> </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag size="medium" v-if="scope.row.censored == 0">等待审核</el-tag>
                        <el-tag size="medium" type="danger" v-if="scope.row.censored == -1">已驳回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="驳回原因"> </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

import 'vue-area-linkage/dist/index.css'; // 样式
import { pca, pcaa } from 'area-data';
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 1, message: '长度不低于1个字符', trigger: 'blur' }
                ],
                startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
                endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
                times: [{ required: true, message: '请输入今年作业次数', trigger: 'blur' }],
                areaInContract: [{ required: true, message: '请输入合同面积(公顷)', trigger: 'blur' }],
                description: [{ required: true, message: '请简要描述项目', trigger: 'blur' }],
                diqu: [{ required: true, message: '请选择，不能为空！', trigger: 'blur' }],

                pest: [{ required: true, message: '请选择，不能为空！', trigger: 'blur' }],
                pestcide: [{ required: true, message: '请选择，不能为空！', trigger: 'blur' }],
                plant: [{ required: true, message: '请选择，不能为空！', trigger: 'blur' }]
            },

            //选择地区数据
            pca: pca,
            pcaa: pcaa,

            lng: '',

            bhData: [],

            //创建项目数据
            creatProject: {
                longitude: '', //经度
                latitude: '', //纬度
                accessKey: '',
                name: '',
                startTime: '',
                endTime: '',
                times: '',
                areaInContract: '', //合同面积
                description: '', //描述
                serviceAddress: '', //实施地点
                appicationRate: '',
                pest: [], // 林木病害
                pestcide: '', // 药剂名称
                plant: [] // 寄主植物
            },

            diqu: [],

            //寄主植物
            zwoptions: [],
            zwlist: [],
            zwloading: false,
            zwstates: [],

            //林业有害生物
            bhoptions: [],
            bhlist: [],
            bhloading: false,
            bhstates: []
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.creatProject.accessKey = data.user.accessKey;
        this.getAllPest();
        this.getAllDiseases();
        this.getAllPlants();
        this.getList();
    },
    mounted() {},
    methods: {
        //获取林业病害
        async getAllPest() {
            const res = await this.$http.get('dictionary/getAllPest');
            let data = res.data.response;
            for (var i in data) {
                this.bhstates.push(data[i].Species);
            }
            this.bhlist = this.bhstates.map((item) => {
                return { value: `${item}`, label: `${item}` };
            });
        },
        //获取防治对象
        async getAllDiseases() {
            const res = await this.$http.get('dictionary/getAllDiseases');

            let data = res.data.response;
            for (var i in data) {
                this.bhstates.push(data[i].Name);
            }
            this.bhlist = this.bhstates.map((item) => {
                return { value: `${item}`, label: `${item}` };
            });
        },
        //获取寄主植物
        async getAllPlants() {
            const res = await this.$http.get('dictionary/getAllPlants');
            let data = res.data.response;
            for (var i in data) {
                this.zwstates.push(data[i].Species);
            }
            this.zwlist = this.zwstates.map((item) => {
                return { value: `${item}`, label: `${item}` };
            });
        },
        gaibian(e) {
            this.creatProject.serviceAddress = e[0] + e[1] + e[2];
        },
        submitForm(formName) {
            var that = this;
            that.creatProject.plant = that.creatProject.plant.join(',');
            that.creatProject.pest = that.creatProject.pest.join(',');
            console.log(that.creatProject);
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    that.$confirm('您将进行项目申报，请确认信息是否确定?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        var res = await that.$http.post('project/create', that.creatProject);
                        if (res.data.code == 0) {
                            that.$message.success(res.data.message);
                            that.creatProject = {};
                            that.getList();
                        } else {
                            that.$message.error(res.data.message);
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
        },
        ceshi() {
            console.log(this.creatProject.Equipment);
        },
        zwremoteMethod(query) {
            if (query !== '') {
                this.zwloading = true;
                setTimeout(() => {
                    this.zwloading = false;
                    this.zwoptions = this.zwlist.filter((item) => {
                        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.zwoptions = [];
            }
        },
        bhremoteMethod(query) {
            if (query !== '') {
                this.bhloading = true;
                setTimeout(() => {
                    this.bhloading = false;
                    this.bhoptions = this.bhlist.filter((item) => {
                        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.bhoptions = [];
            }
        },
        getLng() {
            var that = this;
            var address = that.creatProject.serviceAddress;
            AMap.plugin('AMap.Geocoder', function () {
                var geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                });
                geocoder.getLocation(address, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        that.creatProject.longitude = result.geocodes[0].location.lng;
                        that.creatProject.latitude = result.geocodes[0].location.lat;
                        that.lng = result.geocodes[0].location.lng + ',' + result.geocodes[0].location.lat;
                    }
                });
            });
        },
        async getList() {
            await this.$http.post('project/getList', { accessKey: this.creatProject.accessKey }).then((res) => {
                var data = res.data.response;
                console.log('111', data);
                var i = data.length;
                while (i--) {
                    if (data[i].censored == 1) {
                        data.splice(i, 1);
                    }
                }
                this.bhData = data;
            });
        }

        // onSubmit() {
        //     this.$confirm('您将进行项目申报，请确认信息是否确定?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(async () => {
        //         this.$http.post('project/create', this.creatProject).then((res) => {
        //             console.log(res);
        //             if (res.data.code == 0) {
        //                 this.$message.success(res.data.message);
        //                 this.creatProject = {};
        //             } else {
        //                 this.$message.error(res.data.message);
        //             }
        //         });
        //     });
        // }

        // csoptions: [
        //     {
        //         value: '化学防治',
        //         label: '化学防治',
        //         children: [
        //             {
        //                 value: '生物化学防治',
        //                 label: '生物化学防治',
        //                 children: [
        //                     {
        //                         value: '喷雾',
        //                         label: '喷雾'
        //                     },
        //                     {
        //                         value: '喷粉',
        //                         label: '喷粉'
        //                     },
        //                     {
        //                         value: '注射',
        //                         label: '注射'
        //                     },
        //                     {
        //                         value: '涂药(毒环)',
        //                         label: '涂药(毒环)'
        //                     },
        //                     {
        //                         value: '毒饵',
        //                         label: '毒饵'
        //                     },
        //                     ,
        //                     {
        //                         value: '其他生物化学防治',
        //                         label: '其他生物化学防治'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '有机化学防治',
        //                 label: '有机化学防治',
        //                 children: [
        //                     {
        //                         value: '喷雾',
        //                         label: '喷雾'
        //                     },
        //                     {
        //                         value: '喷粉',
        //                         label: '喷粉'
        //                     },
        //                     {
        //                         value: '喷烟',
        //                         label: '喷烟'
        //                     },
        //                     {
        //                         value: '注射',
        //                         label: '注射'
        //                     },
        //                     {
        //                         value: '涂药(毒环)',
        //                         label: '涂药(毒环)'
        //                     },
        //                     {
        //                         value: '毒绳',
        //                         label: '毒绳'
        //                     },
        //                     ,
        //                     {
        //                         value: '毒饵',
        //                         label: '毒饵'
        //                     },
        //                     {
        //                         value: '其他有机化学防治',
        //                         label: '其他有机化学防治'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '无机化学防治',
        //                 label: '无机化学防治',
        //                 children: [
        //                     {
        //                         value: '喷雾',
        //                         label: '喷雾'
        //                     },
        //                     {
        //                         value: '喷粉',
        //                         label: '喷粉'
        //                     },
        //                     {
        //                         value: '喷烟',
        //                         label: '喷烟'
        //                     },
        //                     {
        //                         value: '注射',
        //                         label: '注射'
        //                     },
        //                     {
        //                         value: '涂药(毒环)',
        //                         label: '涂药(毒环)'
        //                     },
        //                     {
        //                         value: '毒绳',
        //                         label: '毒绳'
        //                     },
        //                     ,
        //                     {
        //                         value: '毒饵',
        //                         label: '毒饵'
        //                     },
        //                     {
        //                         value: '其他无机化学防治',
        //                         label: '其他无机化学防治'
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // ],

        // yxoptions: [
        //     {
        //         value: '施药器械类',
        //         label: '施药器械类',
        //         children: [
        //             {
        //                 value: '航空类',
        //                 label: '航空类',
        //                 children: [
        //                     {
        //                         value: '旋翼机类',
        //                         label: '旋翼机类'
        //                     },
        //                     {
        //                         value: '固定翼机类',
        //                         label: '固定翼机类'
        //                     },
        //                     {
        //                         value: '无人机',
        //                         label: '无人机'
        //                     },
        //                     {
        //                         value: '其他',
        //                         label: '其他'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '喷雾机类',
        //                 label: '喷雾机类',
        //                 children: [
        //                     {
        //                         value: '机动喷雾机类',
        //                         label: '机动喷雾机类'
        //                     },
        //                     {
        //                         value: '动力喷雾剂类',
        //                         label: '动力喷雾剂类'
        //                     },
        //                     {
        //                         value: '远程喷雾机类',
        //                         label: '远程喷雾机类'
        //                     },
        //                     {
        //                         value: '电动喷雾机类',
        //                         label: '电动喷雾机类'
        //                     },
        //                     {
        //                         value: '其他',
        //                         label: '其他'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '喷烟机类',
        //                 label: '喷烟机类',
        //                 children: [
        //                     {
        //                         value: '车载式烟雾机类',
        //                         label: '车载式烟雾机类'
        //                     },
        //                     {
        //                         value: '背负式烟雾机类',
        //                         label: '背负式烟雾机类'
        //                     },
        //                     {
        //                         value: '肩挎式烟雾机类',
        //                         label: '肩挎式烟雾机类'
        //                     },
        //                     {
        //                         value: '其他',
        //                         label: '其他'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '打孔机类',
        //                 label: '打孔机类',
        //                 children: [
        //                     {
        //                         value: '电动打孔机',
        //                         label: '电动打孔机'
        //                     },
        //                     {
        //                         value: '机动打孔机',
        //                         label: '机动打孔机'
        //                     },
        //                     {
        //                         value: '压力打孔机',
        //                         label: '压力打孔机'
        //                     },
        //                     {
        //                         value: '其他',
        //                         label: '其他'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '布撒器类',
        //                 label: '布撒器类',
        //                 children: [
        //                     {
        //                         value: '便携式布撒器',
        //                         label: '便携式布撒器'
        //                     },
        //                     {
        //                         value: '车载式布撒器',
        //                         label: '车载式布撒器'
        //                     },
        //                     {
        //                         value: '其他',
        //                         label: '其他'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '其他类',
        //                 label: '其他类',
        //                 children: [
        //                     {
        //                         value: '其他',
        //                         label: '其他'
        //                     }
        //                 ]
        //             }
        //         ]
        //     },
        //     {
        //         value: '物理器械类',
        //         label: '物理器械类',
        //         children: [
        //             {
        //                 value: '诱(杀)虫灯类',
        //                 label: '诱(杀)虫灯类',
        //                 children: [
        //                     {
        //                         value: '交流电类',
        //                         label: '交流电类'
        //                     },
        //                     {
        //                         value: '直流电类',
        //                         label: '直流电类'
        //                     },
        //                     {
        //                         value: '光伏类',
        //                         label: '光伏类'
        //                     },
        //                     {
        //                         value: '其他类',
        //                         label: '其他类'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '诱捕器类',
        //                 label: '诱捕器类',
        //                 children: [
        //                     {
        //                         value: '捕虫类',
        //                         label: '捕虫类'
        //                     },
        //                     {
        //                         value: '捕鼠类',
        //                         label: '捕鼠类'
        //                     },
        //                     {
        //                         value: '其他类',
        //                         label: '其他类'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '除害处理类',
        //                 label: '除害处理类',
        //                 children: [
        //                     {
        //                         value: '微博类',
        //                         label: '微博类'
        //                     },
        //                     {
        //                         value: '热烘类',
        //                         label: '热烘类'
        //                     },
        //                     {
        //                         value: '辐照类',
        //                         label: '辐照类'
        //                     },
        //                     {
        //                         value: '其他类',
        //                         label: '其他类'
        //                     }
        //                 ]
        //             },
        //             {
        //                 value: '其他类',
        //                 label: '其他类',
        //                 children: [
        //                     {
        //                         value: '其他',
        //                         label: '其他'
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // ]
    }
};
</script>
<style  scoped>
.container {
    margin: 0 auto;
    width: 50%;
}
.area {
    text-align: left;
}
.block {
    margin-right: 10px;
    float: left;
}
.el-upload--text {
    width: 100px;
    height: 100px;
}
div.el-upload--text {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.title {
    padding: 50px;
    text-align: center;
    font-size: 30px;
}
.btn {
    /* text-align: center; */
    padding: 30px;
}
.btn1 {
    font-size: 20px;
}
.w300 {
    width: 300px;
}
.w400 {
    width: 400px;
}
.w500 {
    width: 500px;
}
</style>

