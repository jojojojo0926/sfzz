<template>
    <div class="sidebar">
        <div class="top">
            <div class="yuan">
                <img v-if="this.role == 0" class="qqq" src="../../assets/img/user/youke.png" />
                <img v-else-if="this.role == 1" class="qqq" src="../../assets/img/user/guanli.png" />
                <img v-else-if="this.role == 2" class="qqq" src="../../assets/img/user/shuju.png" />
                <img v-else-if="this.role == 4" class="qqq" src="../../assets/img/user/jianguan.png" />
                <img v-else-if="this.role == 8" class="qqq" src="../../assets/img/user/jianli.png" />
                <img v-else class="qqq" :src="TxImg" />
            </div>
            <div class="name">你好：{{ this.name }}</div>
            <div class="jigou">
                <p v-if="Img">暂未加入机构</p>
                <p v-else>所属机构：{{ this.jg }}</p>
                <p style="margin-top: 20px">你的权限：{{ this.qx }}</p>
            </div>
        </div>
        <el-menu default-active="2" class="el-menu-vertical-demo sidebar-el-menu" background-color="#fff" text-color="#333" router>
            <el-menu-item index="/ditu">
                <i class="el-icon-lx-home"></i>
                <span slot="title">系统首页</span>
            </el-menu-item>

            <!-- <el-menu-item index="/equipment">
                <i class="el-icon-lx-home"></i>
                <span slot="title">设备管理</span>
            </el-menu-item> -->

            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-video-camera"></i>
                    <span>设备管理</span>
                </template>
                <el-menu-item index="/equipmentdm">
                    <i class="el-icon-truck"></i>
                    <span slot="title">地面设备</span>
                </el-menu-item>
                <el-menu-item index="/equipmentyrj">
                    <i class="el-icon-position"></i>
                    <span slot="title">有人机</span>
                </el-menu-item>
                <el-menu-item index="/equipmentwrj">
                    <i class="el-icon-place"></i>
                    <span slot="title">无人机</span>
                </el-menu-item>
            </el-submenu>

            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-s-grid"></i>
                    <span>机构管理</span>
                </template>
                <el-menu-item index="/organizationregister">
                    <i class="el-icon-postcard"></i>
                    <span slot="title">机构注册</span>
                </el-menu-item>
                <el-menu-item index="/organizationcensorlist">
                    <i class="el-icon-tickets"></i>
                    <span slot="title">机构列表</span>
                </el-menu-item>
                <el-menu-item index="/organizationuncensorlist">
                    <i class="el-icon-edit-outline"></i>
                    <span slot="title">机构审批</span>
                </el-menu-item>
                <el-menu-item index="/organizationinfo">
                    <i class="el-icon-document"></i>
                    <span slot="title">机构信息</span>
                </el-menu-item>
            </el-submenu>

            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-folder-opened"></i>
                    <span>项目管理</span>
                </template>
                <el-menu-item index="/projectlist">
                    <i class="el-icon-lx-search"></i>
                    <span slot="title">项目浏览</span>
                </el-menu-item>
                <el-menu-item index="/projectreport">
                    <i class="el-icon-edit-outline"></i>
                    <span slot="title">项目申报</span>
                </el-menu-item>
                <el-menu-item index="/projectcensor">
                    <i class="el-icon-tickets"></i>
                    <span slot="title">项目审批</span>
                </el-menu-item>
            </el-submenu>

            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-user-solid"></i>
                    <span>用户管理</span>
                </template>
                <!-- <el-menu-item index="/userlist">
                    <i class="el-icon-user"></i>
                    <span slot="title">用户列表</span>
                </el-menu-item> -->
                <el-menu-item index="/usercensor">
                    <i class="el-icon-time"></i>
                    <span slot="title">用户列表</span>
                </el-menu-item>
                <el-menu-item index="/usersetting">
                    <i class="el-icon-setting"></i>
                    <span slot="title">个人设置</span>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
// import bus from '../common/bus';
export default {
    data() {
        return {
            role: null,
            collapse: false,
            name: '',
            jg: '',
            qx: '',
            Img: null,
            imgUrl: ''
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        // console.log(data);
        this.role = data.role;
        if (data.role == 0) {
            this.qx = '游客';
        } else if (data.role == 1) {
            this.qx = '管理员';
        } else if (data.role == 2) {
            this.qx = '数据员';
        } else if (data.role == 4) {
            this.qx = '监管员';
        } else if (data.role == 8) {
            this.qx = '监理员';
        } else {
            this.qx = '其他';
        }
        if (data.entity) {
            this.Img = false;
            this.name = data.user.username;
            this.jg = data.entity.name;

            this.imgUrl = data.entity.logo;
        } else {
            this.Img = true;
            this.name = data.user.username;
        }
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 100px;
    bottom: 0;
    overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}

.sidebar > ul {
    height: 100%;
}
.top {
    height: 330px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
    background-color: #fff;
    padding-top: 20px;
}
.yuan {
    width: 150px;
    height: 150px;
}
.name {
    margin-top: 30px;
    font-size: 22px;
    color: #000;
}
.jigou {
    color: darkgrey;
    text-align: center;
    width: 85%;
    margin-top: 30px;
    font-size: 14px;
}
.qqq {
    width: 100%;
    height: 100%;
}
</style>