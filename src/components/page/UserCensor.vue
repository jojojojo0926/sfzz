<template>
    <div class="container">
        <div slot="header">
            <my-bread>用户审核</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <template>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <!-- <template slot-scope="scope">￥{{scope.row.money}}</template> -->
                <el-table-column type="index" width="80" align="center"></el-table-column>
                <el-table-column prop="user.username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="user.name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="user.phone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="user.mail" label="邮箱" align="center"></el-table-column>
                <el-table-column label="角色" align="center">
                    <template slot-scope="scope">
                        <el-tag  v-if="scope.row.role == 1">管理员</el-tag>
                        <el-tag type="success" v-else-if="scope.row.role == 2">数据员</el-tag>
                        <el-tag type="success" v-else-if="scope.row.role == 4">监管员</el-tag>
                        <el-tag type="success" v-else-if="scope.row.role == 8">监理员</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.censored == 1">
                            <el-button size="mini">已通过审核</el-button>
                        </div>
                        <div v-else>
                            <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">通过</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">驳回</el-button>
                        </div>
                        <!-- <router-link to="/project"></router-link> -->
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            accessKey: '',
            tableData: []
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.accessKey = data.user.accessKey;
        this.tap();
    },
    methods: {
        async tap() {
            const res = await this.$http.post('organization/getUserList', {
                accessKey: this.accessKey
            });
            var data = res.data.response;
            if (data) {
                var i = data.length;
                while (i--) {
                    if (data[i].censored == -1) {
                        data.splice(i, 1);
                    }
                }
                console.log(data);
                this.tableData = data;
            } else {
                return;
            }
        },

        //通过用户申请
        async handleEdit(index, row) {
            var params = {
                user: {
                    accessKey: this.accessKey,
                    username: row.user.username
                },
                censored: 1
            };
            this.$confirm('您将通过该用户审核, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('organization/censorUser', params);
                if (res.data.code == 0) {
                    this.$message.success(res.data.message);
                } else {
                    this.$message.error(res.data.message);
                }
                this.tap();
            });
        },

        //驳回用户申请
        async handleDelete(index, row) {
            var params = {
                user: {
                    accessKey: this.accessKey,
                    username: row.user.username
                },
                censored: -1
            };
            this.$confirm('您将驳回该用户审核, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('organization/censorUser', params);
                if (res.data.code == 0) {
                    this.$message.success(res.data.message);
                } else {
                    this.$message.error(res.data.message);
                }
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
