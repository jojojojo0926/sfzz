<template>
    <div class="container">
        <div slot="header">
            <my-bread>项目审批</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="index" width="80" align="center"></el-table-column>
            <el-table-column label="项目名称" align="center">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
            <el-table-column prop="areaInContract" label="合同面积" align="center"></el-table-column>
            <el-table-column prop="times" label="作业次数" align="center"></el-table-column>
            <el-table-column prop="description" label="项目描述" align="center"></el-table-column>
            <el-table-column prop="serviceAddress" label="实施地址" align="center"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="handleEdit(scope.row)">通过</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="提示" :visible.sync="bhreason" width="30%">
            <el-row>
                <el-col :span="4" style="text-align: right; line-height: 32px"><div>驳回原因：</div></el-col>
                <el-col :span="20"><el-input v-model="state" placeholder="请输入内容"></el-input> </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bhreason = false">取 消</el-button>
                <el-button type="primary" @click="SubmitResone">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rowData: [],
            tableData: [],
            accessKey: '',
            bhreason: false,
            name: '',
            state: ''
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.accessKey = data.user.accessKey;
        this.getUnCensored();
    },
    methods: {
        async handleEdit(row) {
            this.$confirm('您将通过项目申报，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await this.$http
                    .post('project/censorProject', { accessKey: this.accessKey, censored: 1, name: row.name, state: '' })
                    .then((res) => {
                        console.log(res);
                        if (res.data.code == 0) {
                            this.$message.success(res.data.message);
                            this.getUnCensored();
                        } else {
                            this.$message.error(res.data.message);
                        }
                    });
            });
        },
        SubmitResone() {
            this.$confirm('您将驳回项目申报，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await this.$http
                    .post('project/censorProject', { accessKey: this.accessKey, censored: -1, name: this.name, state: this.state })
                    .then((res) => {
                        console.log(res);
                        if (res.data.code == 0) {
                            this.$message.success(res.data.message);
                            this.getUnCensored();
                        } else {
                            this.$message.error(res.data.message);
                        }
                        this.bhreason = false;
                    });
            });
        },
        handleDelete(row) {
            this.bhreason = true;
            this.name = row.name;
        },
        async getUnCensored() {
            await this.$http.post('project/getUncensored', { accessKey: this.accessKey }).then((res) => {
                console.log(res);
                if (res.data.result == false) {
                    this.$message.error(res.data.message);
                    this.tableData = [];
                } else {
                    if (res.data.code == 0) {
                        this.$message.success(res.data.message);
                        this.tableData = res.data.response;
                    } else {
                        this.$message.error(res.data.message);
                    }
                }
            });
        }
    }
};
</script>
<style>
.title {
    padding: 50px;
    text-align: center;
    font-size: 30px;
}
.times {
    width: 300px;
    background-color: #fff;
    border-color: #e4e7ed;
    color: #000;
}
.tac .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #e4e7ed;
    color: #000;
}
</style>
