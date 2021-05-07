<template>
    <div class="container">
        <div slot="header">
            <my-bread>有人机</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <el-card>
            <div slot="header" class="clearfix">
                <span>设备筛选</span>
            </div>
            <div>
                <el-row class="mb10">
                    <el-col :span="6">
                        <el-row>
                            <el-col class="lh32" :span="6">地区：</el-col>
                            <el-col :span="18">
                                <el-select v-model="ProjectAddressData" placeholder="请选择" @change="changeCity">
                                    <el-option v-for="item in ProjectAddressList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option> </el-select
                            ></el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="6">
                        <el-row>
                            <el-col class="lh32" :span="6">项目：</el-col>
                            <el-col :span="18">
                                <el-select v-model="ProjectNameData" placeholder="请选择" @change="changeName">
                                    <el-option
                                        v-for="(item, index) in ProjectNameList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option> </el-select
                            ></el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8">
                        <el-row>
                            <el-col class="lh32" :span="4">时间：</el-col>
                            <el-col :span="20">
                                <el-date-picker
                                    v-model="ProjectTimeData"
                                    type="daterange"
                                    range-separator="至"
                                    :start-placeholder="startTime"
                                    :end-placeholder="endTime"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    @change="changeTime"
                                >
                                </el-date-picker
                            ></el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="1">
                        <el-button style="float: right" type="primary" icon="el-icon-search" @click="SearchEquipment">筛选</el-button>
                    </el-col>
                    <el-col :span="2"> </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card style="margin-top: 20px">
            <div slot="header" class="clearfix">
                <span>设备统计</span>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column type="index" width="80" align="center"></el-table-column>
                <el-table-column prop="EquipmentID" label="设备编号" align="center"></el-table-column>
                <el-table-column prop="Time" label="日期" align="center" :formatter="formatDate"> </el-table-column>
                <el-table-column label="速度(km/h)" align="center">
                    <template slot-scope="scope">
                        {{ (scope.row.Speed * 3.6).toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column label="高度(m)" align="center">
                    <template slot-scope="scope"> {{ scope.row.Height }} </template>
                </el-table-column>
                <el-table-column label="持续时间(h)" align="center">
                    <template slot-scope="scope">
                        {{ formateSeconds(scope.row.Duration) }}
                    </template>
                </el-table-column>
                <el-table-column label="喷洒距离(km)" align="center">
                    <template slot-scope="scope">
                        {{ (scope.row.Distance / 1000).toFixed(2) }}
                    </template>
                </el-table-column>
                <el-table-column label="容量(L)" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.Volume }}
                    </template>
                </el-table-column>
                <el-table-column prop="Sorties" label="架次" align="center"></el-table-column>
                <!-- <el-table-column label="项目名称" width="500" align="center">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                </template>
            </el-table-column> -->
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" @click="handleLook(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import moment from 'moment';
import { pca, pcaa } from 'area-data';
import { city } from '../../api/city.js';
import 'vue-area-linkage/dist/index.css'; // 样式
export default {
    data() {
        return {
            //选择地区数据
            pca: pca,
            pcaa: pcaa,

            ProjectNameList: [],
            ProjectNameData: '',

            ProjectAddressList: city,
            ProjectAddressData: '',

            ProjectTimeData: '',
            startTime: '',
            endTime: '',

            allEquipment: [],

            dialogTableVisible: false,
            rowData: [],
            tableData: [],
            accessKey: ''
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.accessKey = data.user.accessKey;
        this.getDataByEquipmentType();
    },
    methods: {
        formatDate: function (row, column) {
            var date = row[column.property];
            if (date == undefined) {
                return '';
            }
            return moment(date).format('YYYY-MM-DD');
        },
        formateSeconds(endTime) {
            let secondTime = parseInt(endTime); //将传入的秒的值转化为Number
            let min = 0; // 初始化分
            let h = 0; // 初始化小时
            let result = '';
            if (secondTime > 60) {
                //如果秒数大于60，将秒数转换成整数
                min = parseInt(secondTime / 60); //获取分钟，除以60取整数，得到整数分钟
                secondTime = parseInt(secondTime % 60); //获取秒数，秒数取佘，得到整数秒数
                if (min > 60) {
                    //如果分钟大于60，将分钟转换成小时
                    h = parseInt(min / 60); //获取小时，获取分钟除以60，得到整数小时
                    min = parseInt(min % 60); //获取小时后取佘的分，获取分钟除以60取佘的分
                }
            }
            result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`;
            return result;
        },
        //点击查看
        async handleLook(row) {
            console.log(row)
            this.$router.push({ path: '/equipment', query: { equipmentID: row.EquipmentID, accessKey: this.accessKey } });
            // await this.$http.post('data/getDataByEquipment', { accessKey: this.accessKey, equipmentID: row.EquipmentID }).then((res) => {
            //     console.log(res.data.response);
            // });
        },
        //选择时间
        changeTime(e) {
            this.startTime = e[0]
            this.endTime = e[1]
        },
        //获取有人机所有设备
        async getDataByEquipmentType() {
            await this.$http.post('data/getDataByEquipmentType', { accessKey: this.accessKey, equipmentType: 2 }).then((res) => {
                 console.log(res.data.response)
                for (var i in res.data.response) {
                    this.allEquipment.push(res.data.response[i].EquipmentID);
                }
                this.tableData = res.data.response;
                if (res.data.code == 0) {
                    this.$message.success(res.data.message);
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },
        //选择项目
        async changeName(e) {
            const res = await this.$http.post('project/get', { accessKey: this.accessKey, name: e });
            console.log(res);
            var data = res.data.response;
            var startTime = data.startTime.substring(0, 10);
            var endTime = data.endTime.substring(0, 10);
            this.startTime = startTime;
            this.endTime = endTime;
        },
        //选择地区
        async changeCity(e) {
            this.ProjectNameList = [];
            this.ProjectNameData = '';
            this.startTime = '';
            this.endTime = '';

            const res = await this.$http.post('project/getList', { accessKey: this.accessKey, serviceAddress: e });
            let data = res.data.response;
            if (res.data.code == 0) {
                for (var i in data) {
                    let lable = data[i].name;
                    let value = data[i].name;
                    this.ProjectNameList.push({ lable, value });
                }
            }
        },
        async SearchEquipment() {
            var params = {
                accessKey: this.accessKey,
                equipments:this.allEquipment,
                startTime: this.startTime,
                endTime: this.endTime
            };
            console.log(params)
            const res = await this.$http.post('data/getStatisticByEquipments', params);
            var data  = res.data.response
            this.tableData = data
            console.log(data)
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
.lh32 {
    line-height: 32px;
    text-align: right;
}
</style>
