<template>
    <div class="container">
        <div slot="header">
            <my-bread>项目列表</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="index" width="80" align="center"></el-table-column>
            <el-table-column label="项目名称" align="center">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" align="center" :formatter="formatDate"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" align="center" :formatter="formatDate"></el-table-column>
            <el-table-column label="合同面积(亩)" align="center">
                <template slot-scope="scope">
                    {{ scope.row.areaInContract }}
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" align="center"></el-table-column>
            <el-table-column prop="serviceAddress" label="实施地点" align="center"></el-table-column>
            <el-table-column prop="pestcide" label="喷洒农药" align="center"></el-table-column>
            <el-table-column prop="appicationRate" label="作业率" align="center"></el-table-column>
            <el-table-column label="添加设备" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="addEquipments(scope.row)">关联设备</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleLook(scope.row)">查看</el-button>
                    <!-- <el-button size="mini" @click="share(scope.row)">分享</el-button> -->
                    <el-button size="mini" type="danger" @click="logout(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="项目详情" :visible.sync="dialogTableVisible" width="95%" @close="sx">
            <el-card class="SJdata">
                <div slot="header" class="clearfix">
                    <span style="font-size: 16px"><i class="el-icon-s-data"></i>数据统计</span>
                    <el-button style="float: right" type="primary" plain size="mini" @click="exportOrderData()">导出</el-button>
                </div>
                <el-table :data="rowData" style="width: 100%" border id="out-table">
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="Time" label="作业时间" align="center" :formatter="formatDate"></el-table-column>
                    <el-table-column label="作业方式" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.EquipmentType == 1">地面设备</div>
                            <div v-else-if="scope.row.EquipmentType == 2">有人机</div>
                            <div v-else>无人机</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="设备编号" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.EquipmentID }}
                        </template>
                    </el-table-column>
                    <el-table-column label="面积(亩)" align="center">
                        <template slot-scope="scope">
                            {{ (scope.row.Area * 0.0015).toFixed(0) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="高度(米)" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.Height }}
                        </template>
                    </el-table-column>
                    <el-table-column label="速度(公里/小时)" align="center">
                        <template slot-scope="scope">
                            {{ (scope.row.Speed * 3.6).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="喷洒距离(公里)" align="center">
                        <template slot-scope="scope">
                            {{ (scope.row.Distance / 1000).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="持续时间" align="center">
                        <template slot-scope="scope">
                            {{ formateSeconds(scope.row.Duration) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="容量(升)" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.Volume }}
                        </template>
                    </el-table-column>
                    <el-table-column label="架次(次)" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.Sorties }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <el-card class="SJdata">
                <div slot="header" class="clearfix">
                    <span style="font-size: 16px"><i class="el-icon-s-data"></i>作业面积</span>
                </div>
                <div>
                    <el-row>
                        <el-col :span="8"><highcharts :options="yrjDistance"></highcharts></el-col>
                        <el-col :span="8"><highcharts :options="wrjDistance"></highcharts></el-col>
                        <el-col :span="8"><highcharts :options="dmDistance"></highcharts></el-col>
                    </el-row>
                </div>
            </el-card>

            <el-card class="SJdata">
                <div slot="header" class="clearfix">
                    <span style="font-size: 16px"><i class="el-icon-s-data"></i> 作业速度</span>
                </div>
                <div>
                    <el-row>
                        <el-col :span="8"><highcharts :options="yrjSpeed"></highcharts></el-col>
                        <el-col :span="8"><highcharts :options="wrjSpeed"></highcharts></el-col>
                        <el-col :span="8"><highcharts :options="dmSpeed"></highcharts></el-col>
                    </el-row>
                </div>
            </el-card>

            <el-card class="SJdata">
                <div slot="header" class="clearfix">
                    <span style="font-size: 16px"><i class="el-icon-s-data"></i> 按天统计</span>
                </div>
                <div>
                    <el-row>
                        <el-col :span="24"><highcharts :options="DayData"></highcharts></el-col>
                    </el-row>
                </div>
            </el-card>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="addEquipment" width="40%">
            <el-card>
                <div slot="header" class="clearfix">
                    <span>该项目已关联设备</span>
                </div>
                <div style="text-align: center">
                    <el-table :data="equipmentTableData.equipment" border style="width: 100%">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="设备编号" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.ID }}
                            </template>
                        </el-table-column>
                        <el-table-column label="设备类型" align="center">
                            <template slot-scope="scope">
                                <el-tag type="primary" v-if="scope.row.type == 1">地面设备</el-tag>
                                <el-tag type="primary" v-else-if="scope.row.type == 2">有人机</el-tag>
                                <el-tag type="primary" v-else>无人机</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="幅宽(单位：米)" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.swath }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>

            <el-card style="margin-top: 30px">
                <div slot="header" class="clearfix">
                    <span>增加新设备</span>
                </div>
                <div>
                    <el-row>
                        <el-col :span="4" style="text-align: right; line-height: 32px"><div>设备id：</div></el-col>
                        <el-col :span="18">
                            <el-select v-model="equipment.id" filterable placeholder="请选择">
                                <el-option v-for="(item, index) in allshebei" :key="index" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 20px">
                        <el-col :span="4" style="text-align: right; line-height: 32px"><div>幅宽：</div></el-col>
                        <el-col :span="18"
                            ><el-input v-model="equipment.swath" style="width: 100px" placeholder="(单位：米)"></el-input>
                        </el-col>
                    </el-row>
                </div>
                <div style="text-align: center; margin-top: 40px">
                    <el-button @click="addEquipment = false">取 消</el-button>
                    <el-button type="primary" @click="submitAdd">确 定</el-button>
                </div>
            </el-card>
        </el-dialog>
    </div>
</template>

<script>
import moment from 'moment';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
export default {
    inject: ['reload'],
    data() {
        return {
            equipmentTableData: '', // 该项目已关联的设备

            allshebei: [], // 所有设备的盒子

            equipment: {
                //新加设备参数
                id: '',
                swath: ''
            },
            name: '', // 项目名称

            dialogTableVisible: false, //项目详情的dialog
            addEquipment: false, //关联设备的dialog
            rowData: [], // 项目详情中的表格
            tableData: [], //所有项目表格
            accessKey: '',
            yrjList: [],
            wrjList: [],
            dmList: [],

            DayData: {
                title: {
                    text: '项目整体统计'
                },
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: [],
                    crosshair: true
                },
                scrollbar: {
                    enabled: true
                },
                yAxis: [
                    {
                        gridLineWidth: 0,
                        title: {
                            text: '面积(亩)'
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            }
                        }
                    }
                ],
                tooltip: {
                    shared: true
                },
                plotOptions: {
                    column: {
                        borderWidth: 0
                    }
                },
                series: [
                    {
                        name: '作业面积',
                        data: [],
                        tooltip: {
                            valueSuffix: '亩'
                        }
                    }
                ]
            },

            dmDistance: {
                title: {
                    text: '地面设备'
                },
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: [],
                    crosshair: true
                },
                scrollbar: {
                    enabled: true
                },
                yAxis: [
                    {
                        title: {
                            text: '架次(次)'
                        },
                        labels: {
                            function() {
                                return this.value;
                            },
                            style: {}
                        },
                        opposite: true
                    },
                    {
                        gridLineWidth: 0,
                        title: {
                            text: '面积(亩)'
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            }
                        }
                    }
                ],
                tooltip: {
                    shared: true
                },
                plotOptions: {
                    column: {
                        borderWidth: 0
                    }
                },
                series: [
                    {
                        name: '作业面积',
                        type: 'column',
                        yAxis: 1,
                        data: [],
                        tooltip: {
                            valueSuffix: '亩'
                        }
                    },
                    {
                        name: '架次',
                        data: [],
                        tooltip: {
                            valueSuffix: ' 次'
                        }
                    }
                ]
            },
            yrjDistance: {
                title: {
                    text: '有人机'
                },
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: [],
                    crosshair: true
                },
                scrollbar: {
                    enabled: true
                },
                yAxis: [
                    {
                        title: {
                            text: '架次(次)'
                        },
                        labels: {
                            function() {
                                return this.value;
                            },
                            style: {}
                        },
                        opposite: true
                    },
                    {
                        gridLineWidth: 0,
                        title: {
                            text: '面积(亩)'
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            }
                        }
                    }
                ],
                tooltip: {
                    shared: true
                },
                plotOptions: {
                    column: {
                        borderWidth: 0
                    }
                },
                series: [
                    {
                        name: '作业面积',
                        type: 'column',
                        yAxis: 1,
                        data: [],
                        tooltip: {
                            valueSuffix: '亩'
                        }
                    },
                    {
                        name: '架次',
                        data: [],
                        tooltip: {
                            valueSuffix: ' 次'
                        }
                    }
                ]
            },
            wrjDistance: {
                title: {
                    text: '无人机'
                },
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: [],
                    crosshair: true
                },
                scrollbar: {
                    enabled: true
                },
                yAxis: [
                    {
                        title: {
                            text: '架次(次)'
                        },
                        labels: {
                            function() {
                                return this.value;
                            },
                            style: {}
                        },
                        opposite: true
                    },
                    {
                        gridLineWidth: 0,
                        title: {
                            text: '面积(亩)'
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            }
                        }
                    }
                ],
                tooltip: {
                    shared: true
                },
                plotOptions: {
                    column: {
                        borderWidth: 0
                    }
                },
                series: [
                    {
                        name: '作业面积',
                        type: 'column',
                        yAxis: 1,
                        data: [],
                        tooltip: {
                            valueSuffix: '亩'
                        }
                    },
                    {
                        name: '架次',
                        data: [],
                        tooltip: {
                            valueSuffix: ' 次'
                        }
                    }
                ]
            },

            dmSpeed: {
                title: {
                    text: '地面设备'
                },
                xAxis: [
                    {
                        categories: [],
                        crosshair: true
                    }
                ],
                yAxis: [
                    {
                        title: {
                            text: '持续时间(h)',
                            style: {}
                        },
                        labels: {
                            function() {
                                return this.value;
                            },
                            style: {}
                        },
                        opposite: true
                    },
                    {
                        gridLineWidth: 0,
                        title: {
                            text: '喷洒距离(km)',
                            style: {}
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            },
                            style: {}
                        }
                    },

                    {
                        gridLineWidth: 0,
                        title: {
                            text: '',
                            style: {}
                        },
                        labels: {
                            enabled: false,
                            format: '{value} km/h',
                            style: {}
                        },
                        opposite: true
                    }
                ],
                tooltip: {
                    shared: true
                },
                series: [
                    {
                        name: '喷洒距离',
                        type: 'column',
                        yAxis: 1,
                        data: [],
                        tooltip: {
                            valueSuffix: ' km'
                        }
                    },
                    {
                        name: '持续时间',
                        type: 'line',
                        data: [],
                        tooltip: {
                            valueSuffix: ' h'
                        }
                    },
                    {
                        name: '速度',
                        type: 'line',
                        data: [],
                        yAxis: 2,
                        tooltip: {
                            valueSuffix: ' km/h'
                        }
                    }
                ]
            },
            yrjSpeed: {
                title: {
                    text: '有人机'
                },
                xAxis: [
                    {
                        categories: [],
                        crosshair: true
                    }
                ],
                yAxis: [
                    {
                        title: {
                            text: '持续时间(h)',
                            style: {}
                        },
                        labels: {
                            function() {
                                return this.value;
                            },
                            style: {}
                        },
                        opposite: true
                    },
                    {
                        gridLineWidth: 0,
                        title: {
                            text: '喷洒距离(km)',
                            style: {}
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            },
                            style: {}
                        }
                    },

                    {
                        gridLineWidth: 0,
                        title: {
                            text: '',
                            style: {}
                        },
                        labels: {
                            enabled: false,
                            format: '{value} km/h',
                            style: {}
                        },
                        opposite: true
                    }
                ],
                tooltip: {
                    shared: true
                },
                series: [
                    {
                        name: '喷洒距离',
                        type: 'column',
                        yAxis: 1,
                        data: [],
                        tooltip: {
                            valueSuffix: ' km'
                        }
                    },
                    {
                        name: '持续时间',
                        type: 'line',
                        data: [],
                        tooltip: {
                            valueSuffix: ' h'
                        }
                    },
                    {
                        name: '速度',
                        type: 'line',
                        data: [],
                        yAxis: 2,
                        tooltip: {
                            valueSuffix: ' km/h'
                        }
                    }
                ]
            },
            wrjSpeed: {
                title: {
                    text: '无人机'
                },
                xAxis: [
                    {
                        categories: [],
                        crosshair: true
                    }
                ],
                yAxis: [
                    {
                        title: {
                            text: '持续时间(h)',
                            style: {}
                        },
                        labels: {
                            function() {
                                return this.value;
                            },
                            style: {}
                        },
                        opposite: true
                    },
                    {
                        gridLineWidth: 0,
                        title: {
                            text: '喷洒距离(km)',
                            style: {}
                        },
                        labels: {
                            formatter: function () {
                                return this.value;
                            },
                            style: {}
                        }
                    },

                    {
                        gridLineWidth: 0,
                        title: {
                            text: '',
                            style: {}
                        },
                        labels: {
                            enabled: false,
                            format: '{value} km/h',
                            style: {}
                        },
                        opposite: true
                    }
                ],
                tooltip: {
                    shared: true
                },
                series: [
                    {
                        name: '喷洒距离',
                        type: 'column',
                        yAxis: 1,
                        data: [],
                        tooltip: {
                            valueSuffix: ' km'
                        }
                    },
                    {
                        name: '持续时间',
                        type: 'line',
                        data: [],
                        tooltip: {
                            valueSuffix: ' h'
                        }
                    },
                    {
                        name: '速度',
                        type: 'line',
                        data: [],
                        yAxis: 2,
                        tooltip: {
                            valueSuffix: ' km/h'
                        }
                    }
                ]
            }
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.accessKey = data.user.accessKey;
        this.getList();
        this.getAllEquipments();
    },
    methods: {
        //导出excel
        exportOrderData() {
            var xlsxParam = { raw: true };
            var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'), xlsxParam);
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '数据统计.xlsx');
            } catch (e) {
                if (typeof console !== 'undefined') console.log(e, wbout);
            }
            return wbout;
        },
        //时间格式化
        formatDate: function (row, column) {
            var date = row[column.property];
            if (date == undefined) {
                return '';
            }
            return moment(date).format('YYYY-MM-DD');
        },
        //时间格式化
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
        //查看项目详情
        async handleLook(row) {
            var a = new Array();
            this.dialogTableVisible = true;
            await this.$http.post('data/getDataByProject', { accessKey: this.accessKey, projectName: row.name }).then((res) => {
                var data = res.data.response;
                console.log(data);
                if (data.length == 0) {
                    this.$message.info('该项目暂未关联设备，请先关联设备！');
                }
                this.rowData = data;
                for (var i in data) {
                    //项目整体 当天的数据
                    this.DayData.xAxis.categories.push(data[i].Time);
                    this.DayData.series[0].data.push((data[i].Area * 0.0015).toFixed(0) - 0);

                    if (data[i].EquipmentType == '1') {
                        //地面设备的数据
                        //(距离)
                        this.dmList.push(data[i]);
                        this.dmDistance.xAxis.categories.push(data[i].Time);
                        this.dmDistance.series[0].data.push((data[i].Area * 0.0015).toFixed(0) - 0);
                        //(架次)
                        this.dmDistance.series[1].data.push(data[i].Sorties);
                        //(速度)
                        this.dmSpeed.xAxis[0].categories.push(data[i].Time);
                        this.dmSpeed.series[0].data.push((data[i].Distance / 1000).toFixed(2) - 0);
                        this.dmSpeed.series[1].data.push((data[i].Duration / 3600).toFixed(2) - 0);
                        this.dmSpeed.series[2].data.push((data[i].Speed * 3.6).toFixed(2) - 0);
                    } else if (data[i].EquipmentType == '2') {
                        //有人机的数据
                        //(距离)
                        this.yrjList.push(data[i]);
                        this.yrjDistance.xAxis.categories.push(data[i].Time);
                        this.yrjDistance.series[0].data.push((data[i].Area * 0.0015).toFixed(0) - 0);
                        //(架次)
                        this.yrjDistance.series[1].data.push(data[i].Sorties);
                        //(速度)
                        this.yrjSpeed.xAxis[0].categories.push(data[i].Time);
                        this.yrjSpeed.series[0].data.push((data[i].Distance / 1000).toFixed(2) - 0);
                        this.yrjSpeed.series[1].data.push((data[i].Duration / 3600).toFixed(2) - 0);
                        this.yrjSpeed.series[2].data.push((data[i].Speed * 3.6).toFixed(2) - 0);
                    } else {
                        //无人机数据
                        //(距离)
                        this.wrjList.push(data[i]);
                        this.wrjDistance.xAxis.categories.push(data[i].Time);
                        this.wrjDistance.series[0].data.push((data[i].Area * 0.0015).toFixed(0) - 0);
                        //(架次)
                        this.wrjDistance.series[1].data.push(data[i].Sorties);
                        //(速度)
                        this.wrjSpeed.xAxis[0].categories.push(data[i].Time);
                        this.wrjSpeed.series[0].data.push((data[i].Distance / 1000).toFixed(2) - 0);
                        this.wrjSpeed.series[1].data.push((data[i].Duration / 3600).toFixed(2) - 0);
                        this.wrjSpeed.series[2].data.push((data[i].Speed * 3.6).toFixed(2) - 0);
                    }
                }
            });
        },
        //获取所有项目
        async getList() {
            await this.$http.post('project/getList', { accessKey: this.accessKey }).then((res) => {
                var data = res.data.response;
                var i = data.length;
                while (i--) {
                    if (data[i].censored != 1) {
                        data.splice(i, 1);
                    }
                }
                this.tableData = data;
                console.log(this.tableData)
            });
        },
        //刷新
        sx() {
            this.reload();
        },
        //删除项目
        logout(row) {
            var params = {
                project: {
                    name: row.name
                },
                user: {
                    accessKey: this.accessKey
                }
            };
            this.$confirm('将退出该机构, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('project/delete', params);
                console.log(res.data);
                if (res.data.code == 0) {
                    this.$message.success(res.data.message);
                    this.getList();
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },
        //添加设备dialog 获取当前项目的设备
        async addEquipments(row) {
            this.addEquipment = true;
            this.name = row.name;
            var params = {
                project: {
                    name: this.name
                },
                user: {
                    accessKey: this.accessKey
                }
            };
            var res = await this.$http.post('project/getEquipments', params);
            console.log(res.data.response.equipment);

            if (res.data.code == 0) {
                this.$message.success(res.data.message);
                this.equipmentTableData = res.data.response;
            } else {
                this.$message.error(res.data.message);
            }
        },
        //获取该机构所有的设备
        async getAllEquipments() {
            var params = {
                user: {
                    accessKey: this.accessKey
                }
            };
            var res = await this.$http.post('organization/getEquipments', params);
            var data = res.data.response;
            if (res.data.code == 0) {
                for (var i in data) {
                    this.allshebei.push({
                        value: data[i].ID,
                        label: data[i].ID
                    });
                }
            } else {
                this.$message.error(res.data.message);
            }
        },
        //关联设备确定按钮
        async submitAdd() {
            var params = {
                project: {
                    name: this.name
                },
                user: {
                    accessKey: this.accessKey
                },
                equipment: [this.equipment]
            };
            console.log(params);
            var res = await this.$http.post('project/addEquipments', params);
            var data = res.data.response;
            console.log(data);
            if (res.data.code == 0) {
                this.$message.success(res.data.message);
                this.addEquipment = false;
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
.SJdata {
    margin-bottom: 20px;
}
</style>
