<template>
    <div class="container">
        <div slot="header">
            <my-bread>机构审批</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <template>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <!-- <template slot-scope="scope">￥{{scope.row.money}}</template> -->
                <el-table-column type="index" width="80" align="center"></el-table-column>
                <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
                <el-table-column prop="identity" label="信用代码" align="center"></el-table-column>
                <el-table-column prop="homepage" label="官方网址" align="center"></el-table-column>
                <el-table-column prop="contact" label="联系人" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
                <el-table-column prop="email" label="工作邮箱" align="center"></el-table-column>
                <!-- <el-table-column width="328" label="机构图标" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.logo" :preview-src-list="[scope.row.logo]"></el-image>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">通过</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">驳回</el-button>
                        <!-- <router-link to="/project"></router-link> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="提示" :visible.sync="bhreason" width="30%">
                <el-row>
                    <el-col :span="4" style="text-align: right; line-height: 32px"><div>驳回原因：</div></el-col>
                    <el-col :span="20"><el-input v-model="annotation" placeholder="请输入内容"></el-input> </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="bhreason = false">取 消</el-button>
                    <el-button type="primary" @click="SubmitResone">确 定</el-button>
                </span>
            </el-dialog>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            accessKey: null,
            bhreason: false,
            tableData: [],
            annotation: '',
            name: '',
            identity: ''
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.accessKey = data.user.accessKey;
        console.log(this.accessKey);
        this.tap();
    },
    methods: {
        //获取未审核机构
        async tap() {
            const res = await this.$http.post('organization/getUncensoredOrganization', {
                accessKey: this.accessKey
            });
            if (res.data.result == false) {
                this.tableData = [];
            } else {
                this.tableData = res.data.response;
            }
        },

        //通过机构申请
        async handleEdit(index, row) {
            var parmars = {
                user: {
                    accessKey: this.accessKey
                },
                entity: {
                    name: row.name,
                    identity: row.identity,
                    censored: 1
                }
            };

            this.$confirm('您将通过该机构审请, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('organization/censorOrganization', parmars);
                console.log(res);
                if (res.data.code == 0) {
                    this.$message.success(res.data.message);
                } else {
                    this.$message.error(res.data.message);
                }
                this.tap();
            });
        },

        //驳回机构申请
        async handleDelete(index, row) {
            this.bhreason = true;
            this.name = row.name;
            this.identity = row.identity;
        },
        SubmitResone() {
            var parmars = {
                user: {
                    accessKey: this.accessKey
                },
                entity: {
                    name: this.name,
                    identity: this.identity,
                    censored: -1,
                    annotation: this.annotation
                }
            };
            this.$confirm('您将驳回该机构审请, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('organization/censorOrganization', parmars);
                console.log(res);
                if (res.data.code == 0) {
                    this.$message.success(res.data.message);
                } else {
                    this.$message.error(res.data.message);
                }
                this.bhreason = false;
                this.tap();
            });
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
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
