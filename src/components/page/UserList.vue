<template>
    <div class="container">
        <div slot="header">
            <my-bread>用户列表</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <template>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <!-- <template slot-scope="scope">￥{{scope.row.money}}</template> -->
                <el-table-column type="index" width="80" align="center"></el-table-column>
                <el-table-column prop="user.username" label="注册账号" align="center"></el-table-column>
                <el-table-column prop="user.name" label="注册人姓名" align="center"></el-table-column>
                <el-table-column prop="user.phone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="user.mail" label="电子邮箱" align="center"></el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            accessKey: null,
            tableData: []
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.accessKey = data.user.accessKey;
        console.log(this.accessKey);
        this.tap();
    },
    methods: {
        showIndex(val) {},
        async tap() {
            const res = await this.$http.post('organization/getUserList', {
                accessKey: this.accessKey
            });
            console.log(res);
            this.tableData = res.data.response;
            if (res.data.code == 0) {
                this.$message.success(res.data.message);
            } else {
                this.$message.error(res.data.message);
            }
        },
        async handleEdit(index, row) {
            this.$confirm('您将通过该企业审核, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('organization/censorUser', {
                    censored: 1,
                    name: row.username,
                    accessKey: this.accessKey
                });
                console.log(res);
                this.tableData = res.data.response;
                if (res.data.code == 0) {
                    this.$message.success(res.data.message);
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },

        async handleDelete(index, row) {
            this.$confirm('您将驳回该企业审核, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('organization/censorUser', {
                    accessKey: this.accessKey,
                    name: row.username,
                    censored: -1
                });
                console.log(res);
                if (res.data.code == 0) {
                    this.$message.success(res.data.message);
                } else {
                    this.$message.error(res.data.message);
                }
                location.reload();
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
