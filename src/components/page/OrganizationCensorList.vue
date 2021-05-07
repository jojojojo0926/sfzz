<template>
    <div class="container">
        <div slot="header">
            <my-bread>机构列表</my-bread>
        </div>
        <div style="width: 100%; height: 1px; background: #ccc; margin-top: 25px; margin-bottom: 50px"></div>
        <template>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <!-- <template slot-scope="scope">￥{{scope.row.money}}</template> -->
                <el-table-column type="index" width="80" align="center"></el-table-column>
                <el-table-column prop="name" label="机构名称" align="center"></el-table-column>
                <el-table-column prop="address" label="机构地址" align="center"></el-table-column>
                <el-table-column prop="contact" label="联系人" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column label="网址" align="center">
                    <template slot-scope="scope">
                        <a :href="scope.row.homepage" target="blank">{{ scope.row.homepage }}</a>
                        <!-- <router-link to="/project"></router-link> -->
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" v-if="addOrganization">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-search" @click="showIndex(scope.row)">加入</el-button>
                        <!-- <router-link to="/project"></router-link> -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination
                style="margin-top:20px; text-align:center"
                background
                layout="prev, pager, next"
                :page-size="reqParams.per_page"
                :current-page="reqParams.page"
                @current-change="pager"
                :total="total"
            ></el-pagination>-->
        </template>

        <!-- 编辑弹出框 -->
        <el-dialog title="请选择" :visible.sync="editVisible" width="30%">
            <el-select v-model="value1" placeholder="请选择" @change="changeType1">
                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="adduser">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
export default {
    data() {
        return {
            parmars: {
                type: '',
                accessKey: '',
                name: ''
            },
            addOrganization: null,
            editVisible: false,
            tableData: [],
            options1: [
                {
                    value: '2',
                    label: '数据员'
                },
                {
                    value: '4',
                    label: '监管员'
                },
                {
                    value: '8',
                    label: '监理员'
                }
            ],
            value1: '',
            formLabelWidth: '120px',

            reqParams: {
                page: 1, //当前页数
                per_page: 5, // 每页显示的条数
                response_type: 'comment'
            },
            // 总条数
            total: 0
        };
    },
    // 打开页面获取企业审核通过的列表以及获取key
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        console.log(data);
        data.entity ? (this.addOrganization = false) : (this.addOrganization = true);
        this.parmars.accessKey = data.user.accessKey;
        this.tap();
    },
    methods: {
        //当页数发生改变
        pager(newPage) {
            console.log(newPage);
            this.reqParams.page = newPage;
            this.tap();
        },

        //点击表格加入按钮
        showIndex(val) {
            this.parmars.name = val.name;
            this.editVisible = true;
        },

        //用户加入企业的请求
        async adduser() {
            var parmars = {
                user: {
                    accessKey: this.parmars.accessKey
                },
                entity: {
                    name: this.parmars.name
                },
                role: this.parmars.type
            };
            this.$confirm('你将加入该机构, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.post('organization/addUser', parmars);
                console.log(res);
                if (res.data.code == 0) {
                    window.sessionStorage.removeItem('name');
                    this.$router.push('/login');
                    this.$message.success('加入成功，请重新登陆！');
                } else {
                    this.$message.error(res.data.message);
                }
                this.editVisible = false;
            });
        },

        //获取已经审核通过的企业
        async tap() {
            const res = await this.$http.get('organization/getEntities');
            console.log(res);
            this.tableData = res.data.response;
            // this.total = res.data.response.length;
            // console.log(this.total);
            console.log(res.data.response);
        },

        //下拉框选择
        changeType1(e) {
            this.parmars.type = Number(e);
            console.log(e);
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
</style>
